"use client"

import { Button } from "../../../../../components/ui/button"
import Layout from "../../../../../components/layout"
import { Avatar, AvatarFallback } from "../../../../../components/ui/avatar"
import { PremiumBanner } from "../../../../../components/premium-banner"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../../components/ui/dialog"
import { useRouter } from "next/navigation"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group-document"
import { getUserData } from "../../../../../lib/utils"

export default function TeamsPage() {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const router = useRouter()
  const userData = getUserData()

  const CompanyModal = () => (
    <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you have a company?</DialogTitle>
          <DialogDescription>
            Select 'Yes' if you have a company, or 'No' to set up your company details.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-4 mt-4">
          <Button
            onClick={() => {
              setIsCompanyModalOpen(false)
              setIsInviteModalOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setIsCompanyModalOpen(false)
              router.push("/app/user-panel/settings/company")
            }}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            No
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const InviteModal = () => (
    <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
          <DialogDescription>
            Invite users to work together on Legal Templates. Add the e-mail and choose the role for the person you want
            to invite.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Enter Email" type="email" />
          </div>
          <RadioGroup defaultValue="user">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="admin" id="admin" className="mt-1" />
                <div>
                  <Label htmlFor="admin" className="font-normal">
                    Admin
                  </Label>
                  <p className="text-sm text-gray-500">
                    Ability to see and edit all content, change account details, and invite new users
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="user" id="user" className="mt-1" />
                <div>
                  <Label htmlFor="user" className="font-normal">
                    User
                  </Label>
                  <p className="text-sm text-gray-500">Only has access to content specifically shared with them</p>
                </div>
              </div>
            </div>
          </RadioGroup>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsInviteModalOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Invite User</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <Layout>
      <PremiumBanner />

      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teams & Access</h1>
            <p className="text-gray-500 mt-1">Manage your member's access.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsCompanyModalOpen(true)}>
            + Invite User
          </Button>
        </div>

        {/* Team Members List */}
        <div className="bg-white rounded-lg border">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-blue-600">
                <AvatarFallback className="text-white">
                  {userData?.email ? userData.email[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{userData?.email || "User"}</span>
                  <span className="text-sm text-gray-500">(You)</span>
                </div>
                <span className="text-sm text-gray-500">{userData?.email || "User"}</span>
              </div>
            </div>
            <span className="text-xs font-medium text-blue-600 uppercase bg-gray-100 px-2 py-1 rounded">OWNER</span>
          </div>
        </div>
        <CompanyModal />
        <InviteModal />
      </div>
    </Layout>
  )
}

