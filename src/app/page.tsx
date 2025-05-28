import Link from 'next/link';

import { auth } from '@/auth';
import { SignInButton } from '@/components/auth/signin_button';
import { SignOutButton } from '@/components/auth/signout_button';
import { supabase } from '@/lib/supabase/supabaseClient';

export default async function Home() {
  const session = await auth();

  // App Router ではここで直接 fetch
  const { data, error } = await supabase.from('todos').select('*');

  if (error) {
    console.error(error);
  }

  console.log(data);
  return (
    <div>
      <h1>auto-saved-chat</h1>
      <Link href="/schedule">デモページ</Link>
      {session ? <SignOutButton /> : <SignInButton />}
    </div>
  );
}
