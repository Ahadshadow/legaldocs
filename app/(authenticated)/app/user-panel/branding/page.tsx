"use client"

import { useState, useRef } from "react"
import { Button } from "../../../../../components/ui/button"
import Layout from "../../../../../components/layout"
import { Plus, X } from "lucide-react"
import Image from "next/image"
import { PremiumBanner } from "../../../../../components/premium-banner"

export default function BrandingPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Layout>
      {/* Premium Banner */}
      <PremiumBanner />

      <div className="w-full mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Branding</h1>
            <p className="text-gray-600 mb-8">Customize document delivery and notification emails with your logo.</p>

            <div className="space-y-4">
              <h2 className="text-base font-medium text-gray-900">Add Your Logo</h2>

              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

              {uploadedImage ? (
                <div className="space-y-4">
                  <div className="w-32 h-32 relative bg-gray-100 rounded-lg overflow-hidden group">
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 z-10 p-1 rounded-full bg-gray-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <Image
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded logo"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <Button onClick={triggerFileInput} variant="secondary">
                    Change
                  </Button>
                </div>
              ) : (
                <Button onClick={triggerFileInput} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Logo
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Email Preview */}
          <div className="bg-white rounded-lg border shadow-sm p-8">
            <h2 className="text-base font-medium text-gray-900 mb-6">Preview of an Email:</h2>

            <div className="space-y-8">
              <div className="text-center">
                {uploadedImage ? (
                  <div className="w-32 h-32 relative mx-auto">
                    <Image
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Logo preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-900">YOUR LOGO</p>
                )}
              </div>

              {/* Placeholder Content */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Document</Button>

              <p className="text-xs text-gray-500 text-center">
                Legal Template is an application to create, send, track, sign and annotate documents in a fast, secure
                and professional way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

