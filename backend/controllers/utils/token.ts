import { PrismaClient } from '@prisma/client';
import { User } from './../../../node_modules/.prisma/client/index.d';
import { sign } from 'jsonwebtoken';

export const createAndGetToken = async (prisma: PrismaClient, user: User): Promise<string | null> => {
    const tokenSecret = user.encryptedPassword + Date.now()
    const token = sign(
        user.userEmail,
        tokenSecret
    )

    try {
        const existingToken = await prisma.token.findFirst({
            where: {
                userEmail: user.userEmail
            }
        })
        if (existingToken) {
            await prisma.token.delete({
                where: {
                    userEmail: user.userEmail
                }
            })
        }
        await prisma.token.create({
            data: {
                userEmail: user.userEmail,
                tokenSecret
            }
        })

        return token
    } catch (error) {
        console.log(error)
        return null
    }
}

export const deleteToken = async (prisma: PrismaClient, user: User): Promise<{ isError: boolean }> => {
    const existingToken = await prisma.token.findFirst({
        where: {
            userEmail: user.userEmail
        }
    })

    if (!existingToken) {
        return { isError: false }
    }

    try {
        await prisma.token.delete({
            where: {
                userEmail: user.userEmail
            }
        })
    } catch (error) {
        return { isError: true }
    }

    return { isError: false }
}