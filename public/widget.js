(function () {
  'use strict'

  if (window.__slotlyWidgetLoaded) return

  var script = document.currentScript
  if (!script) return

  var companyId = script.getAttribute('data-company-id') || ''
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(companyId)) {
    console.error('Slotly: укажите корректный data-company-id')
    return
  }

  window.__slotlyWidgetLoaded = true

  var widgetOrigin = new URL(script.src, window.location.href).origin
  var sourcePage = window.location.origin + window.location.pathname
  var iframe = document.createElement('iframe')
  var position = script.getAttribute('data-position') === 'bottom-left' ? 'left' : 'right'

  iframe.src = widgetOrigin + '/widget?companyId=' + encodeURIComponent(companyId)
    + '&page=' + encodeURIComponent(sourcePage)
  iframe.title = 'Консультант Slotly'
  iframe.setAttribute('aria-label', 'Консультант Slotly')
  iframe.setAttribute('allow', 'clipboard-write')
  iframe.referrerPolicy = 'strict-origin-when-cross-origin'
  iframe.style.position = 'fixed'
  iframe.style.bottom = '12px'
  iframe.style[position] = '12px'
  iframe.style.width = '76px'
  iframe.style.height = '76px'
  iframe.style.border = '0'
  iframe.style.background = 'transparent'
  iframe.style.colorScheme = 'light'
  iframe.style.zIndex = '2147483000'
  iframe.style.transition = 'width 180ms ease, height 180ms ease'

  function resize(open) {
    iframe.style.width = open ? 'min(390px, calc(100vw - 24px))' : '76px'
    iframe.style.height = open ? 'min(680px, calc(100vh - 24px))' : '76px'
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== widgetOrigin || event.source !== iframe.contentWindow) return
    if (!event.data || event.data.type !== 'slotly:resize') return
    resize(event.data.open === true)
  })

  document.body.appendChild(iframe)
})()
