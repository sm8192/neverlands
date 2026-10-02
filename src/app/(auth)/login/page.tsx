import type { Metadata } from "next";
import { login } from "@/lib/auth";
import { CredentialsForm } from "../credentials-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <CredentialsForm
      action={login}
      heading="Welcome back"
      subheading="Log in to your account"
      submitLabel="Log in"
      altPrompt="Don't have an account?"
      altHref="/signup"
      altLabel="Sign up"
    />
  );
}
