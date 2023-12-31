import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { IChatgptServiceCreateChatgpt } from './interfaces/chatgpts-service.interface';

@Injectable()
export class ChatgptsService {
  async createChatgpt(questionDetails, continueQuestionDto) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 라이브러리, 주제, 질문유형
    const { library, topic, type } = continueQuestionDto;

    const messages: IChatgptServiceCreateChatgpt[] = [
      { role: 'system', content: `You are master of ${topic}.` },
      {
        role: 'system',
        content: `You should answer very kindly, going step by step with examples.`,
      },
      {
        role: 'system',
        content: `You may only answer questions related to programming.`,
      },
      {
        role: 'system',
        content: `If the question is about a library, you must check whether the library actually exists before answering. You should not create a library that does not exist.`,
      },
      {
        role: 'system',
        content: `If the user's question does not contain keywords related to programming, the answer should be rejected.`,
      },
      {
        role: 'system',
        content: `Even if the user's question contains keywords related to programming, if it is not about programming in general, the answer should be rejected.`,
      },
      {
        role: 'system',
        content: `In general, if something is impossible, you should decline to answer.`,
      },
      {
        role: 'system',
        content: `When refusing to answer, you must reply, '프로그래밍에 대한 답변만 가능합니다.'`,
      },
      {
        role: 'system',
        content: `When declining an answer, you must decline in one sentence without further explanation.`,
      },
      {
        role: 'system',
        content: `You must respond solely with your own opinion. You should not rely on the opinion of the questioner.`,
      },
      {
        role: 'system',
        content: `If the question has nothing to do with programming, it should never be answered.`,
      },
      {
        role: 'system',
        content: `If there is insufficient information to answer a question, additional information may be requested from the questioner.`,
      },
      {
        role: 'system',
        content: `If the last question is not programming-related, you should decline to answer it.`,
      },
      {
        role: 'system',
        content: `If you cannot provide a direct solution to the keywords in the question, you should answer briefly without providing examples.`,
      },
      {
        role: 'system',
        content: `You must answer in Korean only.`,
      },
    ];

    questionDetails.forEach((q) => {
      messages.push({ role: 'user', content: q.query });
      messages.push({ role: 'assistant', content: q.answer });
    });
    if (library) {
      messages.push({
        role: 'user',
        content: `이 질문은 ${type}, ${topic}에 대한 질문이야. ${library}라는 라이브러리를 사용할거야. ${continueQuestionDto.query}`,
      });
    } else {
      messages.push({
        role: 'user',
        content: `이 질문은 ${type}, ${topic}에 대한 질문이야. ${continueQuestionDto.query}`,
      });
    }

    // { role: 'system', content: `You can help me about ${type}.` },

    console.log(messages);
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      messages,

      temperature: 1,
      max_tokens: 1000,
    });

    const responseData = {
      message: completion.choices[0].message.content,
    };

    return JSON.stringify(responseData);
  }
}
