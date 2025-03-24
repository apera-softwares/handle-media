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

}