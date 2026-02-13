import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VoltGuard - Sign Up",
  description: "Create your VoltGuard account",
};

export default function SignUp() {
  return <SignUpForm />;
}
