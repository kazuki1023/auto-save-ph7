
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import RegisterForm from "./form";

export default async function Register() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin");}
  return (
    <>
      <RegisterForm />
    </>
  );
}
