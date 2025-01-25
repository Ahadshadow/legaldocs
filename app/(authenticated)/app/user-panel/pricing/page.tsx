"use client"

import { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import PricingHeader from "../../../../../components/pricing-header"

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<"premium" | "free">("premium")

  return (
    <div className="min-h-screen bg-white">
      <PricingHeader />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Print and download your
            <br />
            Legal Document
          </h1>
          <p className="text-gray-600">4M+ legal documents created since 2015</p>
        </div>

        {/* Plan Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">1. Choose your plan type</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Premium Trial */}
            <div
              className={`p-6 rounded-lg border-2 cursor-pointer ${
                selectedPlan === "premium" ? "border-blue-600 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => setSelectedPlan("premium")}
            >
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Premium Trial</div>
                <div className="text-2xl font-bold">$1 for 7 days</div>
              </div>
              <div className="text-sm">Full access to 140+ legal forms:</div>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Protect your business from disputes
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Coverage for children, family and pets
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Secure real estate & other assets
                </li>
              </ul>
            </div>

            {/* Free Trial */}
            <div
              className={`p-6 rounded-lg border-2 cursor-pointer ${
                selectedPlan === "free" ? "border-blue-600 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => setSelectedPlan("free")}
            >
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Free Trial</div>
                <div className="text-2xl font-bold">$0 for 7 days</div>
              </div>
              <div className="text-sm">Includes:</div>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Limited copies and downloads
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Store documents digitally
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">2. Enter your payment information</h2>
          <div className="space-y-8">
            {/* Billing Contact */}
            <div>
              <h3 className="font-medium mb-4">Billing contact information</h3>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="type464@gmail.com" />
              </div>
            </div>

            {/* Credit Card Details */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Credit card details</h3>
                <div className="flex gap-1">
                  <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#1565C0"
                      d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"
                    ></path>
                    <path
                      fill="#FFF"
                      d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.674 1.991.674l.466-2.309c0 0-1.358-.515-2.691-.515-3.019 0-4.576 1.444-4.576 3.272 0 3.306 3.979 2.853 3.979 4.551 0 .291-.231.964-1.888.964-1.662 0-2.759-.609-2.759-.609l-.495 2.216c0 0 1.063.606 3.117.606 2.059 0 4.915-1.54 4.915-3.752C30.354 23.586 26.369 23.394 26.369 22.206z"
                    ></path>
                    <path
                      fill="#FFC107"
                      d="M12.212,24.945l-0.966-4.748c0,0-0.437-1.029-1.573-1.029c-1.136,0-4.44,0-4.44,0S10.894,20.84,12.212,24.945z"
                    ></path>
                  </svg>
                  <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <linearGradient
                      id="amex-gradient"
                      x1="20.375"
                      x2="28.748"
                      y1="1365.061"
                      y2="1394.946"
                      gradientTransform="translate(0 -1354)"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#00b3ee"></stop>
                      <stop offset="1" stopColor="#0082d8"></stop>
                    </linearGradient>
                    <path
                      fill="url(#amex-gradient)"
                      d="M43.125,9H4.875C3.287,9,2,10.287,2,11.875v24.25C2,37.713,3.287,39,4.875,39h38.25 C44.713,39,46,37.713,46,36.125v-24.25C46,10.287,44.713,9,43.125,9z"
                    ></path>
                    <path
                      fill="#fff"
                      d="M24.5,20h-1.922c-0.197,0-0.375,0.115-0.456,0.294l-1.98,4.389l-1.97-4.388 C18.091,20.116,17.912,20,17.715,20h-1.871c-0.276,0-0.5,0.224-0.5,0.5v6.226l-2.871-6.43C12.393,20.116,12.214,20,12.017,20h-1.623 c-0.198,0-0.378,0.117-0.458,0.299L7.15,26.64c0,0-0.017,0.063-0.017,0.091c0,0.138,0.112,0.25,0.25,0.25v0h1.103 c0.2,0,0.38-0.119,0.459-0.302l0.541-1.256h3.432l0.551,1.258c0.08,0.182,0.259,0.299,0.458,0.299h2.638c0.276,0,0.5-0.224,0.5-0.5 v-4.685l2.167,4.888c0.08,0.181,0.259,0.297,0.457,0.297h0.918c0.195,0,0.372-0.113,0.454-0.29l2.217-4.805v4.595 c0,0.276,0.224,0.5,0.5,0.5H24.5c0.276,0,0.5-0.224,0.5-0.5V20.5C25,20.224,24.776,20,24.5,20z M10.135,23.915l1.026-2.44 l1.066,2.44H10.135z"
                    ></path>
                  </svg>
                  <svg
                    className="h-8 w-8"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#3F51B5"
                      d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"
                    ></path>
                    <path fill="#FFC107" d="M30 14A10 10 0 1 0 30 34A10 10 0 1 0 30 14Z"></path>
                    <path
                      fill="#FF3D00"
                      d="M22.014,30c-0.464-0.617-0.863-1.284-1.176-2h5.325c0.278-0.636,0.496-1.304,0.637-2h-6.598C20.07,25.354,20,24.686,20,24h7c0-0.686-0.07-1.354-0.201-2h-6.598c0.142-0.696,0.359-1.364,0.637-2h5.325c-0.313-0.716-0.711-1.383-1.176-2h-2.973c0.437-0.58,0.93-1.122,1.481-1.595C21.747,14.909,19.481,14,17,14c-5.523,0-10,4.477-10,10s4.477,10,10,10c3.269,0,6.162-1.575,7.986-4H22.014z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Card Holder Name</Label>
                  <Input id="cardName" placeholder="Name on Card" />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="Credit Card Number" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiration Date</Label>
                    <Input id="expiry" placeholder="MM / YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="CVV" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bill Summary */}
            <div>
              <h3 className="font-medium mb-4">Bill Summary</h3>
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">{selectedPlan === "premium" ? "Premium Trial" : "Free Trial"}</span>
                  <span className="text-2xl font-semibold">${selectedPlan === "premium" ? "1" : "0"}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-gray-900 font-medium">Total Amount</span>
                  <span className="text-3xl font-bold">${selectedPlan === "premium" ? "1" : "0"}</span>
                </div>
                <p className="text-sm text-gray-600">
                  At the end of your introductory period, continue on the daily low rate of $1.78.
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    By placing your order, you agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                    , and the billing terms outlined below. By completing your purchase, you agree to have the above
                    card automatically charged upon renewal.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    {selectedPlan === "premium" ? "Start My Trial" : "Start My Free Trial"}
                  </Button>
                  {selectedPlan === "premium" && (
                    <p className="text-center text-sm text-gray-500">Cancel anytime, for any reason</p>
                  )}
                  <p className="text-sm text-gray-600">
                    Legaltemplates.net digital subscription is a credit card only offer. Your credit card will
                    automatically be charged in advance every month unless a different term is specified in the offer.{" "}
                    <span className="font-medium">
                      At the end of your introductory period, you will continue to be charged every month for $49.95
                      ($1.78/day) unless you cancel your subscription.
                    </span>{" "}
                    Trial offer can only be claimed one time. Prices subject to change. Additional terms and conditions
                    may apply. All purchases are subject to the Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

