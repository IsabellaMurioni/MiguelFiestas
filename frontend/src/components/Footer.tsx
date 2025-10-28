import { Phone, Instagram, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          {/* Logo img*/}
          <a href="/" className="flex items-center">
            <div className="text-white text-2xl font-light tracking-tight leading-tight">
              mique
              <br />
              eventos.
            </div>
          </a>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+1234567890"
              className="w-10 h-10 rounded-full border-[0.5px] border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Phone"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border-[0.5px] border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border-[0.5px] border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border-[0.5px] border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              aria-label="TikTok"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
