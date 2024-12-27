import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, [User Name]!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here's an overview of your account activity and recent documents.</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-[#6B7CFF] hover:underline">
                  Lease Agreement - Created on 2023-06-20
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#6B7CFF] hover:underline">
                  Non-Disclosure Agreement - Created on 2023-06-15
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#6B7CFF] hover:underline">
                  Employment Contract - Created on 2023-06-10
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Current Plan: Pro</p>
            <p>Documents Created: 15</p>
            <p>Storage Used: 25 MB / 1 GB</p>
            <Button className="mt-4 bg-[#6B7CFF] hover:bg-[#5A6AE6] text-white">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Document</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Start creating a new legal document from our extensive template library.</p>
          <Button asChild>
            <Link href="/templates">Browse Templates</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

