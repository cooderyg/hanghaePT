import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import {
  IMessagesServiceCreateMessage,
  IMessagesServiceDeleteMessage,
  IMessagesServiceFindById,
  IMessagesServiceFindMessage,
  IMessagesServiceFindMessages,
} from './interfaces/messages-service.interface';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}
  async findMessage({
    userId,
    messageId,
  }: IMessagesServiceFindMessage): Promise<Message> {
    const message = await this.findById({ messageId });
    if (!message)
      throw new NotFoundException('해당 메시지를 찾을 수 없습니다.');

    if (message.sender.id !== userId && message.receiver.id !== userId)
      throw new ForbiddenException('메시지 조회권한이 없습니다.');

    return message;
  }

  async findMessages({
    userId,
    isSender,
  }: IMessagesServiceFindMessages): Promise<Message[]> {
    let messages: Message[];
    if (isSender) {
      messages = await this.messagesRepository.find({
        where: { sender: { id: userId }, senderDelete: false },
        order: { createdAt: 'DESC' },
      });
    } else {
      messages = await this.messagesRepository.find({
        where: { receiver: { id: userId }, receiverDelete: false },
        order: { createdAt: 'DESC' },
      });
    }
    return messages;
  }

  async findById({ messageId }: IMessagesServiceFindById): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId },
    });

    return message;
  }

  async createMessage({
    senderId,
    createMessageDto,
  }: IMessagesServiceCreateMessage) {
    const { receiverId, ...rest } = createMessageDto;

    const receiver = await this.usersService.findById({ id: receiverId });
    if (!receiver) throw new NotFoundException('수신하는 유저가 없습니다.');

    this.messagesRepository.save({
      ...rest,
      sender: { id: senderId },
      receiver: { id: receiverId },
    });
  }

  async deleteMessage({
    userId,
    messageId,
    isSender,
  }: IMessagesServiceDeleteMessage) {
    let message: Message;
    if (isSender) {
      message = await this.messagesRepository.findOne({
        where: { id: messageId, sender: { id: userId } },
      });
      if (!message) throw new NotFoundException('메시지를 찾을 수 없습니다.');
      if (message.senderDelete)
        throw new ConflictException('이미 삭제된 메시지 입니다.');

      await this.messagesRepository.save({
        ...message,
        senderDelete: true,
      });
    } else {
      message = await this.messagesRepository.findOne({
        where: { id: messageId, receiver: { id: userId } },
      });
      if (!message) throw new NotFoundException('메시지를 찾을 수 없습니다.');
      if (message.receiverDelete)
        throw new ConflictException('이미 삭제된 메시지 입니다.');

      await this.messagesRepository.save({
        ...message,
        receiverDelete: true,
      });
    }
  }
}
