// src/pages/HomePage.tsx
"use client"

import { Header } from "../components/Header"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useTopCreators, useFeaturedEvent, useFAQs } from "../lib/hooks/useHome"
import type { EventCreator, FeaturedEvent, FAQ } from "../lib/types/home"

// Mock images (keep your imports)
import guidoImg from "../assets/guido.jpg"
import patoImg from "../assets/pato.jpg"
import gastonImg from "../assets/gaston.jpg"
import homeImg from "../assets/home.jpeg"
import airbagImg from "../assets/airbag.jpeg"

export default function HomePage() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null)

  const { data: eventCreators = [], isLoading: creatorsLoading } = useTopCreators()
  const { data: featuredEvent, isLoading: eventLoading } = useFeaturedEvent()
  const { data: faqs = [], isLoading: faqsLoading } = useFAQs()

  // Mock data for development (remove when you have the backend)
  const mockEventCreators: EventCreator[] = [
    {
      id: 1,
      name: "Guido Sardelli",
      image: guidoImg,
      eventsCreated: 120,
      category: "Concerts",
    },
    {
      id: 2,
      name: "Pato Sardelli",
      image: patoImg,
      eventsCreated: 85,
      category: "Weddings",
    },
    {
      id: 3,
      name: "Gaston Sardelli",
      image: gastonImg,
      eventsCreated: 42,
      category: "Birthdays",
    },
  ]

  const mockFeaturedEvent: FeaturedEvent = {
    id: 1,
    title: "Airbag River Plate",
    date: "21",
    month: "DEC",
    image: airbagImg,
    category: "Airbag",
    participants: 20000,
    isPaid: true,
  }

  const mockFaqs: FAQ[] = [
    {
      id: 1,
      question: "How do I create an event?",
      answer: "To create an event, go to your profile and click on 'Create Event'. Fill in the details and publish your event.",
    },
    {
      id: 2,
      question: "Are all events free?",
      answer: "No, some events are paid. You can filter events by free or paid in the events section.",
    },
    {
      id: 3,
      question: "How do I add money to my account?",
      answer: "Go to the Balance section in the navigation menu and follow the instructions to add funds to your account.",
    },
  ]

  // Use mock data while backend is unavailable
  const displayCreators = eventCreators.length > 0 ? eventCreators : mockEventCreators
  const displayFeaturedEvent = featuredEvent || mockFeaturedEvent
  const displayFaqs = faqs.length > 0 ? faqs : mockFaqs

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-300 p-8 md:p-12 lg:p-16 overflow-hidden">
            {/* ... (keep the same hero content) */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-block px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <p className="text-white/60 text-sm font-light tracking-wide">Plan, Create and Connect</p>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                    The One-Stop <span className="italic font-bold">Platform</span>
                  </h1>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                    for Event Creation.
                  </h2>
                </div>

                <p className="text-white/60 text-base md:text-lg font-light tracking-wide leading-relaxed max-w-xl">
                  Join a community built for connection. Whether you're hosting a concert, workshop, or casual meetup,
                  our platform makes it easy to create, share, and manage your events — all in one place. Discover new
                  experiences, meet people who share your interests, and make every moment count.
                </p>

                <Link
                  to="/events"
                  className="inline-block px-8 py-3 bg-white text-black rounded-full font-medium tracking-wider uppercase text-sm hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-200"
                >
                  Explore events
                </Link>

                <div className="flex items-center gap-8 pt-4">
                  <div>
                    <p className="text-3xl font-light text-white">95%</p>
                    <p className="text-white/40 text-xs font-light tracking-wider uppercase">Satisfaction</p>
                  </div>
                  <div>
                    <p className="text-3xl font-light text-white">+10k</p>
                    <p className="text-white/40 text-xs font-light tracking-wider uppercase">Events Created</p>
                  </div>
                  <div>
                    <p className="text-3xl font-light text-white">24/7</p>
                    <p className="text-white/40 text-xs font-light tracking-wider uppercase">Support</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={homeImg}
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Event Creators Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Top <span className="italic font-bold">Event Creators</span>
            </h2>
            <p className="text-white/60 text-base font-light tracking-wide max-w-2xl mx-auto">
              Join a community built for connection. Whether you're hosting a concert, workshop, or casual meetup.
            </p>
          </div>

          {creatorsLoading ? (
            <div className="text-center text-white/60 py-12">Loading creators...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCreators.map((creator) => (
                <Link
                  key={creator.id}
                  to={`/creators/${creator.id}`}
                  className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-light tracking-wide border border-white/20">
                      {creator.category}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{creator.name}</h3>
                    <p className="text-white/60 text-sm font-light tracking-wide">
                      +{creator.eventsCreated} events created.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Event Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          {eventLoading ? (
            <div className="text-center text-white/60 py-12">Loading featured event...</div>
          ) : displayFeaturedEvent ? (
            <div className="relative h-[400px] sm:h-[500px] rounded-[32px] overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
              <img
                src={displayFeaturedEvent.image}
                alt={displayFeaturedEvent.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-red-900/80 backdrop-blur-sm rounded-full text-white text-sm font-light tracking-wide">
                  {displayFeaturedEvent.isPaid ? "Paid" : "Free"}
                </span>
              </div>

              <div className="absolute top-6 right-6 text-right">
                <p className="text-5xl font-light text-white">{displayFeaturedEvent.date}</p>
                <p className="text-white/60 text-sm font-light tracking-wider uppercase">{displayFeaturedEvent.month}</p>
              </div>

              <div className="absolute bottom-8 left-8 right-8 space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-light tracking-wide border border-white/20">
                    {displayFeaturedEvent.category}
                  </span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{displayFeaturedEvent.title}</h3>

                <p className="text-white/80 text-base font-light tracking-wide max-w-2xl">
                  Join a community built for connection. Whether you're hosting a concert, workshop, or casual meetup,
                  our platform makes it easy to create, share, and manage your events.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/events"
                    className="px-8 py-3 bg-white text-black rounded-full font-medium tracking-wider uppercase text-sm hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-200"
                  >
                    View more events
                  </Link>

                  <div className="flex items-center gap-2 ml-auto">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-black"
                        />
                      ))}
                    </div>
                    <p className="text-white/60 text-sm font-light tracking-wide">
                      +{(displayFeaturedEvent.participants / 1000).toFixed(0)}k participants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-white/60 py-12">No featured event available</div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              We're here to answer
            </h2>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight italic">
              all your questions.
            </p>
          </div>

          {faqsLoading ? (
            <div className="text-center text-white/60 py-12">Loading FAQs...</div>
          ) : (
            <div className="space-y-4">
              {displayFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="w-full px-4 md:px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-white/5 transition-colors duration-200"
                  >
                    <span className="text-white/80 text-sm md:text-base lg:text-lg font-light tracking-wide italic flex-1">
                      {faq.question}
                    </span>
                    <div
                      className={`w-10 h-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center transition-transform duration-200 ${
                        openFaqId === faq.id ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="w-5 h-5 text-black" />
                    </div>
                  </button>
                  {openFaqId === faq.id && (
                    <div className="px-4 md:px-6 pt-4 pb-5 border-t border-white/10">
                      <p className="text-white/60 text-sm md:text-base font-light tracking-wide leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}