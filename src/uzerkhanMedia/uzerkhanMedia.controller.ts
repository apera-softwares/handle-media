import { Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { UzerKhanMediaService } from "./uzerkhanMedia.service";

const storage = diskStorage({
    destination: `./uploads/uzerkhan`,
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extenstion = file?.originalname.split('.')[1]
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extenstion)
    }
});

@Controller('uzerkhan')
export class UzerKhanMediaController {

    constructor(
        private uzerkhanMediaService: UzerKhanMediaService
    ) { }

    @Post('add-media')
    @UseInterceptors(FilesInterceptor('ss', 10, { storage }))
    uploadUzerkhanMedia(
        @UploadedFiles() ss: Array<Express.Multer.File>
    ) {
        return this.uzerkhanMediaService.uploadUzerKhanMedia(ss)
    }
}