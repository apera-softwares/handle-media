import { Controller, Param, Post, Req, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { FileUploadService } from "./fileUpload.service";
import * as fs from 'fs-extra';

const storage = diskStorage({
    destination: async function (req, file, cb) {
        const foldername = req?.params?.foldername
        const mediaPath = `${process.env.FILEPATH}${foldername}`
        try {
            await fs.ensureDir(mediaPath);
            cb(null, mediaPath);
        } catch (err) {
            cb(new Error('Error creating folder'), null);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extenstion = file?.originalname.split('.')[1]
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extenstion)
    }
});

@Controller('upload')
export class FileUploadController {

    constructor(
        private fileUploadService: FileUploadService
    ) { }

    @Post('add-media/:foldername')
    @UseInterceptors(FilesInterceptor('screenshot', 10, { storage }))
    uploadMedia(
        @Req() request: Request,
        @Param('foldername') foldername: string,
        @UploadedFiles() screenshot: Array<Express.Multer.File>
    ) {
        return this.fileUploadService.uploadMedia(request, foldername, screenshot)
    }
}