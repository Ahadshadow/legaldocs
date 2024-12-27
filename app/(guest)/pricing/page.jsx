import { Button } from "../../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"

const pricingPlans = [
  {
    name: "Basic",
    price: "$9.99",
    features: [
      "Access to 50+ legal templates",
      "Download in PDF format",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$19.99",
    features: [
      "Access to 100+ legal templates",
      "Download in PDF and Word formats",
      "Priority email support",
      "Document customization",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Access to all legal templates",
      "Download in all formats",
      "24/7 phone and email support",
      "Advanced document customization",
      "Team collaboration features",
    ],
  },
]

export default function Pricing() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Pricing Plans</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold mb-4">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#6B7CFF] hover:bg-[#5A6AE6] text-white">
                Choose Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

