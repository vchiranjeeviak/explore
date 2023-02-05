// This file consists of functions which control the requests coming to authRouter 
import { createAndGetToken, deleteToken } from './utils/token';
import { excludePassword } from './utils/excludeFields';
import { getPrismaClient } from './../db';
import { applySignupValidations, applyLoginValidations } from './utils/validations';
import { Request, Response } from './../../node_modules/@types/express-serve-static-core/index.d';
import { HmacSHA256 } from 'crypto-js';

export const signup = async (req: Request, res: Response) => {
    const {
        userEmail,
        userPassword,
        confirmPassword,
        userName
    } = req.body

    const isValid = applySignupValidations({
        userEmail,
        userPassword,
        confirmPassword,
        userName
    })

    if (!isValid) {
        return res.status(400).json({
            error: 'Invalid signup data.'
        })
    }

    const encryptedPassword = HmacSHA256(userPassword, process.env.HASH_KEY || '').toString()

    const prisma = getPrismaClient()
    try {
        const user = await prisma.user.create({
            data: {
                userName,
                userEmail,
                encryptedPassword
            }
        })

        const userWithoutPassword = excludePassword(user)

        return res.status(200).json({
            user: userWithoutPassword
        })
    } catch (error) {
        return res.status(500).json({
            message: 'User creation failed.',
            error
        })
    }
}

export const login = async (req: Request, res: Response) => {
    const {
        userEmail,
        userPassword
    } = req.body

    const isValid = applyLoginValidations({
        userEmail,
        userPassword
    })

    if (!isValid) {
        return res.status(400).json({
            error: 'Invalid login data.'
        })
    }

    const prisma = getPrismaClient()

    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                userEmail: userEmail
            }
        })

        const encryptedPassword = HmacSHA256(userPassword, process.env.HASH_KEY || '').toString()

        if (user.encryptedPassword !== encryptedPassword) {
            return res.status(400).json({
                message: 'Wrong password.'
            })
        }

        const token: string | null = await createAndGetToken(prisma, user)
        if (!token) {
            return res.status(400).json({
                message: 'Login failed.',
            })
        }
        const userWithoutPassword = excludePassword(user)
        return res.status(200).json({
            user: userWithoutPassword,
            auth_token: token
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid credentials.',
            error
        })
    }
}

export const logout = async (req: Request, res: Response) => {
    const { userId } = req.body;

    const prisma = getPrismaClient()

    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if (!user) {
        return res.status(400).json({
            message: 'No user found.'
        })
    }

    const { isError } = await deleteToken(prisma, user)

    if (isError) {
        return res.status(500).json({
            message: 'Failed to delete token secret.'
        })
    }

    return res.status(200).json({
        message: "Logged out successfully."
    })
}