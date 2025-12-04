"use client";

export default function SearchPromptHero() {
  return (
    <section className="bg-black text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div className="space-y-6">
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-extrabold leading-tight">
              Search any product — we’ll find the best price instantly.
            </h2>

            <p className="text-white/80 text-base max-w-[55ch]">
              Paste a product URL or search by name. Cached comparison results appear instantly.
            </p>

            <button
              className="inline-flex items-center justify-center min-h-[52px] px-6 rounded-lg bg-[#7C3AED] text-white text-sm font-semibold shadow-sm hover:bg-[#6b2fdd] transition"
            >
              Search Now
            </button>
          </div>

          {/* RIGHT SIDE — IMAGE HOLDER */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[480px] h-80 border border-white/10 rounded-xl flex items-center justify-center text-white/40">
              Image Placeholder
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
