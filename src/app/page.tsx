import Link from "next/link"
import {SignInButton} from "@/components/auth/signin_button"
import {SignOutButton} from "@/components/auth/signout_button"
export default function Home() {
  return (
    <div>
      <h1>auto-saved-chat</h1>
      <Link href="/schedule">デモページ</Link>
      <SignInButton />
      <SignOutButton />
    </div>
  )
}
