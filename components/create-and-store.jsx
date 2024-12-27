import { Button } from "../components/ui/button"
import Image from "next/image"

export default function CreateAndStore() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Create, Send and Store Legal Forms in One Place
            </h2>
            <p className="text-gray-600 mb-6">
              Get easy-to-use document creation tools right through the platform. Sign, send, and store all your legal documents in one secure location.
            </p>
            <Button className="bg-[#6B7CFF] hover:bg-[#5A6AE6]">
              Get Started Now
            </Button>
          </div>
          <div>
            <Image
              src="/placeholder.svg"
              alt="Platform preview"
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

