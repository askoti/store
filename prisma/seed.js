const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. Clean the database (removes old data so you don't double up)
  await prisma.product.deleteMany()

  // 2. Define your "Midnight Edition" products
  const products = [
    {
      name: "Void Hoodie",
      description: "Heavyweight 500gsm organic cotton in deep carbon black.",
      price: 120.00,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Obsidian Keycaps",
      description: "PBT double-shot keycaps with a stealth matte finish.",
      price: 65.00,
      category: "Tech",
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Matte Black Tumbler",
      description: "Vacuum insulated 20oz steel bottle.",
      price: 35.00,
      category: "Lifestyle",
      image: "https://images.unsplash.com/photo-1517254456976-ee8682099819?auto=format&fit=crop&q=80&w=800"
    }
  ]

  // 3. Insert them into Postgres
  for (const item of products) {
    await prisma.product.create({ data: item })
  }

  console.log("Database seeded with 3 dark items! 🌑")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })