import Image from "next/image"
import { ChevronRight, Star } from 'lucide-react'
import { CreateDocumentButton } from "../../../../components/create-documents-buttons"
import {
  CustomSelect,
  CustomSelectContent,
  CustomSelectItem,
  CustomSelectTrigger,
  CustomSelectValue,
} from "../../../../components/ui/custom-select"

export default function LeaseAgreementPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-12">
        <span className="hover:text-gray-900 cursor-pointer">LegalTemplates</span>
        <ChevronRight className="h-3 w-3" />
        <span className="hover:text-gray-900 cursor-pointer">Real Estate</span>
        <ChevronRight className="h-3 w-3" />
        <span>Lease Agreement</span>
      </nav>

      <div className="grid md:grid-cols-[1fr,400px] gap-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-[40px] font-bold text-gray-900 leading-tight">
              Rental and Lease Agreement Templates
            </h1>
            <p className="text-xl text-gray-600">
              Use our lease agreement to rent out your residential property.
            </p>
          </div>

          <div className="space-y-4">
            <CustomSelect>
              <CustomSelectTrigger className="w-full">
                <CustomSelectValue placeholder="Standard Lease Agreement" />
              </CustomSelectTrigger>
              <CustomSelectContent>
                <CustomSelectItem value="standard">Standard Lease Agreement</CustomSelectItem>
                <CustomSelectItem value="room">Room Rental Agreement</CustomSelectItem>
                <CustomSelectItem value="month">Month-to-Month Lease Agreement</CustomSelectItem>
                <CustomSelectItem value="sublease">Sublease Agreement</CustomSelectItem>
                <CustomSelectItem value="commercial">Commercial Lease Agreement</CustomSelectItem>
              </CustomSelectContent>
            </CustomSelect>

            <div className="flex gap-4">
              <CustomSelect className="flex-1">
                <CustomSelectTrigger>
                  <CustomSelectValue placeholder="Select State" />
                </CustomSelectTrigger>
                <CustomSelectContent>
                  <CustomSelectItem value="al">Alabama</CustomSelectItem>
                  <CustomSelectItem value="ak">Alaska</CustomSelectItem>
                  <CustomSelectItem value="az">Arizona</CustomSelectItem>
                  <CustomSelectItem value="ar">Arkansas</CustomSelectItem>
                  <CustomSelectItem value="ca">California</CustomSelectItem>
                  <CustomSelectItem value="co">Colorado</CustomSelectItem>
                  <CustomSelectItem value="ct">Connecticut</CustomSelectItem>
                  <CustomSelectItem value="dc">District of Columbia</CustomSelectItem>
                </CustomSelectContent>
              </CustomSelect>
              
              <CreateDocumentButton />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Updated August 12, 2024
            </p>
            <p className="text-sm text-gray-500">
              Written by{" "}
              <a href="#" className="text-[#4b62f9] hover:underline">
                Jana Freer
              </a>{" "}
              | Reviewed by{" "}
              <a href="#" className="text-[#4b62f9] hover:underline">
                Susan Chai, Esq.
              </a>
            </p>
          </div>

          <div>
            <p className="text-gray-600 leading-relaxed">
              A <span className="text-gray-900">lease agreement</span> (or rental agreement) is a legally
              binding contract that outlines the obligations and rights of the
              tenant and landlord. It establishes the terms of the tenancy and
              helps you avoid disputes with your tenants and address issues when
              they arise.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt="Lease Agreement Preview"
              width={600}
              height={800}
              className="w-full rounded-lg border border-gray-200"
            />
            <CreateDocumentButton fullWidth />
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-gray-900">4.8</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#4b62f9] text-[#4b62f9]"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">29,272 Ratings</span>
              </div>
              <div className="text-sm text-gray-500">409,178 Downloads</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

