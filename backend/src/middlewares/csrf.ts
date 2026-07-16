import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import ForbiddenError from '../errors/forbidden-error'

const CSRF_COOKIE_NAME = '_csrf'
const CSRF_HEADER_NAME = 'x-csrf-token'

export const generateCsrfToken = (res: Response): string => {
    const token = crypto.randomBytes(32).toString('hex')

    res.cookie(CSRF_COOKIE_NAME, token, {
        httpOnly: false,
        sameSite: 'lax',
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
    })

    return token
}

export const csrfTokenMiddleware = (
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const token = generateCsrfToken(res)
    res.json({ csrfToken: token })
}

export const csrfProtection = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next()
    }

    const cookieToken = req.cookies[CSRF_COOKIE_NAME]
    const headerToken = req.headers[CSRF_HEADER_NAME] as string | undefined
    
    const { _csrf, csrfToken: bodyCsrfToken } = req.body || {}
    const bodyToken = _csrf || bodyCsrfToken

    const token = headerToken || bodyToken

    if (!cookieToken || !token || cookieToken !== token) {
        return next(new ForbiddenError('Неверный CSRF-токен'))
    }

    next()
}
