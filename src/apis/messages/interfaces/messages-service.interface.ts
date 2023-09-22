import { PageReqDto } from 'src/commons/dto/page-req.dto';
import { CreateMessageDto } from '../dto/create-message.dto';

export interface IMessagesServiceFindMessage {
  userId: string;
  messageId: string;
}

export interface IMessagesServiceFindMessages {
  userId: string;
  isSender: boolean;
  pageReqDto: PageReqDto;
}

export interface IMessagesServiceCreateMessage {
  senderId: string;
  createMessageDto: CreateMessageDto;
}

export interface IMessagesServiceDeleteMessage {
  userId: string;
  messageId: string;
  isSender: boolean;
}

export interface IMessagesServiceFindById {
  messageId: string;
}
