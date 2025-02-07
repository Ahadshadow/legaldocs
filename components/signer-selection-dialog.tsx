"use client"

import { useDocument } from "./context/document-context"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "../components/ui/dialog"
import { Trash2, UserPlus } from "lucide-react"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import AddSignerForm from "./add-signer-form"

interface SignerSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (email: string) => void
}

export function SignerSelectionDialog({ isOpen, onClose, onSelect }: SignerSelectionDialogProps) {
  const { setActivePanel, setEmail } = useDocument()
  const [isAddSignerOpen, setIsAddSignerOpen] = useState(false)
  const [signers, setSigners] = useState<
    Array<{
      id: string
      name: string
      email: string
      isSelected: boolean
    }>
  >([])
  const [selectedEmail, setSelectedEmail] = useState("")

  const handleAddSigner = (name: string, email: string) => {
    setSigners([
      ...signers,
      {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        isSelected: true,
      },
    ])
  }

  const handleDeleteSigner = (id: string) => {
    setSigners(signers.filter((signer) => signer.id !== id))
    if (signers.length === 1) {
      setSelectedEmail("")
    }
  }

  const handleSelect = () => {
    if (signers.length > 0 && selectedEmail) {
      onSelect(selectedEmail)
    }
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
            {signers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add a signer to proceed with the signature process.</p>
            ) : (
              <div className="space-y-4">
                {signers.map((signer) => (
                  <div key={signer.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={signer.id}
                      name="signer"
                      value={signer.id}
                      checked={signer.email === selectedEmail}
                      onChange={() => {
                        setSelectedEmail(signer.email)
                      }}
                      className="rounded-full"
                    />
                    <Label htmlFor={signer.id} className="flex-grow">
                      {signer.name}
                      <span className="block text-xs text-muted-foreground">{signer.email}</span>
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSigner(signer.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {signers.length === 0 && (
              <Button variant="outline" className="w-full" onClick={() => setIsAddSignerOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Signer
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSelect} disabled={!selectedEmail}>
              Select
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddSignerForm isOpen={isAddSignerOpen} onClose={() => setIsAddSignerOpen(false)} onSave={handleAddSigner} />
    </>
  )
}

