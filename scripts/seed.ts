const { PrismaClient } = require("@prisma/client");


const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: "Human"},
                { name: "Elf"},
                { name: "Orc"},
                { name: "Dwarf"},
                { name: "Alien"},
                { name: "Goblin"},
                { name: "Monster"},
                { name: "Dark Fantasy"},
                { name: "High Fantasy"},
                { name: "Historical Fantasy"},
                { name: "Urban Fantasy"},
            ]
        });
    } catch (error){
        console.error("Error seeding default categories", error);
    } finally {
        await db.$disconnect();
    }
};

main();