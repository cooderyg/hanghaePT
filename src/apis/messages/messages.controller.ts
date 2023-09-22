import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AccessAuthGuard } from '../auth/guard/auth.guard';
import { User, UserAfterAuth } from 'src/commons/decorators/user.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { MessageResDto } from 'src/commons/dto/message-res.dto';
import { PageReqDto } from 'src/commons/dto/page-req.dto';

@Controller('api/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AccessAuthGuard)
  @Get('detail/:messageId')
  async findMessage(
    @User() user: UserAfterAuth,
    @Param('messageId') messageId: string,
  ) {
    this.messagesService.findMessage({ userId: user.id, messageId });
  }

  @UseGuards(AccessAuthGuard)
  @Get('sender')
  async findSendMessages(
    @Query() pageReqDto: PageReqDto,
    @User() user: UserAfterAuth,
  ): Promise<[Message[], number]> {
    const messages = await this.messagesService.findMessages({
      userId: user.id,
      isSender: true,
      pageReqDto,
    });
    return messages;
  }

  @UseGuards(AccessAuthGuard)
  @Get('receiver')
  async findReceiveMessages(
    @Query() pageReqDto: PageReqDto,
    @User() user: UserAfterAuth,
  ): Promise<[Message[], number]> {
    const messages = await this.messagesService.findMessages({
      userId: user.id,
      isSender: false,
      pageReqDto,
    });

    return messages;
  }

  @UseGuards(AccessAuthGuard)
  @Post()
  async createMessage(
    @User() user: UserAfterAuth,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageResDto> {
    await this.messagesService.createMessage({
      senderId: user.id,
      createMessageDto,
    });

    return { message: '메시지 생성이 완료되었습니다.' };
  }

  @UseGuards(AccessAuthGuard)
  @Delete('sender/:messageId')
  async deleteSendMessage(
    @User() user: UserAfterAuth,
    @Param('messageId') messageId: string,
  ): Promise<MessageResDto> {
    await this.messagesService.deleteMessage({
      userId: user.id,
      messageId,
      isSender: true,
    });

    return { message: '메시지 삭제가 완료되었습니다.' };
  }

  @UseGuards(AccessAuthGuard)
  @Delete('receiver/:messageId')
  async deleteReceiveMessage(
    @User() user: UserAfterAuth,
    @Param('messageId') messageId: string,
  ): Promise<MessageResDto> {
    await this.messagesService.deleteMessage({
      userId: user.id,
      messageId,
      isSender: false,
    });

    return { message: '메시지 삭제가 완료되었습니다.' };
  }
}
