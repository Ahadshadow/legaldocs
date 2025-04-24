'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <section className="relative bg-blue-50 py-10 px-4 text-center overflow-hidden">
      <div className="flex items-center justify-center">
  <div className="max-w-3xl mx-auto z-10 relative min-h-[550px] mt-20">
    <h1
      className="font-bold"
      style={{
        fontSize: "64px",
        color: "#292929",
        fontFamily: "'Source Sans Pro'",
        height: "100px",
        lineHeight: "90px",
      }}
    >
      How can we help you today?
    </h1>

    <p
      style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
      className="mx-auto mb-[30px] text-[1.4em] font-light leading-[1.5] max-w-[600px] text-[#264966]"
    >
      Search for answers to your questions by entering keywords below, or look through our knowledge base.
    </p>

    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter the search term here..."
            className="w-full pl-[30px] h-[50px] text-[1.1em] bg-white border border-[#bdbdbd] shadow-none rounded-[0.5em] focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            name="search"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-[42px] w-[100px] text-[#264966] text-center font-[400] leading-[1.25] bg-blue-500 text-white rounded-[0.5em] hover:bg-blue-600 transition-colors mt-1 mr-2"
          >
            <Search className="w-5 h-5 mx-auto text-white" />
          </button>
        </div>
      </div>
    </form>
  </div>
</div>




      {/* SVG Waves */}
      <svg
        className="absolute bottom-0 left-0 w-full aries_waves opacity_layer z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 275"
      >
        <path
          fill="#e8f3fe"
          fillOpacity="1"
          d="M0,64L60,64C120,64,240,64,360,101.3C480,139,600,213,720,229.3C840,245,960,203,1080,186.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-full aries_waves solid_wave z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 250"
      >
        <path
          fill="#ffffff"
          fillOpacity="1"
          d="M0,64L60,64C120,64,240,64,360,101.3C480,139,600,213,720,229.3C840,245,960,203,1080,186.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>
    </section>
  )
}
