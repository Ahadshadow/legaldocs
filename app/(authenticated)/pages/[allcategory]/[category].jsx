"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSubcategoriesByCategoryId } from "../../service/navigationService";

import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "../../../../components/ui/input";

// Separate DocumentItem component
function DocumentItem({ title, description }) {
  return (
    <div className="p-6 hover:bg-gray-50">
      <h2 className="mb-2 text-lg font-medium">
        <Link href="#" className="text-gray-900 hover:text-primary">
          {title}
        </Link>
      </h2>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default function CategoryPage({ params }) {
  const { category, categoryId } = params;
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("Business Formation")

  // Navigation items
  const navItems = [
    "Business Formation",
    "Business Operations",
    "Employment",
    "Service Contracts",
    "Intellectual Property",
    "Employer Tax Forms",
  ]

  // Document items for each section
  const documentSections = {
    "Business Formation": [
      {
        title: "Amendment to an LLC Operating Agreement",
        description: "A document detailing any changes to the terms of the original LLC Operating Agreement.",
      },
      {
        title: "Amendment to Articles of Incorporation",
        description: "A document that allows you to record changes to the original Articles of Incorporation.",
      },
      {
        title: "Articles of Incorporation",
        description: 'Fill out this document to form an incorporated business (or "corporation").',
      },
      {
        title: "Business Plan",
        description: "A plan that guides you through each stage of starting and growing your business.",
      },
      {
        title: "Buy-Sell Agreement",
        description:
          "A legal contract outlining what happens with the shares of a co-owner or partner if they die or leave the company.",
      },
      {
        title: "Corporate Bylaws",
        description:
          "A document outlining the rules established by the board of directors that govern how a corporation will operate.",
      },
    ],
    "Business Operations": [
      {
        title: "Bill of Sale",
        description: "A legal document that transfers ownership of assets from a seller to a buyer.",
      },
      {
        title: "Business Contract",
        description: "A legally binding agreement between two or more parties for business purposes.",
      },
      {
        title: "Operating Agreement",
        description: "A document that outlines the financial and functional decisions of a business.",
      },
      {
        title: "Partnership Agreement",
        description: "A contract that establishes the terms of a partnership between two or more partners.",
      },
      {
        title: "Profit and Loss Statement",
        description: "A financial statement that summarizes revenues, costs, and expenses over a specific period.",
      },
    ],
    Employment: [
      {
        title: "Employment Contract",
        description: "A legal agreement between an employer and employee that outlines the terms of employment.",
      },
      {
        title: "Non-Disclosure Agreement",
        description: "A contract that protects confidential information from being shared with third parties.",
      },
      {
        title: "Employee Handbook",
        description: "A document that outlines company policies, procedures, and expectations for employees.",
      },
      {
        title: "Termination Letter",
        description: "A formal notice that informs an employee that their employment is being terminated.",
      },
      {
        title: "Job Offer Letter",
        description: "A formal document offering employment to a candidate, including details about the position.",
      },
    ],
    "Service Contracts": [
      {
        title: "Consulting Agreement",
        description: "A contract between a consultant and client outlining the terms of service.",
      },
      {
        title: "Service Level Agreement",
        description: "A contract that defines the level of service expected from a service provider.",
      },
      {
        title: "Maintenance Agreement",
        description: "A contract that outlines the terms for maintaining equipment or property.",
      },
      {
        title: "Freelance Contract",
        description: "An agreement between a freelancer and client detailing project scope, payment, and deliverables.",
      },
      {
        title: "Software Development Agreement",
        description: "A contract outlining terms for custom software development services.",
      },
    ],
    "Intellectual Property": [
      {
        title: "Copyright Assignment",
        description: "A document that transfers copyright ownership from one party to another.",
      },
      {
        title: "Patent Application",
        description: "A formal document submitted to obtain patent protection for an invention.",
      },
      {
        title: "Trademark Registration",
        description: "A document filed to register a trademark with the appropriate government agency.",
      },
      {
        title: "Licensing Agreement",
        description: "A contract that grants permission to use intellectual property under specific conditions.",
      },
      {
        title: "Trade Secret Protection Policy",
        description: "A document outlining measures to protect confidential business information.",
      },
    ],
    "Employer Tax Forms": [
      {
        title: "W-4 Form",
        description: "An IRS form that indicates how much tax should be withheld from an employee's paycheck.",
      },
      {
        title: "W-9 Form",
        description: "A request for taxpayer identification number and certification for independent contractors.",
      },
      {
        title: "1099 Form",
        description: "A tax form reporting income from self-employment or other sources.",
      },
      {
        title: "940 Form",
        description: "An annual Federal Unemployment Tax Act (FUTA) tax return.",
      },
      {
        title: "941 Form",
        description: "A quarterly tax return for employers reporting wages, tips, and taxes withheld.",
      },
    ],
  }

  useEffect(() => {
    async function fetchSubcategories() {
      try {
        const response = await getSubcategoriesByCategoryId(categoryId);
        if (response && response.status) {
          setSubcategories(response.data || []);
        } else {
          setSubcategories([]);
        }
      } catch (err) {
        console.error("Error loading subcategories:", err);
        setSubcategories([]);
      }
      setIsLoading(false);
    }
    fetchSubcategories();
  }, [categoryId]);

  return (
      <div className="flex min-h-screen flex-col md:flex-row">
      <h1 className="text-xl font-semibold my-4">{category.replace("-", " ")}</h1>

      {/* Sidebar Navigation */}
      <aside className="w-full border-r md:w-64">
        <nav className="flex flex-col">
          {navItems.map((item, index) => (
            <button
              key={`nav-${index}`}
              onClick={() => setActiveSection(item)}
              className={`border-l-4 px-6 py-4 font-medium text-left ${
                activeSection === item
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <Input
              type="search"
              placeholder="Enter search term. For example, 'LLC Operating Agreement'"
              className="pl-10 py-6"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="rounded-lg overflow-hidden border">
          {/* Header */}
          <div className="bg-[#f0f2fa] p-6">
            <h1 className="text-2xl font-medium text-gray-600">{activeSection}</h1>
          </div>

          {/* Document List */}
          <div className="divide-y">
            {documentSections[activeSection].map((item, index) => (
              <DocumentItem key={`doc-${index}`} title={item.title} description={item.description} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}