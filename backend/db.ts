import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

export const configureDB = (): void => {
    prisma = new PrismaClient()
    prisma.$connect()
}

export const getPrismaClient = (): PrismaClient => {
    return prisma
}