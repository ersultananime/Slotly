import { lookup } from 'node:dns/promises'
import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'
import { isIP } from 'node:net'
import ipaddr from 'ipaddr.js'
import { loadBuffer } from 'cheerio'

export class WebsiteError extends Error {}
export type WebsitePage = { url: string; title: string; text: string }

export function publicAddress(address: string): boolean {
  if (!ipaddr.isValid(address)) return false
  return ipaddr.process(address).range() === 'unicast'
}

export function websiteUrl(input: string): URL {
  if (!input.trim() || input.length > 2048) throw new WebsiteError('Введите ссылку на сайт компании.')
  let url: URL
  try { url = new URL(/^[a-z][a-z\d+.-]*:/i.test(input.trim()) ? input.trim() : `https://${input.trim()}`) }
  catch { throw new WebsiteError('Проверьте ссылку. Например: https://company.kz') }
  const host = url.hostname.replace(/^\[|\]$/g, '')
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port ||
    !host.includes('.') || host.endsWith('.') || (isIP(host) && !publicAddress(host)) ||
    /(^|\.)(localhost|local|internal|test|invalid)$/.test(host)) {
    throw new WebsiteError('Укажите публичный сайт компании с адресом http:// или https://.')
  }
  url.hash = ''
  return url
}

async function resolvePublic(url: URL, signal: AbortSignal) {
  const addresses = await new Promise<{ address: string; family: number }[]>((resolve, reject) => {
    const abort = () => reject(new WebsiteError('Сайт отвечает слишком долго. Попробуйте позже.'))
    if (signal.aborted) return abort()
    signal.addEventListener('abort', abort, { once: true })
    lookup(url.hostname, { all: true, verbatim: true })
      .then(resolve, reject).finally(() => signal.removeEventListener('abort', abort))
  })
  if (!addresses.length || addresses.some(item => !publicAddress(item.address))) {
    throw new WebsiteError('Этот адрес недоступен для анализа. Укажите публичный сайт компании.')
  }
  return addresses[0]
}

// Pin the verified IP to the socket. A second DNS lookup could enable DNS rebinding.
export async function downloadPage(input: URL, signal: AbortSignal, allowedOrigin?: string): Promise<{ url: URL; body: Buffer; charset?: string }> {
  let url = input
  for (let redirects = 0; redirects <= 4; redirects++) {
    url = websiteUrl(url.href)
    if (allowedOrigin && url.origin !== allowedOrigin) throw new WebsiteError('Страница ведёт на другой сайт.')
    const address = await resolvePublic(url, signal)
    const result = await new Promise<{ location?: string; body: Buffer; charset?: string }>((resolve, reject) => {
      const request = (url.protocol === 'https:' ? httpsRequest : httpRequest)(url, {
        agent: false, signal, family: address.family,
        // Preserve the hostname for Host and TLS, but connect only to the checked address.
        lookup: (_hostname, _options, callback) => callback(null, address.address, address.family),
        headers: { 'User-Agent': 'SlotlyWebsiteImporter/1.0', Accept: 'text/html', 'Accept-Encoding': 'identity' },
      }, response => {
        response.on('error', reject)
        if ([301, 302, 303, 307, 308].includes(response.statusCode ?? 0)) {
          const location = response.headers.location
          response.destroy()
          if (!location) reject(new WebsiteError('Сайт вернул некорректное перенаправление.'))
          else resolve({ location, body: Buffer.alloc(0) })
          return
        }
        if ((response.statusCode ?? 500) >= 400 || !/text\/html|application\/xhtml\+xml/i.test(response.headers['content-type'] ?? '')) {
          response.destroy()
          reject(new WebsiteError('Не удалось прочитать страницу. Сайт может ограничивать автоматический доступ. Можно заполнить информацию вручную.'))
          return
        }
        if (response.headers['content-encoding'] && response.headers['content-encoding'] !== 'identity') {
          response.destroy()
          reject(new WebsiteError('Сайт вернул неподдерживаемый формат. Заполните информацию вручную.'))
          return
        }
        let bytes = 0
        const chunks: Buffer[] = []
        response.on('data', (chunk: Buffer) => {
          bytes += chunk.length
          if (bytes > 2_000_000) {
            request.destroy(new WebsiteError('Страница слишком большая. Укажите ссылку на страницу услуг.'))
          } else chunks.push(chunk)
        })
        const charset = /charset=["']?([^\s;"']+)/i.exec(response.headers['content-type'] ?? '')?.[1]
        response.on('end', () => resolve({ body: Buffer.concat(chunks), charset }))
      })
      request.on('error', reject)
      request.end()
    })
    if (!result.location) return { url, body: result.body, charset: result.charset }
    url = new URL(result.location, url)
  }
  throw new WebsiteError('На сайте слишком много перенаправлений.')
}

export function extractPage(body: Buffer, url: URL, charset?: string) {
  const $ = loadBuffer(body, { encoding: { defaultEncoding: 'utf-8', transportLayerEncodingLabel: charset } })
  const title = $('title').first().text().trim().slice(0, 300)
  const links = new Map<string, number>()
  $('a[href]').each((_, element) => {
    try {
      const link = new URL($(element).attr('href')!, url)
      link.hash = ''
      if (link.origin !== url.origin || link.href === url.href || link.search || /\.(pdf|jpg|png|zip|docx?)$/i.test(link.pathname)) return
      const label = `${decodeURIComponent(link.pathname)} ${$(element).text()}`
      const score = /услуг|service|цен|price|pricing|тариф|faq|вопрос|contact|контакт|about|о-компан|о-нас|біз|қызмет|баға/i.test(label) ? 10 : 0
      if (score) links.set(link.href, score)
    } catch { /* Ignore malformed links. */ }
  })
  $('script, style, noscript, svg, iframe, template, form, [hidden], [aria-hidden="true"]').remove()
  $('br').replaceWith('\n')
  $('p, div, section, article, li, h1, h2, h3, h4, tr, footer, header').each((_, element) => { $(element).append('\n') })
  const description = $('meta[name="description"]').attr('content') ?? ''
  const text = `${title}\n${description}\n${$('body').text()}`.replace(/[\t \u00a0]+/g, ' ').replace(/\n\s*\n/g, '\n').trim().slice(0, 14000)
  return { page: { url: url.href, title, text }, links: [...links.keys()].slice(0, 4) }
}

export async function collectWebsite(input: string) {
  const signal = AbortSignal.timeout(25000)
  const first = await downloadPage(websiteUrl(input), signal)
  const parsed = extractPage(first.body, first.url, first.charset)
  const pages: WebsitePage[] = [parsed.page]
  const results = await Promise.allSettled(parsed.links.map(async link => {
    const response = await downloadPage(new URL(link), signal, first.url.origin)
    return extractPage(response.body, response.url, response.charset).page
  }))
  let skipped = 0
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.text.length >= 100) {
      if (!pages.some(page => page.url === result.value.url)) pages.push(result.value)
    } else skipped++
  }
  const readable = pages.filter(page => page.text.length >= 100)
  if (!readable.length) throw new WebsiteError('На сайте недостаточно доступного текста. Возможно, страницы загружаются через JavaScript. Добавьте описание вручную.')
  return { pages: readable, skipped }
}
