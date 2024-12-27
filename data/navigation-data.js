export const navigationData = [
  {
    name: "Business",
    categories: [
      {
        id: "contracts",
        name: "Contracts",
        description: "Essential business agreements and contracts",
        href: "/business/contracts",
        subcategories: [
          {
            id: "service-agreements",
            name: "Service Agreements",
            description: "Professional service and consulting contracts",
            href: "/business/contracts/service-agreements",
          },
          {
            id: "employment",
            name: "Employment",
            description: "Employment contracts and agreements",
            href: "/business/contracts/employment",
          },
          {
            id: "ndas",
            name: "NDAs",
            description: "Non-disclosure and confidentiality agreements",
            href: "/business/contracts/ndas",
          },
        ],
      },
      {
        id: "formation",
        name: "Business Formation",
        description: "Documents for starting a business",
        href: "/business/formation",
        subcategories: [
          {
            id: "llc",
            name: "LLC Formation",
            description: "Limited Liability Company documents",
            href: "/business/formation/llc",
          },
          {
            id: "corporation",
            name: "Corporation",
            description: "Corporate formation documents",
            href: "/business/formation/corporation",
          },
        ],
      },
    ],
  },
  {
    name: "Real Estate",
    categories: [
      {
        id: "leases",
        name: "Leases",
        description: "Rental and lease agreements",
        href: "/real-estate/leases",
        subcategories: [
          {
            id: "residential",
            name: "Residential Lease",
            description: "Home and apartment rental agreements",
            href: "/real-estate/leases/residential",
          },
          {
            id: "commercial",
            name: "Commercial Lease",
            description: "Business property lease agreements",
            href: "/real-estate/leases/commercial",
          },
        ],
      },
      {
        id: "property-management",
        name: "Property Management",
        description: "Property management documents",
        href: "/real-estate/property-management",
        subcategories: [
          {
            id: "notices",
            name: "Notices",
            description: "Tenant notices and communications",
            href: "/real-estate/property-management/notices",
          },
          {
            id: "maintenance",
            name: "Maintenance",
            description: "Property maintenance agreements",
            href: "/real-estate/property-management/maintenance",
          },
        ],
      },
    ],
  },
]

