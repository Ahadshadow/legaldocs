import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Label } from "../../../../../components/ui/label"

export default function AddCategory() {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Add Category</h1>

        <form className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Category Name" className="mt-1" />
          </div>

          <Button type="submit" className="bg-black hover:bg-black/90">
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}

