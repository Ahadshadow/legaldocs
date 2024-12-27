import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../components/ui/card"

export default function ForgotPassword() {
  return (
    <Card className="w-full max-w-md mx-auto mt-20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-[#6B7CFF] hover:bg-[#5A6AE6]">
            Send reset link
          </Button>
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link href="/signin" className="text-[#6B7CFF] hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
  )
}

