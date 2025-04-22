import Link from "next/link"
import SignOutButton from "@/components/auth/signout_button"
export default function Home() {
  return (
    <div>
      <h1>auto-saved-chat</h1>
      <Link href="/schedule">デモページ</Link>
      <SignOutButton />
    </div>
  )
}
