import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VoltGuard - Sign In",
  description: "Sign in to your VoltGuard account",
};

export default function SignIn() {
  return <SignInForm />;
}
