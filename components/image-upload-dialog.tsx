"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { useDocument } from "../components/context/document-context";

export function ImageUploadDialog({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (imageUrl: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { editor } = useDocument();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (!file.type.includes("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("File size must be less than 1MB");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          if (editor) {
            editor.chain().focus().setImage({ src: result }).run();
          }
          onUpload?.(result);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div
            className={`
              flex flex-col items-center justify-center rounded-lg border border-dashed p-12
              ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25"
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <p className="mb-2 text-sm font-medium">Drag and drop to upload</p>
            <p className="mb-4 text-xs text-muted-foreground">
              Only PNG or JPEG files ({"<"} 1 MB) are allowed.
            </p>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload from device
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png,image/jpeg"
              onChange={handleFileInput}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
