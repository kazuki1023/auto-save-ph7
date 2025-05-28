'use client';

import { Button } from '@heroui/button';
import { signOut } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';

export function SignOutButton() {
  return (
    <Button
      onPress={() => signOut()}
      color="primary"
      startContent={<FaSignOutAlt />}
      size="sm"
    >
      Sign out
    </Button>
  );
}
