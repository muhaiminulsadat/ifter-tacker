import {authClient} from "@/lib/auth-client";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import toast from "react-hot-toast";

export function useLoggedIn() {
  const router = useRouter();
  const {data: session, isPending} = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  return {session, isPending};
}

export function useNotLoggedIn() {
  const router = useRouter();
  const {data: session, isPending} = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  return {session, isPending};
}

export const useGetCurrentUser = () => {
  const {data: session, isPending} = authClient.useSession();
  return session?.user;
};
