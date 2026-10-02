"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { sql, ensureSchema, type UserRow } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

const credentialsSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(32, { message: "Username must be at most 32 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username may only contain letters, numbers, and underscores.",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(100, { message: "Password must be at most 100 characters." }),
});

export type AuthState =
  | {
      errors?: { username?: string[]; password?: string[] };
      message?: string;
    }
  | undefined;

export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const { username, password } = parsed.data;

  await ensureSchema();

  const existing = await sql`
    SELECT id FROM users WHERE username = ${username} LIMIT 1
  `;
  if (existing.length > 0) {
    return { errors: { username: ["That username is already taken."] } };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const inserted = (await sql`
    INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING id, username
  `) as Pick<UserRow, "id" | "username">[];

  const user = inserted[0];
  if (!user) {
    return { message: "Something went wrong creating your account." };
  }

  await createSession({ userId: user.id, username: user.username });
  redirect("/dashboard");
}

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  // Keep the error generic so we don't reveal which field was wrong.
  if (!parsed.success) {
    return { message: "Invalid username or password." };
  }

  const { username, password } = parsed.data;

  await ensureSchema();

  const rows = (await sql`
    SELECT id, username, password_hash
    FROM users
    WHERE username = ${username}
    LIMIT 1
  `) as Pick<UserRow, "id" | "username" | "password_hash">[];

  const user = rows[0];

  // Always run a compare to reduce timing differences between the
  // "no such user" and "wrong password" paths.
  const hash = user?.password_hash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
  const valid = await bcrypt.compare(password, hash);

  if (!user || !valid) {
    return { message: "Invalid username or password." };
  }

  await createSession({ userId: user.id, username: user.username });
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
