import Image from "next/image"

export default function Testimonials() {
  return (
    <section className="py-16 bg-[#F8F9FF]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Don't just take our word for it
        </h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Image
                  src="/placeholder.svg"
                  alt="Trustpilot logo"
                  width={100}
                  height={24}
                  className="h-6"
                />
                <div className="ml-2 text-green-500">★★★★★</div>
              </div>
              <p className="text-sm text-gray-600">
                "Great service, easy to use platform. Saved me time and money on legal fees!"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

