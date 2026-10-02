import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Neverlands
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            {session
              ? `Signed in as ${session.username}.`
              : "Create an account or log in to get started."}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          {session ? (
            <Link
              href="/dashboard"
              className="flex h-11 flex-1 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="flex h-11 flex-1 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="flex h-11 flex-1 items-center justify-center rounded-full border border-black/[.12] px-5 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.16] dark:text-zinc-50 dark:hover:bg-white/[.06]"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
