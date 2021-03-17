import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";
import path from "path";

async function main() {
  const files = fs.readdirSync(path.resolve(__dirname, "./seeds"));

  const contents = files.map((file) => {
    return {
      fname: file,
      content: fs.readFileSync(
        path.resolve(__dirname, `./seeds/${file}`),
        "utf8",
      ),
    };
  });

  for await (const sql of contents) {
    console.log(`processing file ${sql.fname}`);
    await prisma.$executeRaw(`${sql.content}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
