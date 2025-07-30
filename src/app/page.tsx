import Link from 'next/link';

import { auth } from '@/auth';
import { SignInButton } from '@/components/auth/signin_button';
import { SignOutButton } from '@/components/auth/signout_button';

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <h1>auto-saved-chat</h1>
      <Link href="/schedule">デモページ</Link>
      <Link href="/schedule/create">スケジュール作成</Link>
      {session ? <SignOutButton /> : <SignInButton />}
    </div>
  );
}
