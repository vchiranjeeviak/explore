import { PrismaClient } from './../../node_modules/.prisma/client/index.d';
import { signup, login } from './../controllers/authController';
// All authentication related routes are present in this file
import express from 'express'
import { Router } from './../../node_modules/@types/express-serve-static-core/index.d';
import { logout } from '../controllers/authController';

const authRouter: Router = express.Router()

authRouter.use((_req, _res, next) => {
    next()
})

// Sign up route
authRouter.post('/signup', signup)

// Login route
authRouter.post('/login', login)

// Logout route
authRouter.get('/logout', logout)

export default authRouter