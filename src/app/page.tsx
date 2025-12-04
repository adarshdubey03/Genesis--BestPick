// src/app/page.tsx
import React from 'react';
import CardNav from '@/components/CardNav';
import Beams from '@/components/Beams';
import RotatingText from '@/components/RotatingText';
import SearchPromptHero from '@/components/SearchPromptHero';

const items = [
  {
    label: 'About',
    bgColor: '#0D0716',
    textColor: '#fff',
    links: [
      { label: 'Company', href: '#company', ariaLabel: 'About Company' },
      { label: 'Careers', href: '#careers', ariaLabel: 'About Careers' }
    ]
  },
  {
    label: 'Projects',
    bgColor: '#170D27',
    textColor: '#fff',
    links: [
      { label: 'Featured', href: '#featured', ariaLabel: 'Featured Projects' },
      { label: 'Case Studies', href: '#case-studies', ariaLabel: 'Project Case Studies' }
    ]
  },
  {
    label: 'Contact',
    bgColor: '#271E37',
    textColor: '#fff',
    links: [
      { label: 'Email', href: '#email', ariaLabel: 'Email us' },
      { label: 'Twitter', href: '#twitter', ariaLabel: 'Twitter' },
      { label: 'LinkedIn', href: '#linkedin', ariaLabel: 'LinkedIn' }
    ]
  }
];

export default function Page() {
  return (
    <>
      <main className="min-h-screen bg-black relative flex items-center justify-center">
        {/* Navbar (absolute overlay) */}
        <CardNav
          logo="/genesislogo.jpg"
          logoAlt="Company Logo"
          items={items}
        />

        {/* Hero / Beams - Centered Container */}
        <div className="w-full flex items-center justify-center px-4">
          <div
            style={{
              width: '100%',
              maxWidth: 1200,
              height: 600,
              position: 'relative'
            }}
          >
            <Beams
              beamWidth={3}
              beamHeight={30}
              beamNumber={12}
              lightColor="#ffffff"
              speed={2}
              noiseIntensity={1.75}
              scale={0.2}
              rotation={32}
            />

            {/* Centered hero content: fixed + rotating */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4"
              style={{ color: 'rgba(255,255,255,0.92)' }}
            >
              <h1 className="flex flex-col md:flex-row items-center text-white justify-center gap-4 md:gap-6 text-4xl md:text-6xl font-semibold leading-tight">
                <span className="block">Shop</span>

                <span className="inline-flex items-center justify-center">
                  <RotatingText
                    texts={['Smarter', 'Simpler', 'Faster', 'Fairer', 'Better']}
                    mainClassName="px-2 sm:px-2 md:px-8 bg-white text-black overflow-hidden py-0.5 sm:py-1 md:py-1 justify-center rounded-lg inline-flex"
                    staggerFrom={'last'}
                    initial={{ y: '20%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-20%', opacity: 0 }}
                    transition={{ type: 'tween', duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    staggerDuration={0.015}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    rotationInterval={2800}
                    splitBy="characters"
                  />
                </span>
              </h1>

              <p className="mt-6 text-sm md:text-lg opacity-90 max-w-3xl mx-auto">
                We scan all major e-commerce sites in real time and show you the lowest price instantly.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SearchPromptHero />
    </>
  );
}