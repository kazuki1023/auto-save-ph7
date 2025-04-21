"use client";

import { signIn } from "next-auth/react";
import { Button } from "@heroui/button";  
import { FaGoogle } from "react-icons/fa";

export default function SignInButton() {
  return (
    <Button 
      onPress={() => signIn("google")}
      color="primary"
      startContent={<FaGoogle />}
      size="sm"
    >
      Sign in
    </Button>
  )
};