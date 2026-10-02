"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "@/lib/auth";

type Action = (state: AuthState, formData: FormData) => Promise<AuthState>;

type Props = {
  action: Action;
  submitLabel: string;
  heading: string;
  subheading: string;
  altPrompt: string;
  altHref: string;
  altLabel: string;
  /** When true, render the password-rule hint under the password field. */
  showPasswordHint?: boolean;
};

export function CredentialsForm({
  action,
  submitLabel,
  heading,
  subheading,
  altPrompt,
  altHref,
  altLabel,
  showPasswordHint = false,
}: Props) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    undefined
  );

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {heading}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {subheading}
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4" noValidate>
        {state?.message && (
          <p
            role="alert"
            className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400"
          >
            {state.message}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="username"
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            aria-invalid={state?.errors?.username ? true : undefined}
            aria-describedby={
              state?.errors?.username ? "username-error" : undefined
            }
            className="h-11 rounded-md border border-black/[.12] bg-white px-3 text-sm text-black outline-none transition-colors focus:border-black/[.4] dark:border-white/[.16] dark:bg-black dark:text-zinc-50 dark:focus:border-white/[.4]"
          />
          {state?.errors?.username?.map((error) => (
            <p
              key={error}
              id="username-error"
              className="text-xs text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={
              showPasswordHint ? "new-password" : "current-password"
            }
            required
            aria-invalid={state?.errors?.password ? true : undefined}
            aria-describedby={
              state?.errors?.password ? "password-error" : undefined
            }
            className="h-11 rounded-md border border-black/[.12] bg-white px-3 text-sm text-black outline-none transition-colors focus:border-black/[.4] dark:border-white/[.16] dark:bg-black dark:text-zinc-50 dark:focus:border-white/[.4]"
          />
          {showPasswordHint && !state?.errors?.password && (
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              At least 8 characters.
            </p>
          )}
          {state?.errors?.password?.map((error) => (
            <p
              key={error}
              id="password-error"
              className="text-xs text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          ))}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          {pending ? "Please wait…" : submitLabel}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        {altPrompt}{" "}
        <Link
          href={altHref}
          className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
        >
          {altLabel}
        </Link>
      </p>
    </div>
  );
}
