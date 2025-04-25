'use server'

import { auth } from "@/auth"
import { CustomSession } from "./types";
export const getSession = async () => {
  const session = await auth();
  if (session) {
    return session as CustomSession;
  }
  return session;
};


