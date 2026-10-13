import { db } from '../src/lib/db'

/**
 * Seed скрипт — заполняет БД начальными данными.
 * Запуск: npx tsx prisma/seed.ts
 */
async function main() {
  console.log('🌱 Начинаю сид...')

  // ── Категории ──────────────────────────────────────────────
  await db.category.createMany({
    data: [
      { slug: 'salony-krasoty',    name: 'Салоны красоты',    icon: 'Sparkles', gradient: 'from-coral to-coral-deep', sortOrder: 1 },
      { slug: 'manikyur-pedikyur', name: 'Маникюр и педикюр', icon: 'Hand',     gradient: 'from-coral to-sand',       sortOrder: 2 },
      { slug: 'barbershopy',       name: 'Барбершопы',        icon: 'Scissors', gradient: 'from-ink to-ink-soft',     sortOrder: 3 },
      { slug: 'brovi-resnitsy',    name: 'Брови и ресницы',   icon: 'Eye',      gradient: 'from-pine to-pine-soft',   sortOrder: 4 },
      { slug: 'tatu-pirsing',      name: 'Тату и пирсинг',    icon: 'PenTool',  gradient: 'from-ink to-coral-deep',   sortOrder: 5 },
      { slug: 'vizazhisty',        name: 'Визажисты',         icon: 'Palette',  gradient: 'from-sand to-coral',       sortOrder: 6 },
      { slug: 'parikmakhery',      name: 'Парикмахеры',       icon: 'Scissors', gradient: 'from-pine to-ink',         sortOrder: 7 },
      { slug: 'kosmetologiya',     name: 'Косметология',      icon: 'Droplets', gradient: 'from-coral to-pine',       sortOrder: 8 },
      { slug: 'massazh',           name: 'Массаж',            icon: 'Heart',    gradient: 'from-sand to-pine',        sortOrder: 9 },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Категории созданы')
  console.log('🎉 Сид завершён!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сида:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
