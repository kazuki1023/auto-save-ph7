'use client';

import { Button } from '@heroui/button';
import { usePathname } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

export function SignInButton() {
  const pathname = usePathname();
  return (
    <Button
      onPress={() => signIn('google', { callbackUrl: pathname })}
      color="primary"
      startContent={<FaGoogle />}
      size="sm"
    >
      Sign in
    </Button>
  );
}
