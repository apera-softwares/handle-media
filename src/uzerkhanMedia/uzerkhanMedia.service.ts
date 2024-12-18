import { Injectable } from "@nestjs/common";

@Injectable()
export class UzerKhanMediaService {

    async uploadUzerKhanMedia(files: Array<Express.Multer.File>) {

        for (const file of files) {
            return file?.filename
        }

    }
}