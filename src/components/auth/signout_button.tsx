"use client";

import { signOut } from "next-auth/react";
import { Button } from "@heroui/button";
import { FaSignOutAlt } from "react-icons/fa";

export default function SignOutButton() {
  return (
    <Button onPress={() => signOut()} color="primary" startContent={<FaSignOutAlt />} size="sm">
      Sign out
    </Button>
  )
}