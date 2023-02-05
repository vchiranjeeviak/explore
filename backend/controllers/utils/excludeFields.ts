import { User } from './../../../node_modules/.prisma/client/index.d';

export interface userWithoutPassword {
    id: number,
    userName: string,
    userEmail: string
}

export const excludePassword = (user: User): userWithoutPassword => {
    const userWithoutPassword = {
        id: user.id,
        userName: user.userName,
        userEmail: user.userEmail
    }
    return userWithoutPassword
}