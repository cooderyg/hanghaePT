import { Module } from '@nestjs/common';
import { ChatgptsService } from './chatgpts.service';
import { ChatgptsController } from './chatgpts.controller';

@Module({
  controllers: [ChatgptsController],
  providers: [ChatgptsService],
})
export class ChatgptsModule {}
