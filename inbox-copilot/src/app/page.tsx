import { redirect } from "next/navigation";
import { auth } from "next-auth";

export default async function Home() {
  const session = await auth();
  if (session?.user?.email) redirect("/dashboard");
  redirect("/(marketing)");
}
