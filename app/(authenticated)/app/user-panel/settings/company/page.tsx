"use client"

import { Button } from "../../../../../../components/ui/button"
import Layout from "../../../../../../components/layout"
import { Label } from "../../../../../../components/ui/label"
import { Input } from "../../../../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { PremiumBanner } from "../../../../../../components/premium-banner"

export default function CompanySettingsPage() {
  return (
    <Layout>
      {/* Premium Banner */}
      <PremiumBanner />

      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 w-full mx-auto">Company Settings</h1>

        <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-12 space-y-8 min-h-[calc(100vh-14rem)]">
          <p className="text-gray-600">Fill in company details to share across the team.</p>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" placeholder="Masabi test category" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input id="streetAddress" placeholder="Enter Street Address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input id="zipCode" placeholder="Enter Zip Code" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Enter City" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select defaultValue="US">
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  {/* Add more countries as needed */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select defaultValue="AR">
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AR">Arkansas</SelectItem>
                  <SelectItem value="AL">Alabama</SelectItem>
                  <SelectItem value="AK">Alaska</SelectItem>
                  {/* Add more states as needed */}
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

