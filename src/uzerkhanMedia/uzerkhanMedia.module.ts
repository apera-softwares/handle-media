import { Module } from "@nestjs/common";
import { UzerKhanMediaController } from "./uzerkhanMedia.controller";
import { UzerKhanMediaService } from "./uzerkhanMedia.service";

@Module({
    imports: [UzerKhanMediaController],
    providers: [UzerKhanMediaService]
})
export class UzerKhanMediaModule { }