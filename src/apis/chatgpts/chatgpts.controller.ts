import { Body, Controller, Post } from '@nestjs/common';
import { ChatgptsService } from './chatgpts.service';

@Controller('/api/chatgpts')
export class ChatgptsController {
  constructor(private readonly chatgptsService: ChatgptsService) {}

  @Post()
  createChatgpt(@Body('userMessage') userMessage: string) {
    return this.chatgptsService.createChatgpt(userMessage);
  }
}
