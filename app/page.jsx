import Hero from "../components/hero"
import SearchSection from "../components/search-section"
import TrustSection from "../components/trust-section"
import HowItWorks from "../components/how-it-works"
import WhyChoose from "../components/why-choose"
import RentalFeature from "../components/rental-feature"
import BusinessFeature from "../components/business-feature"
import CreateAndStore from "../components/create-and-store"
import Testimonials from "../components/testimonials"
import Contact from "../components/contact"
import Footer from "../components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <SearchSection />
        <TrustSection />
        <HowItWorks />
        <WhyChoose />
        <RentalFeature />
        <BusinessFeature />
        <CreateAndStore />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

