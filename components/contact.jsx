import { Button } from "../components/ui/button"

export default function Contact() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
        <h3 className="text-2xl mb-6">We're here to Help</h3>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          If you're having any difficulties or need assistance please reach out to us and we'll be happy to help.
        </p>
        <Button className="bg-[#6B7CFF] hover:bg-[#5A6AE6]">
          Contact Us
        </Button>
      </div>
    </section>
  )
}

