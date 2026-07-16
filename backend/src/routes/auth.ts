import { Router } from 'express'
import {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import auth from '../middlewares/auth'
import { csrfTokenMiddleware, csrfProtection } from '../middlewares/csrf'

const authRouter = Router()
authRouter.get('/csrf-token', csrfTokenMiddleware)
authRouter.post('/login', csrfProtection, login)
authRouter.post('/register', csrfProtection, register)
authRouter.get('/user', auth, getCurrentUser)
authRouter.get('/user/roles', auth, getCurrentUserRoles)
authRouter.patch('/me', auth, csrfProtection, updateCurrentUser)
authRouter.post('/token', csrfProtection, refreshAccessToken)
authRouter.post('/logout', auth, csrfProtection, logout)

export default authRouter
