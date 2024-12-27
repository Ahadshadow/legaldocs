import { Users, BarChart3, Users2 } from 'lucide-react'

export default function WhyChoose() {
  return (
    <section className="py-16 bg-[#F8F9FF]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Why Choose Legal Templates?</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          All of our legal contracts and documents are drafted and regularly updated by licensed attorneys. Your information is kept private and secure with Legal Templates.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <Users className="h-12 w-12 text-[#6B7CFF]" />
            </div>
            <div className="text-2xl font-bold text-[#6B7CFF]">+7</div>
            <p className="text-sm text-gray-600">Years of Experience</p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <BarChart3 className="h-12 w-12 text-[#6B7CFF]" />
            </div>
            <div className="text-2xl font-bold text-[#6B7CFF]">+10M</div>
            <p className="text-sm text-gray-600">Documents Created</p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <Users2 className="h-12 w-12 text-[#6B7CFF]" />
            </div>
            <div className="text-2xl font-bold text-[#6B7CFF]">900k</div>
            <p className="text-sm text-gray-600">Satisfied Customers</p>
          </div>
        </div>
      </div>
    </section>
  )
}

