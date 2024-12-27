import { Card, CardContent } from "../../components/ui/card"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-white">
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
            <div className="prose max-w-none">
              <p className="mb-4">Last updated: [Date]</p>
              <p className="mb-4">
                Please read these Terms and Conditions carefully before using the Legal Templates website and services.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                Byaccessing or using our website and services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use of Services</h2>
              <p className="mb-4">
                Our services are intended for informational purposes only and do not constitute legal advice. We are not a law firm and are not a substitute for an attorney or law firm.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
              <p className="mb-4">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
              <p className="mb-4">
                The content on our website, including text, graphics, logos, and software, is the property of Legal Templates and is protected by copyright and other intellectual property laws.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
              <p className="mb-4">
                Legal Templates shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Governing Law</h2>
              <p className="mb-4">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify or replace these Terms at any time. Your continued use of the website after any changes indicates your acceptance of the new Terms.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us at [contact email].
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

