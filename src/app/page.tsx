import Link from "next/link"
import {SignInButton} from "@/components/auth/signin_button"
import {SignOutButton} from "@/components/auth/signout_button"
import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()
  return (
    <div>
      <h1>auto-saved-chat</h1>
      <Link href="/schedule">デモページ</Link>
      {session ? <SignOutButton /> : <SignInButton />}
    </div>
  )
}
