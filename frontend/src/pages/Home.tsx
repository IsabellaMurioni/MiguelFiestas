"use client"
import { Header } from "../components/Header"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import guidoImg from "../assets/guido.jpg"
import patoImg from "../assets/pato.jpg"
import gastonImg from "../assets/gaston.jpg"
import homeImg from "../assets/home.jpeg"
import airbagImg from "../assets/airbag.jpeg"

interface EventCreator {
  id: string
  name: string
  image: string
  eventsCreated: number
  category: string
}

interface Event {
  id: string
  title: string
  date: string
  month: string
  image: string
  category: string
  participants: number
  isPaid: boolean
}

interface FAQ {
  id: string
  question: string
  answer: string
}

export default function HomePage() {
  const [eventCreators, setEventCreators] = useState<EventCreator[]>([])
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [openFaqId, setOpenFaqId] = useState<string | null>(null)

  useEffect(() => {
    fetchEventCreators()
    fetchFeaturedEvent()
    fetchFAQs()
  }, [])

  const fetchEventCreators = async () => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/event-creators/top')
      // const data = await response.json()
      // setEventCreators(data)

      // Mock data for now
      setEventCreators([
        {
          id: "1",
          name: "Guido Sardelli",
          image: guidoImg,
          eventsCreated: 120,
          category: "Concerts",
        },
        {
          id: "2",
          name: "Pato Sardelli",
          image: patoImg,
          eventsCreated: 85,
          category: "Weddings",
        },
        {
          id: "3",
          name: "Gaston Sardelli",
          image: gastonImg,
          eventsCreated: 42,
          category: "Birthdays",
        },
      ])
    } catch (error) {
      console.error("Error fetching event creators:", error)
    }
  }

  const fetchFeaturedEvent = async () => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/events/featured')
      // const data = await response.json()
      // setFeaturedEvent(data)

      // Mock data for now
      setFeaturedEvent({
        id: "1",
        title: "Airbag River Plate",
        date: "21",
        month: "DEC",
        image: airbagImg,
        category: "Airbag",
        participants: 20000,
        isPaid: true,
      })
    } catch (error) {
      console.error("Error fetching featured event:", error)
    }
  }

  const fetchFAQs = async () => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/faqs')
      // const data = await response.json()
      // setFaqs(data)

      // Mock data for now
      setFaqs([
        {
          id: "1",
          question: "How do I create an event?",
          answer:
            "To create an event, go to your profile and click on 'Create Event'. Fill in the details and publish your event.",
        },
        {
          id: "2",
          question: "Are all events free?",
          answer: "No, some events are paid. You can filter events by free or paid in the events section.",
        },
        {
          id: "3",
          question: "How do I add money to my account?",
          answer:
            "Go to the Balance section in the navigation menu and follow the instructions to add funds to your account.",
        },
      ])
    } catch (error) {
      console.error("Error fetching FAQs:", error)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-300 p-8 md:p-12 lg:p-16 overflow-hidden">
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
                  Explorar eventos
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventCreators.map((creator) => (
              <Link
                key={creator.id}
                to={`/creators/${creator.id}`}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <img
                  src={creator.image || "/placeholder.svg"}
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
        </div>
      </section>

      {/* Featured Event Section */}
      {featuredEvent && (
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="relative h-[400px] sm:h-[500px] rounded-[32px] overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
              <img
                src={featuredEvent.image || "/placeholder.svg"}
                alt={featuredEvent.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-red-900/80 backdrop-blur-sm rounded-full text-white text-sm font-light tracking-wide">
                  {featuredEvent.isPaid ? "Evento pago" : "Evento gratis"}
                </span>
              </div>

              <div className="absolute top-6 right-6 text-right">
                <p className="text-5xl font-light text-white">{featuredEvent.date}</p>
                <p className="text-white/60 text-sm font-light tracking-wider uppercase">{featuredEvent.month}</p>
              </div>

              <div className="absolute bottom-8 left-8 right-8 space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-light tracking-wide border border-white/20">
                    {featuredEvent.category}
                  </span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{featuredEvent.title}</h3>

                <p className="text-white/80 text-base font-light tracking-wide max-w-2xl">
                  Join a community built for connection. Whether you're hosting a concert, workshop, or casual meetup,
                  our platform makes it easy to create, share, and manage your events.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to={`/events/${featuredEvent.id}/buy`}
                    className="px-8 py-3 bg-white text-black rounded-full font-medium tracking-wider uppercase text-sm hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-200"
                  >
                    Comprar entrada
                  </Link>
                  <Link
                    to="/events"
                    className="px-8 py-3 bg-transparent text-white border border-white/40 rounded-full font-medium tracking-wider uppercase text-sm hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-200"
                  >
                    Ver más eventos
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
                      +{(featuredEvent.participants / 1000).toFixed(0)}k participantes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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

          <div className="space-y-4">
            {faqs.map((faq) => (
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
        </div>
      </section>

      <Footer />
    </div>
  )
}
