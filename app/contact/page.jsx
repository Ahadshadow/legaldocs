

"use client"

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Mail, Phone, MapPin, Upload, X } from "lucide-react";

export default function Contact() {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
  });

  const removeImage = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Subject of your message" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message" rows={5} />
                </div>

                {/* Drag and Drop Image Upload */}
                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer bg-gray-100 hover:bg-gray-200"
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-10 w-10 mx-auto text-gray-500" />
                    <p className="text-gray-600">Drag & drop images here, or click to select</p>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {files.map((file) => (
                      <div key={file.name} className="relative">
                        <img src={file.preview} alt={file.name} className="w-20 h-20 object-cover rounded-md" />
                        <button 
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1" 
                          onClick={() => removeImage(file.name)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[#6B7CFF] hover:bg-[#5A6AE6] text-white">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center pt-5 space-x-4">
                  <Mail className="h-6 w-6 text-[#6B7CFF]" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">support@legaltemplates.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center pt-5 space-x-4">
                  <Phone className="h-6 w-6 text-[#6B7CFF]" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center pt-5 space-x-4">
                  <MapPin className="h-6 w-6 text-[#6B7CFF]" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-600">123 Legal Street, Suite 100<br />New York, NY 10001</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

