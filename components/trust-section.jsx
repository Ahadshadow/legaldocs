import Image from "next/image"

export default function TrustSection() {
  return (
    <section className="py-16 border-t">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Legal Documents</h3>
            <p className="text-sm text-gray-600">created by attorneys</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Filled out forms, ready</h3>
            <p className="text-sm text-gray-600">to be used</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Unlimited resources and</h3>
            <p className="text-sm text-gray-600">support</p>
          </div>
        </div>
        <div className="flex justify-center gap-8 mt-8">
          <Image
            src="/placeholder.svg"
            alt="BBB Rating"
            width={100}
            height={50}
            className="h-12 object-contain"
          />
          <Image
            src="/placeholder.svg"
            alt="Trustpilot Rating"
            width={100}
            height={50}
            className="h-12 object-contain"
          />
        </div>
      </div>
    </section>
  )
}

