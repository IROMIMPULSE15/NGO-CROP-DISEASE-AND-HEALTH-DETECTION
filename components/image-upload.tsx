"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, ImageIcon, Camera, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  selectedImage: File | null
  onRemoveImage: () => void
  disabled?: boolean
}

export function ImageUpload({ onImageSelect, selectedImage, onRemoveImage, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        onImageSelect(file)
        const reader = new FileReader()
        reader.onload = () => setPreview(reader.result as string)
        reader.readAsDataURL(file)
      }
    },
    [onImageSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: false,
    disabled,
  })

  const handleRemove = () => {
    onRemoveImage()
    setPreview(null)
  }

  if (selectedImage && preview) {
    return (
      <Card className="relative overflow-hidden group animate-fade-in-scale">
        <div className="relative">
          <img src={preview || "/placeholder.svg"} alt="Selected plant" className="w-full h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-4 right-4 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-white text-sm font-medium truncate">{selectedImage.name}</p>
              <p className="text-white/70 text-xs">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden",
        isDragActive
          ? "border-primary bg-primary/5 scale-105"
          : "border-border hover:border-primary/50 hover:bg-surface/50",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <input {...getInputProps()} />
      <div className="p-12 text-center">
        <div className="relative mb-6">
          <div
            className={cn(
              "mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
              isDragActive ? "bg-primary/20 scale-110" : "bg-surface hover:bg-primary/10",
            )}
          >
            {isDragActive ? (
              <Upload className="h-10 w-10 text-primary animate-bounce" />
            ) : (
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          {isDragActive && (
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-display text-xl font-semibold mb-2">
              {isDragActive ? "Drop your image here" : "Upload Plant Image"}
            </h3>
            <p className="text-muted-foreground">
              {isDragActive ? "Release to upload your crop image" : "Drag and drop an image here, or click to select"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" disabled={disabled} className="btn-hover-lift bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            <Button variant="outline" disabled={disabled} className="btn-hover-lift bg-transparent">
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">Supports: JPG, PNG, WebP • Max size: 10MB</p>
        </div>
      </div>
    </Card>
  )
}
