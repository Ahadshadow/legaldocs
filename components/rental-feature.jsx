import { Button } from "../components/ui/button"
import Image from "next/image"

export default function RentalFeature() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Get the Most Out of Your Rental Properties
            </h2>
            <p className="text-gray-600 mb-6">
              Create an unlimited number of legally binding real estate forms and documents. From short-term rentals to long-term leases, we have everything you need to protect your property.
            </p>
            <Button className="bg-[#6B7CFF] hover:bg-[#5A6AE6]">
              Build Your First Form
            </Button>
          </div>
          <div>
            <Image
              src="/placeholder.svg"
              alt="Rental form preview"
              width={500}
              height={400}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

