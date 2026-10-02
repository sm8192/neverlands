import type { Metadata } from "next";
import { signup } from "@/lib/auth";
import { CredentialsForm } from "../credentials-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <CredentialsForm
      action={signup}
      heading="Create an account"
      subheading="Pick a username and password"
      submitLabel="Sign up"
      altPrompt="Already have an account?"
      altHref="/login"
      altLabel="Log in"
      showPasswordHint
    />
  );
}
