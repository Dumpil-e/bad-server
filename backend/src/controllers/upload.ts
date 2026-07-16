import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import { join } from 'path'
import sharp from 'sharp'
import BadRequestError from '../errors/bad-request-error'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        const MIN_FILE_SIZE = 2 * 1024
        if (req.file.size < MIN_FILE_SIZE) {
            return next(
                new BadRequestError('Файл слишком маленький (минимум 2 KB)')
            )
        }
        
        const filePath = join(__dirname, '../public', req.file.filename)
        try {
            const metadata = await sharp(filePath).metadata()
            if (!metadata.width || !metadata.height) {
                return next(new BadRequestError('Невалидное изображение'))
            }
        } catch (sharpError) {
            return next(
                new BadRequestError('Файл не является валидным изображением')
            )
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
