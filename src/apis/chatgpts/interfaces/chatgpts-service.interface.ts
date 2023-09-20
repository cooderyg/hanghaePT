export interface IChatgptServiceCreateChatgpt {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
