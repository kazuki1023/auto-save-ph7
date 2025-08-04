'use client';

import { Button } from '@heroui/button';
import { usePathname } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export function SignInButton() {
  const pathname = usePathname();
  return (
    <Button
      onPress={() => signIn('google', { callbackUrl: pathname })}
      color="primary"
      startContent={<FcGoogle />}
      size="sm"
      variant="bordered"
    >
      Sign in
    </Button>
  );
}
