import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Label } from "../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"

export default function AddSubcategory() {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Add Subcategory</h1>

        <form className="space-y-6">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select defaultValue="business">
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">BUSINESS</SelectItem>
                <SelectItem value="technology">TECHNOLOGY</SelectItem>
                <SelectItem value="finance">FINANCE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Subcategory Name" className="mt-1" />
          </div>

          <Button type="submit" className="bg-black hover:bg-black/90">
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

