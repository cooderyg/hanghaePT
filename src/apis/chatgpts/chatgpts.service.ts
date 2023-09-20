import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { IChatgptServiceCreateChatgpt } from './interfaces/chatgpts-service.interface';

@Injectable()
export class ChatgptsService {
  async createChatgpt(userMessage: string) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages: IChatgptServiceCreateChatgpt[] = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 100,
    });

    const responseData = {
      message: completion.choices[0].message.content,
    };

    return JSON.stringify(responseData);
  }
}
