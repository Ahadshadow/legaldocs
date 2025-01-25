"use client"

import { Button } from "../../../../../../components/ui/button"
import Layout from "../../../../../../components/layout"
import { Switch } from "../../../../../../components/ui/switchPanel"
import { Label } from "../../../../../../components/ui/label"
import { Input } from "../../../../../../components/ui/input"
import { useState } from "react"
import { PremiumBanner } from "../../../../../../components/premium-banner"

export default function UserSettingsPage() {
  const [isEditingName, setIsEditingName] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  return (
    <Layout>
      {/* Premium Banner */}
      <PremiumBanner />

      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 w-full mx-auto">User Settings</h1>

        <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-12 space-y-12 min-h-[calc(100vh-14rem)]">
          {/* Name */}
          <div className="flex flex-col gap-4 py-5 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Name</h3>
              {!isEditingName && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingName(true)}>
                  Edit
                </Button>
              )}
            </div>

            {isEditingName ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingName(false)
                      setFirstName("")
                      setLastName("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#ff4f56] hover:bg-[#ff3d45]"
                    onClick={() => {
                      // Handle save logic here
                      setIsEditingName(false)
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Customer ID */}
          <div className="flex items-center justify-between py-5 border-b">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Customer ID</h3>
              <p className="text-base text-gray-500">78460282</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between py-5 border-b">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Your Email</h3>
              <p className="text-base text-gray-500">byolo49@gmail.com</p>
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-4 py-5 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Your Password</h3>
                <p className="text-base text-gray-500">••••••••••••••</p>
              </div>
              {!isResettingPassword && (
                <Button variant="outline" size="sm" onClick={() => setIsResettingPassword(true)}>
                  Reset
                </Button>
              )}
            </div>

            {isResettingPassword ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsResettingPassword(false)
                      setCurrentPassword("")
                      setNewPassword("")
                      setConfirmPassword("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#ff4f56] hover:bg-[#ff3d45]"
                    onClick={() => {
                      // Handle save logic here
                      setIsResettingPassword(false)
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Free Offers */}
          <div className="flex items-center justify-between py-5 border-b">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Sign me up for free offers</h3>
            </div>
            <Switch className="bg-[#22c55e] data-[state=unchecked]:bg-gray-200" />
          </div>

          {/* Current Plan */}
          <div className="flex items-center justify-between py-5 border-b">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Current Plan: Free Membership</h3>
              <p className="text-base text-gray-500">Expiration Date: No expiration</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">Upgrade</Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

