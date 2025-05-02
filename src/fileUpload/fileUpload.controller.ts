import { Controller, Delete, Param, Post, Query, Req, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { FileUploadService } from "./fileUpload.service";
import * as fs from 'fs-extra';
import { ApiOperation, ApiTags } from "@nestjs/swagger";

const storage = diskStorage({
    destination: async function (req, file, cb) {
        const foldername = req?.params?.foldername
        const mediaPath = `${process.env.FILEPATH}${foldername}`
        try {
            await fs.ensureDir(mediaPath)
            cb(null, mediaPath)
        } catch (err) {
            cb(new Error('Error creating folder'), null)
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let extenstion = 'jpg';
        if (file?.originalname) {
            extenstion = file?.originalname.split('.')[1]
        }
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extenstion)
    }
})

const storage2 = diskStorage({
    destination: async function (req, file, cb) {
        const foldername = req?.params?.foldername
        const mediaPath = `${process.env.FILEPATH}${foldername}`
        try {
            await fs.ensureDir(mediaPath)
            cb(null, mediaPath)
        } catch (err) {
            cb(new Error('Error creating folder'), null)
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

@ApiTags('File Upload')
@Controller('upload')
export class FileUploadController {

    constructor(
        private fileUploadService: FileUploadService
    ) { }

    @ApiOperation({ summary: "Upload single file in the server" })
    @Post('single-media/:foldername')
    @UseInterceptors(FileInterceptor('media', { storage }))
    uploadSingleMedia(
        @Req() request: Request,
        @Param('foldername') foldername: string,
        @UploadedFile() media: Express.Multer.File
    ) {
        return this.fileUploadService.uploadSingleMedia(request, foldername, media)
    }


    @ApiOperation({ summary: "Upload multiple file (10 files only) in the server" })
    @Post('multiple-media/:foldername')
    @UseInterceptors(FilesInterceptor('media', 10, { storage }))
    uploadMultipleMedia(
        @Req() request: Request,
        @Param('foldername') foldername: string,
        @UploadedFiles() media: Array<Express.Multer.File>
    ) {
        return this.fileUploadService.uploadMultipleMedia(request, foldername, media)
    }


    @ApiOperation({ summary: "Delete file from the server" })
    @Delete("delete-media/:foldername")
    deleteMedia(
        @Req() request: any,
        @Param("foldername") foldername: string,
        @Query("filename") filename: string
    ) {
        return this.fileUploadService.deleteMedia(request, foldername, filename);
    }


    @ApiOperation({ summary: "Upload bank logo (for E-AuctionsHub where max limit is 10)" })
    @Post('bank-logo/:foldername')
    @UseInterceptors(FilesInterceptor('media', 10, { storage: storage2 }))
    uploadMultipleBankLogoMedia(
        @Req() request: Request,
        @Param('foldername') foldername: string,
        @UploadedFiles() media: Array<Express.Multer.File>
    ) {
        return this.fileUploadService.uploadMultipleBankLogoMedia(request, foldername, media)
    }

}