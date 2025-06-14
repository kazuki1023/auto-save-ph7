import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import RegisterForm from './form';

export default async function Register() {
  const session = await auth();
  if (!session) {
    redirect('/schedule');
  }
  return (
    <>
      <RegisterForm />
    </>
  );
}
