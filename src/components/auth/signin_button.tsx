"use client";

import { signIn } from "next-auth/react";
import { Button } from "@heroui/button";  
import { FaGoogle } from "react-icons/fa";
import { usePathname } from "next/navigation";

export function SignInButton() {
  const pathname = usePathname();
  return (
    <Button 
      onPress={() => signIn("google", { callbackUrl: pathname })}
      color="primary"
      startContent={<FaGoogle />}
      size="sm"
    >
      Sign in
    </Button>
  )
};