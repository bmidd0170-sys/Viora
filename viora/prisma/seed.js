const { PrismaClient } = require('@prisma/client');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Clear existing data
    await prisma.publishedImage.deleteMany();
    console.log('🗑️  Cleared existing published images');

    // Create sample published images
    const sampleImages = [
        {
            prompt: 'A serene mountain landscape at sunset with vibrant orange and pink skies',
            imageUrl: 'https://example.com/images/mountain-sunset.jpg',
            hearts: 42,
        },
        {
            prompt: 'A cute robot playing with a puppy in a futuristic city',
            imageUrl: 'https://example.com/images/robot-puppy.jpg',
            hearts: 128,
        },
        {
            prompt: 'An enchanted forest with glowing mushrooms and fireflies',
            imageUrl: 'https://example.com/images/enchanted-forest.jpg',
            hearts: 95,
        },
        {
            prompt: 'A cozy coffee shop on a rainy day with warm lighting',
            imageUrl: 'https://example.com/images/coffee-shop.jpg',
            hearts: 73,
        },
        {
            prompt: 'A majestic dragon soaring through clouds above medieval castles',
            imageUrl: 'https://example.com/images/dragon-castle.jpg',
            hearts: 156,
        },
    ];

    for (const image of sampleImages) {
        const created = await prisma.publishedImage.create({
            data: image,
        });
        console.log(`✅ Created image: ${created.id} - "${created.prompt.substring(0, 50)}..."`);
    }

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
