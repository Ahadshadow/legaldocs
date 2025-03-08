import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Label } from "../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Textarea } from "../../../../../components/ui/textarea"

export default function CreateDocument() {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-medium mb-6">Create Document</h1>

        <form className="space-y-6">
          <div>
            <Label htmlFor="subcategories">Subcategories</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">
              Document Name <span className="text-red-500">*</span>
            </Label>
            <Input id="name" className="mt-1" required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" className="mt-1 min-h-[100px]" />
          </div>

          <div>
            <Label htmlFor="image">Upload Image</Label>
            <div className="mt-1 flex items-center gap-4">
              <Button type="button" variant="outline" className="h-9">
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground">No file chosen</span>
            </div>
          </div>

          <Button type="submit" className="bg-black hover:bg-black/90">
            Next
          </Button>
        </form>
      </div>
    </div>
  )
}

