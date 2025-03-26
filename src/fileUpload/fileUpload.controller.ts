import { Controller, Param, Post, Req, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { FileUploadService } from "./fileUpload.service";
import * as fs from 'fs-extra';

const storage = diskStorage({
    destination: function (req, file, cb) {
        const foldername = req?.params?.foldername
        const mediaPath = `${process.env.FILEPATH}${foldername}`
        try {
            fs.ensureDir(mediaPath)
            cb(null, mediaPath)
        } catch (err) {
            cb(new Error('Error creating folder'), null)
        }
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // let extenstion = 'jpg';
        // if (file?.originalname) {
        //     extenstion = file?.originalname.split('.')[1]
        // }
        // cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extenstion)

        cb(null, file.originalname)
    }
})

@Controller('upload')
export class FileUploadController {

    constructor(
        private fileUploadService: FileUploadService
    ) { }

    @Post('single-media/:foldername')
    @UseInterceptors(FileInterceptor('media', { storage }))
    uploadSingleMedia(
        @Req() request: Request,
        @Param('foldername') foldername: string,
        @UploadedFile() media: Express.Multer.File
    ) {
        return this.fileUploadService.uploadSingleMedia(request, foldername, media)
    }


    @Post('multiple-media/:foldername')
    @UseInterceptors(FilesInterceptor('media', 10, { storage }))
    uploadMultipleMedia(
        @Req() request: Request,
        @Param('foldername') foldername: string,
        @UploadedFiles() media: Array<Express.Multer.File>
    ) {
        return this.fileUploadService.uploadMultipleMedia(request, foldername, media)
    }

}