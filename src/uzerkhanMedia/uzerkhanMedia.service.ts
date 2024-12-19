import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as fs from 'fs-extra';

@Injectable()
export class UzerKhanMediaService {

    async uploadUzerKhanMedia(request, files: Array<Express.Multer.File>) {

        const authHeader: string = request?.headers?.authorization;

        const filePath = `${process.env.FILEPATH}uzerkhan/`

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            if (files && files.length > 0) {
                for (const file of files) {
                    await fs.unlink(`${filePath}${file.filename}`)
                }
            }

            throw new HttpException("Access token not provided", HttpStatus.BAD_REQUEST);
        }

        const token = authHeader.split(" ")[1];

        if (token !== process.env.ACCESS_TOKEN) {

            if (files && files.length > 0) {
                for (const file of files) {
                    await fs.unlink(`${filePath}${file.filename}`);
                }
            }

            throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST);
        }

        try {

            const uploadedFileNames: string[] = [];

            for (const file of files) {
                if (file?.filename) {
                    uploadedFileNames.push(file.filename);
                } else {
                    throw new HttpException(
                        `File upload failed for one of the files`,
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }
            }

            return {
                message: "Files uploaded successfully",
                fileNames: uploadedFileNames,
            };

        } catch (error) {

            console.log(error)

            throw new HttpException("Something went wrong while adding screenshots", HttpStatus.INTERNAL_SERVER_ERROR)

        }

    }

}