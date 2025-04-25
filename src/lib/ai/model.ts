import { openai } from '@ai-sdk/openai';
import { cached } from './middleware';
import { getEnv } from '../env';

export function getModel() {
  const baseModel = openai('gpt-4o');
  if (getEnv() === 'development') {
    return cached(baseModel);
  }
  return baseModel;
}