import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Users, Briefcase, Scale } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">About Legal Templates</h1>
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-lg text-gray-700 mb-6">
            Legal Templates is a leading online platform providing high-quality, customizable legal documents for individuals and businesses. Our mission is to make legal services accessible, affordable, and easy to understand for everyone.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Founded in [Year], we've helped millions of users create legally binding documents, saving them time and expensive legal fees. Our team of experienced attorneys and legal professionals ensures that all our templates are up-to-date and compliant with current laws and regulations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-[#6B7CFF] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Our Team</h3>
              <p className="text-gray-600">Experienced legal professionals and tech experts working together to serve you.</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <Briefcase className="h-12 w-12 text-[#6B7CFF] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-600">To make legal services accessible and affordable for everyone.</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <Scale className="h-12 w-12 text-[#6B7CFF] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-gray-600">A world where everyone can easily navigate complex legal situations.</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Join Our Team</h2>
          <p className="text-lg text-gray-700 mb-6">
            We're always looking for talented individuals to join our mission. If you're passionate about making legal services more accessible, we'd love to hear from you.
          </p>
          <Button className="bg-[#6B7CFF] hover:bg-[#5A6AE6] text-white">
            View Open Positions
          </Button>
        </div>
      </div>
    </div>
  )
}

