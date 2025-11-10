// src/pages/CreateEventPage.tsx
"use client"

import { Header } from "../components/Header"
import Footer from "../components/Footer"
import { useCreateEvent } from "../lib/hooks/useEvents"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Upload, X } from "lucide-react"

export default function CreateEventPage() {
  const createEventMutation = useCreateEvent()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: "",
    shortDesc: "",
    longDesc: "",
    date: "",
    time: "",
    location: "",
    price: "",
    maxParticipants: "",
    category: "",
    isFree: false
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length + images.length > 5) {
      setErrors(prev => ({ ...prev, images: "Maximum 5 images allowed" }))
      return
    }

    const newImages = [...images, ...files]
    setImages(newImages)

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])

    if (errors.images) {
      setErrors(prev => ({ ...prev, images: "" }))
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    setImages(newImages)
    setImagePreviews(newPreviews)
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index])
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.shortDesc.trim()) newErrors.shortDesc = "Short description is required"
    if (!formData.longDesc.trim()) newErrors.longDesc = "Long description is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.time) newErrors.time = "Time is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.isFree && !formData.price) newErrors.price = "Price is required for paid events"
    if (formData.maxParticipants && parseInt(formData.maxParticipants) < 1) newErrors.maxParticipants = "Must be at least 1"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const submitData = new FormData()
      
      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'date' && formData.time) {
          // Combine date and time
          const dateTime = new Date(`${formData.date}T${formData.time}`)
          submitData.append(key, dateTime.toISOString())
        } else if (key !== 'time') {
          submitData.append(key, value.toString())
        }
      })

      // Append images
      images.forEach(image => {
        submitData.append('images', image)
      })

      await createEventMutation.mutateAsync(submitData)
      navigate('/profile')
    } catch (error) {
      console.error('Failed to create event:', error)
      setErrors(prev => ({ ...prev, submit: "Failed to create event. Please try again." }))
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Event</h1>
              <p className="text-white/60 mt-1">Share your passion with the community</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200"
                    placeholder="Enter event title"
                  />
                  {errors.title && <p className="text-red-400 text-xs mt-2">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="shortDesc"
                    value={formData.shortDesc}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200 resize-none"
                    placeholder="Brief description that will appear on event cards"
                  />
                  {errors.shortDesc && <p className="text-red-400 text-xs mt-2">{errors.shortDesc}</p>}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Full Description *
                  </label>
                  <textarea
                    name="longDesc"
                    value={formData.longDesc}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200 resize-none"
                    placeholder="Detailed description of your event"
                  />
                  {errors.longDesc && <p className="text-red-400 text-xs mt-2">{errors.longDesc}</p>}
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Event Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200"
                  />
                  {errors.date && <p className="text-red-400 text-xs mt-2">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200"
                  />
                  {errors.time && <p className="text-red-400 text-xs mt-2">{errors.time}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200"
                    placeholder="Event venue or address"
                  />
                  {errors.location && <p className="text-red-400 text-xs mt-2">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200"
                  >
                    <option value="">Select category</option>
                    <option value="music">Music</option>
                    <option value="sports">Sports</option>
                    <option value="art">Art & Culture</option>
                    <option value="food">Food & Drink</option>
                    <option value="tech">Technology</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && <p className="text-red-400 text-xs mt-2">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200"
                    placeholder="Leave empty for unlimited"
                  />
                  {errors.maxParticipants && <p className="text-red-400 text-xs mt-2">{errors.maxParticipants}</p>}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Pricing</h2>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isFree"
                    checked={formData.isFree}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-white/20 bg-black text-white focus:ring-white/20"
                  />
                  <span className="text-white/80 text-sm font-medium">This is a free event</span>
                </label>

                {!formData.isFree && (
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200"
                      placeholder="0.00"
                    />
                    {errors.price && <p className="text-red-400 text-xs mt-2">{errors.price}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Event Images</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-white/40 transition-all duration-200">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer block">
                    <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/80 font-medium mb-2">Upload Event Images</p>
                    <p className="text-white/40 text-sm">Click to browse or drag and drop</p>
                    <p className="text-white/30 text-xs mt-1">Maximum 5 images • PNG, JPG, WEBP</p>
                  </label>
                </div>

                {errors.images && <p className="text-red-400 text-xs">{errors.images}</p>}

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 px-8 py-4 bg-transparent text-white border border-white/40 rounded-2xl font-medium hover:bg-white/10 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createEventMutation.isPending}
                className="flex-1 px-8 py-4 bg-white text-black rounded-2xl font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {createEventMutation.isPending ? "Creating Event..." : "Create Event"}
              </button>
            </div>

            {errors.submit && (
              <p className="text-red-400 text-center">{errors.submit}</p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}