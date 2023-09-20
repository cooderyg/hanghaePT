import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { IChatgptServiceCreateChatgpt } from './interfaces/chatgpts-service.interface';

@Injectable()
export class ChatgptsService {
  async createChatgpt(questionDetails, createQuestionDto) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { library, topic, type } = createQuestionDto;

    let messages: IChatgptServiceCreateChatgpt[] = [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'system',
        content: `you have to answer about ${library},${topic},${type}`,
      },
    ];

    questionDetails.forEach((q) => {
      messages.push({ role: 'user', content: q.query });
      messages.push({ role: 'assistant', content: q.answer });
    });

    messages.push({ role: 'user', content: createQuestionDto.query });

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
