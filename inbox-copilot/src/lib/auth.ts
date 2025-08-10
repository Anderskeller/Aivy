import { auth } from "next-auth";

export const requireAuth = async () => {
  const session = await auth();
  if (!session || !session.user?.email) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return session;
};


