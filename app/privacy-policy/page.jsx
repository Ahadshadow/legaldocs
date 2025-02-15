import { Card, CardContent } from "../../components/ui/card"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-white">
          <CardContent className="p-8 pt-16">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose max-w-none">
              <p className="mb-4">Last updated: [Date]</p>
              <p className="mb-4">
                At Legal Templates, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
              <p className="mb-4">
                We collect information that you provide directly to us, such as when you create an account, fill out a form, or communicate with us. This may include your name, email address, and other personal information.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Information Sharing and Disclosure</h2>
              <p className="mb-4">
                We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website and conducting our business.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing and against accidental loss, destruction, or damage.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at [contact email].
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

