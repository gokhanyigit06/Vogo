import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prismaOptions: any = {
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
};

// In Prisma 7, for direct connections, we pass the URL via datasources
prismaOptions.datasources = {
    db: {
        url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres",
    },
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient(prismaOptions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
