'use client'

import { useState } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog"
import { useDocument } from "../components/context/document-context"
import { UserPlus } from 'lucide-react'

interface AddSignerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, email: string) => void;
}

function AddSignerForm({ isOpen, onClose, onSave }: AddSignerFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSave = () => {
    if (name && email) {
      onSave(name, email)
      setName('')
      setEmail('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Signer</DialogTitle>
          <DialogDescription>
            Enter the details of the new signer you want to add to the document.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Enter the Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email address</Label>
            <Input
              type="email"
              placeholder="Enter the Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SignerSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignerSelectionDialog({ isOpen, onClose }: SignerSelectionDialogProps) {
  const { setActivePanel } = useDocument()
  const [isAddSignerOpen, setIsAddSignerOpen] = useState(false)
  const [signers, setSigners] = useState([
    {
      id: '1',
      name: 'You',
      email: 'masubghazali26@gmail.com',
      isSelected: true
    }
  ])

  const handleAddSigner = (name: string, email: string) => {
    setSigners([...signers, {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      isSelected: false
    }])
  }

  const handleSelect = () => {
    setActivePanel('signature')
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select signer who needs to fill out and sign this document</DialogTitle>
            <DialogDescription>
              Choose a signer from the list or add a new one to proceed with the signature process.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">You can edit this list of signers anytime.</p>
            <div className="space-y-4">
              {signers.map((signer) => (
                <div key={signer.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={signer.id}
                    name="signer"
                    checked={signer.isSelected}
                    onChange={() => {
                      setSigners(signers.map(s => ({
                        ...s,
                        isSelected: s.id === signer.id
                      })))
                    }}
                    className="rounded-full"
                  />
                  <Label htmlFor={signer.id}>
                    {signer.name} {signer.id === '1' ? '(You)' : ''}
                    <span className="block text-xs text-muted-foreground">{signer.email}</span>
                  </Label>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setIsAddSignerOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Signer
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={handleSelect}>
              Select
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddSignerForm
        isOpen={isAddSignerOpen}
        onClose={() => setIsAddSignerOpen(false)}
        onSave={handleAddSigner}
      />
    </>
  )
}

