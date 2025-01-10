'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import Sidebar from '../../../../../components/sidebarPdf'
import DocumentActions from '../../../../../components/document-actions'
import LeaseTypeForm from '../../../../../components/forms/lease-type-form'
import HousingTypeForm from '../../../../../components/forms/housing-type-form'
import ParkingStorageForm from '../../../../../components/forms/parking-storage-form'
import FurnishingsForm from '../../../../../components/forms/furnishings-form'
import ConditionOfPremisesForm from '../../../../../components/forms/condition-of-premises-form'
import AdditionalDescriptionForm from '../../../../../components/forms/additional-description-form'
import AddressForm from '../../../../../components/forms/address-form'
import LeadDisclosureForm from '../../../../../components/forms/lead-disclosure-form'
import DisputeResolutionForm from '../../../../../components/forms/dispute-resolution-form'
import LandlordAddressForm from '../../../../../components/forms/landlord-address-form'
import TenantAddressForm from '../../../../../components/forms/tenant-address-form'
import DateForm from '../../../../../components/forms/date-form'

const steps = [
  { 
    id: 'lease-type', 
    component: LeaseTypeForm, 
    title: 'Lease Type',
    detail: 'A lease agreement (or rental agreement) is a legally binding contract between a tenant and landlord that outlines the terms and conditions of renting a property. It specifies the rights and obligations of both parties, including details such as the rent amount, payment schedule, duration of the lease, and any rules or restrictions on the use of the property.'
  },
  { 
    id: 'premises',
    title: 'Premises',
    subItems: [
      { id: 'housing-type', component: HousingTypeForm, title: 'Housing Type', detail: 'The type of housing affects the specific terms and conditions in your lease agreement. Different housing types may have unique considerations, such as shared spaces in apartments or maintenance responsibilities in houses.' },
      { id: 'parking-storage', component: ParkingStorageForm, title: 'Parking and Storage', detail: 'Clearly defining parking and storage arrangements helps prevent misunderstandings and ensures both parties are aware of what\'s included in the lease.' },
      { id: 'furnishings', component: FurnishingsForm, title: 'Furnishings', detail: 'Specifying whether the property is furnished or unfurnished is crucial for setting expectations and determining responsibilities for maintenance and potential damage.' },
      { id: 'condition', component: ConditionOfPremisesForm, title: 'Condition of the Premises', detail: 'Documenting the condition of the premises at the start of the lease helps avoid disputes about damages when the tenant moves out.' },
      { id: 'additional-description', component: AdditionalDescriptionForm, title: 'Additional Description' },
      { id: 'address', component: AddressForm, title: 'Address', detail: 'The precise address of the rental property is a crucial part of the lease agreement, ensuring legal clarity about the exact premises being rented.' },
      { id: 'lead-disclosure', component: LeadDisclosureForm, title: 'Lead Disclosure', detail: 'Lead disclosure is a legal requirement for properties built before 1978. It informs tenants about potential lead hazards in the property.' }
    ]
  },
  {
    id: 'final-details',
    title: 'Final Details',
    subItems: [
      { id: 'dispute-resolution', component: DisputeResolutionForm, title: 'Dispute Resolution', detail: 'Specifying a dispute resolution method in advance can save time and reduce stress if disagreements arise during the tenancy.' },
      { id: 'landlord-address', component: LandlordAddressForm, title: 'Landlord\'s Address', detail: 'The landlord\'s address is necessary for official communications and legal notices related to the lease.' },
      { id: 'tenant-address', component: TenantAddressForm, title: 'Tenant\'s Address', detail: 'The tenant\'s current address may be required for background checks or as an alternate contact method.' },
      { id: 'date', component: DateForm, title: 'Date', detail: 'The date of the lease agreement is important for establishing when the terms of the lease become effective.' }
    ]
  }
];

export default function Home() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [formData, setFormData] = useState({})
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const flattenedSteps = steps.reduce((acc, step) => {
    if (step.subItems) {
      return [...acc, ...step.subItems];
    }
    return [...acc, step];
  }, []);

  const currentStep = flattenedSteps[currentStepIndex];

  const handleNext = (stepData) => {
    setFormData({ ...formData, [currentStep.id]: stepData })
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id])
    }
    if (currentStepIndex < flattenedSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      console.log('Form completed:', formData)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleSkip = () => {
    if (currentStepIndex < flattenedSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleStepSelect = (stepId) => {
    const newIndex = flattenedSteps.findIndex(step => step.id === stepId);
    if (newIndex !== -1) {
      setCurrentStepIndex(newIndex);
      setIsPreviewMode(false);
    }
  };

  const handlePreview = () => {
    setIsPreviewMode(true);
  };

  // Calculate progress
  const progress = Math.round((completedSteps.length / flattenedSteps.length) * 100)

  const CurrentStepComponent = currentStep.component

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        currentStep={currentStep.id}
        completedSteps={completedSteps}
        onStepSelect={handleStepSelect}
        onPreview={handlePreview}
        progress={progress}
      />
      
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <DocumentActions />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              {isPreviewMode ? (
                <div className="prose max-w-none">
                  <h1>Lease Agreement Preview</h1>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap break-words">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>
              ) : (
                <CurrentStepComponent 
                  onNext={handleNext}
                  onBack={handleBack}
                  onSkip={handleSkip}
                />
              )}
            </div>
            <div className="w-full lg:w-1/3">
              {currentStep.detail && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium">{currentStep.title}</h3>
                    <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="space-y-4 text-gray-500">
                    <p className="text-sm">{currentStep.detail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

