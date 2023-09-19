import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatgptsService {
  async createChatgpt(userMessage: string) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: '질문에 답해주세요' },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 100,
    });

    const responseData = {
      message: completion.choices[0].message.content,
    };

    return JSON.stringify(responseData);
  }
}
