"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { setUserData } from "../../lib/utils";
import { SC } from "../../service/Api/serverCall";
import { GoogleLoginButton } from "../google-login";

export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false);
  const router = useRouter();

  // const handleSignInWithGoogle = async () => {
  //   setIsGoogleLoginLoading(true);
  //   try {
  //     const res = await signIn("google", { callbackUrl: "/" });
  //     if (!res?.ok) throw new Error("Sign-in failed");
  //   } catch (err) {
  //     setError("Google sign-in failed. Try again.");
  //   } finally {
  //     setIsGoogleLoginLoading(false);
  //   }
  // };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await SC.postCall({
        url: "login",
        data: { email: email.toLowerCase(), password },
      });

      if (response.data.token) {
        const userData = {
          email: email.toLowerCase(),
          token: response.data.token,
          ...response.data.user, // Assuming the API returns additional user data
        };

        // console.log("userData", userData);

        setUserData(userData);
        // Trigger a storage event to update other components
        window.dispatchEvent(new Event("storage"));

        if (props?.onSuccessfullLoginCB) {
          props.onSuccessfullLoginCB();
          return;
        }
        router.push("/");
      } else {
        setError("Sign-in failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${props?.className || ""}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign in
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignIn}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {/* <Link href="/forgot-password" className="text-sm text-[#6B7CFF] hover:underline">
                Forgot password?
              </Link> */}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-[#6B7CFF] hover:bg-[#5A6AE6]"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          {/* <Button
            type="button"
            className="w-full bg-blue-500 text-white"
            onClick={() => signIn("google")}
            disabled={isLoading}
          >
            Sign in with Google
          </Button> */}
          <GoogleLoginButton
            router={router}
            onSuccessfullLoginCB={props?.onSuccessfullLoginCB}
          />
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#6B7CFF] hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
