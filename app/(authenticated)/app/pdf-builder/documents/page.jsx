'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar'
import DocumentActions from '@/components/document-actions'
import LeaseTypeForm from '@/components/forms/lease-type-form'
import HousingTypeForm from '@/components/forms/housing-type-form'
import ParkingStorageForm from '@/components/forms/parking-storage-form'
import FurnishingsForm from '@/components/forms/furnishings-form'
import ConditionOfPremisesForm from '@/components/forms/condition-of-premises-form'
import AdditionalDescriptionForm from '@/components/forms/additional-description-form'
import AddressForm from '@/components/forms/address-form'
import LeadDisclosureForm from '@/components/forms/lead-disclosure-form'
import DisputeResolutionForm from '@/components/forms/dispute-resolution-form'
import LandlordAddressForm from '@/components/forms/landlord-address-form'
import TenantAddressForm from '@/components/forms/tenant-address-form'
import DateForm from '@/components/forms/date-form'

const steps = [
  { id: 'lease-type', component: LeaseTypeForm, title: 'Lease Type' },
  { 
    id: 'premises',
    title: 'Premises',
    subItems: [
      { id: 'housing-type', component: HousingTypeForm, title: 'Housing Type' },
      { id: 'parking-storage', component: ParkingStorageForm, title: 'Parking and Storage' },
      { id: 'furnishings', component: FurnishingsForm, title: 'Furnishings' },
      { id: 'condition', component: ConditionOfPremisesForm, title: 'Condition of the Premises' },
      { id: 'additional-description', component: AdditionalDescriptionForm, title: 'Additional Description' },
      { id: 'address', component: AddressForm, title: 'Address' },
      { id: 'lead-disclosure', component: LeadDisclosureForm, title: 'Lead Disclosure' }
    ]
  },
  {
    id: 'final-details',
    title: 'Final Details',
    subItems: [
      { id: 'dispute-resolution', component: DisputeResolutionForm, title: 'Dispute Resolution' },
      { id: 'landlord-address', component: LandlordAddressForm, title: 'Landlord\'s Address' },
      { id: 'tenant-address', component: TenantAddressForm, title: 'Tenant\'s Address' },
      { id: 'date', component: DateForm, title: 'Date' }
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
      
      <main className="flex-1 p-4 md:p-8 max-w-4xl">
        <div className="w-full max-w-2xl">
          <DocumentActions />
          {isPreviewMode ? (
            <div className="prose max-w-none">
              <h1>Lease Agreement Preview</h1>
              <pre className="bg-gray-100 p-4 rounded-lg">
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
      </main>
    </div>
  )
}

