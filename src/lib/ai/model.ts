import { openai } from '@ai-sdk/openai';

import { getEnv } from '../env';

import { cached } from './middleware';

export function getModel() {
  const baseModel = openai('gpt-4o');
  if (getEnv() === 'development') {
    return cached(baseModel);
  }
  return baseModel;
}
