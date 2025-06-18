import { Session } from 'next-auth';

export interface CustomSession extends Session {
  google?: {
    accessToken: string;
    refreshToken: string;
  };
}
