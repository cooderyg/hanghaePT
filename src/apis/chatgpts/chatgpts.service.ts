import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatgptsService {
  async createChatgpt(answer: string) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: '개발과 관련된 질문만 답해주세요.' },
        { role: 'assistant', content: answer },
      ],
      max_tokens: 10,
    });

    const responseData = {
      message: completion.choices[0].message.content,
    };

    return JSON.stringify(responseData);
  }
}
