import Image from "next/image"

export default function HowItWorks() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="mb-6">
              <Image
                src="/placeholder.svg"
                alt="Choose form"
                width={200}
                height={150}
                className="mx-auto"
              />
            </div>
            <h3 className="font-semibold mb-2">Choose Your Legal Form</h3>
            <p className="text-sm text-gray-600">
              Browse our 100+ legal forms and select the document you need
            </p>
          </div>
          <div className="text-center">
            <div className="mb-6">
              <Image
                src="/placeholder.svg"
                alt="Answer questions"
                width={200}
                height={150}
                className="mx-auto"
              />
            </div>
            <h3 className="font-semibold mb-2">Answer Simple Questions</h3>
            <p className="text-sm text-gray-600">
              Our guided process helps you complete your legal document in minutes
            </p>
          </div>
          <div className="text-center">
            <div className="mb-6">
              <Image
                src="/placeholder.svg"
                alt="Save document"
                width={200}
                height={150}
                className="mx-auto"
              />
            </div>
            <h3 className="font-semibold mb-2">Save Your Document</h3>
            <p className="text-sm text-gray-600">
              Download and print your completed legal document
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

