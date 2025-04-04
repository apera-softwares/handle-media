import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as fs from 'fs-extra';

@Injectable()
export class FileUploadService {

    async uploadSingleMedia(request: any, foldername: any, file: Express.Multer.File) {

        const token: string = request?.headers?.authorization

        const filePath = `${process.env.FILEPATH}${foldername}/`

        if (token !== process.env.ACCESS_TOKEN) {

            await fs.unlink(`${filePath}${file.filename}`)

            throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST)
        }

        try {

            return {
                status: true,
                statusCode: 200,
                message: "File uploaded successfully",
                file: file?.filename,
            };

        } catch (error) {

            console.log(error)

            await fs.unlink(`${filePath}${file.filename}`)

            throw new HttpException("Something went wrong while adding media", HttpStatus.INTERNAL_SERVER_ERROR)

        }
    }


    async uploadMultipleMedia(request: any, foldername: any, files: Array<Express.Multer.File>) {

        const token: string = request?.headers?.authorization

        const filePath = `${process.env.FILEPATH}${foldername}/`

        if (token !== process.env.ACCESS_TOKEN) {

            if (files && files.length > 0) {
                for (const file of files) {
                    await fs.unlink(`${filePath}${file.filename}`)
                }
            }

            throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST)
        }

        try {

            const uploadedFilenames: string[] = []

            for (const file of files) {
                uploadedFilenames.push(file.filename)
            }

            return {
                status: true,
                statusCode: 200,
                message: "Files uploaded successfully",
                filenames: uploadedFilenames,
            };

        } catch (error) {

            if (files && files.length > 0) {
                for (const file of files) {
                    await fs.unlink(`${filePath}${file.filename}`)
                }
            }

            throw new HttpException("Something went wrong while adding media", HttpStatus.INTERNAL_SERVER_ERROR)

        }

    }


    async deleteMedia(request: any, foldername: string, filename: string) {

        const token: string = request?.headers?.authorization

        const filePath = `${process.env.FILEPATH}${foldername}/${filename}`

        if (token !== process.env.ACCESS_TOKEN) {
            throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST)
        }

        try {
            if (await fs.pathExists(filePath)) {

                await fs.unlink(filePath)

                return {
                    status: true,
                    statusCode: HttpStatus.OK,
                    message: "File deleted successfully",
                }

            } else {
                return {
                    status: false,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "File not found",
                }
            }
        } catch (error) {
            throw new HttpException("Something went wrong while deleting media", HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }


    async uploadMultipleBankLogoMedia(request: any, foldername: any, files: Array<Express.Multer.File>) {

        const token: string = request?.headers?.authorization

        const filePath = `${process.env.FILEPATH}${foldername}/`

        if (token !== process.env.ACCESS_TOKEN) {

            if (files && files.length > 0) {
                for (const file of files) {
                    await fs.unlink(`${filePath}${file.filename}`)
                }
            }

            throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST)
        }

        if (foldername !== "auction") {

            if (files && files.length > 0) {
                for (const file of files) {
                    await fs.unlink(`${filePath}${file.filename}`)
                }
            }

            throw new HttpException("Foldername is invalid", HttpStatus.BAD_REQUEST)
        }

        try {

            const uploadedFilenames: string[] = []

            for (const file of files) {
                uploadedFilenames.push(file.filename)
            }

            return {
                status: true,
                statusCode: 200,
                message: "Bank logo uploaded successfully",
                filenames: uploadedFilenames,
            };

        } catch (error) {

            if (files && files.length > 0) {
                for (const file of files) {
                    await fs.unlink(`${filePath}${file.filename}`)
                }
            }

            throw new HttpException("Something went wrong while adding bank logo", HttpStatus.INTERNAL_SERVER_ERROR)

        }

    }

}