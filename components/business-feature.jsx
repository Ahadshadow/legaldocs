import { Button } from "../components/ui/button"
import Image from "next/image"

export default function BusinessFeature() {
  return (
    <section className="py-16 bg-[#F8F9FF]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="order-2 md:order-1">
            <Image
              src="/placeholder.svg"
              alt="Business documents preview"
              width={500}
              height={400}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-4">
              Documents for Every Part of Your Business
            </h2>
            <p className="text-gray-600 mb-6">
              Save time and money with our extensive library of business documents. From contracts to policies, we have everything you need to run your business legally and efficiently.
            </p>
            <Button className="bg-[#6B7CFF] hover:bg-[#5A6AE6]">
              Build Business Forms
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

