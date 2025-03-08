import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Label } from "../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"

export default function AddUser() {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Add User</h1>

        <form className="space-y-6">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="John" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" placeholder="JohnDoe" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john.doe@example.com" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="phone">Phone No</Label>
            <Input id="phone" placeholder="658 799 8941" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select defaultValue="user">
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="********" className="mt-1" />
          </div>

          <Button type="submit" className="bg-black hover:bg-black/90">
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

