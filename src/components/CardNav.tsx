'use client';

import React, { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';

export type CardNavLink = {
  label: string;
  href?: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgClass?: string;    // Tailwind bg class, e.g. "bg-neutral-900"
  textClass?: string;  // Tailwind text class, e.g. "text-white"
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;                     // path to image in /public (e.g. "/logo.svg")
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  navBgClass?: string;              // Tailwind bg class for top bar (default: bg-white)
  menuColorClass?: string;          // Tailwind text color for hamburger (default: text-black)
  ctaBgClass?: string;              // Tailwind bg for CTA button (default: bg-black)
  ctaTextClass?: string;            // Tailwind text for CTA button (default: text-white)
  brandText?: string;               // wordmark shown next to logo (default: BestPick)
  brandTextClass?: string;          // Tailwind class for brand text
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  className = '',
  ease = 'power3.out',
  navBgClass = 'bg-white',
  menuColorClass = 'text-black',
  ctaBgClass = 'bg-black',
  ctaTextClass = 'text-white',
  brandText = 'Best Pick',
  brandTextClass = "text-xl md:text-2xl font-semibold tracking-tight font-['Satoshi']",
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        // Temporarily make content measurable
        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        // force reflow
        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        // restore
        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  }, []);

  const createTimeline = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  }, [calculateHeight, ease]);

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [createTimeline, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        if (navRef.current) gsap.set(navRef.current, { height: newHeight });

        tlRef.current!.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current!.kill();
        const newTl = createTimeline();
        if (newTl) tlRef.current = newTl;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [createTimeline, calculateHeight, isExpanded]);

  const toggleMenu = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  }, [isExpanded]);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  // keyboard toggle for accessibility (Enter / Space)
  const onHamburgerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  };

  return (
    <div className={`card-nav-container absolute left-1/2 -translate-x-1/2 w-[70%] max-w-[850px] z-99 top-[1.2em] md:top-[2em] ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] p-0 rounded-xl shadow-md relative overflow-hidden will-change-[height] ${navBgClass}`}
        aria-expanded={isExpanded}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between px-3 z-2">
          {/* LEFT: hamburger (visible on all backgrounds via menuColorClass) */}
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''} group h-full  flex flex-col items-center justify-center cursor-pointer gap-1.5 order-1 md:order-1`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            onKeyDown={onHamburgerKeyDown}
          >
            {/* using background color on small lines to ensure visibility */}
            <span
              className={`
    block w-[30px] h-0.5 
    bg-black               /* force visible black lines */
    rounded-sm transform transition duration-300 
    ${isHamburgerOpen ? 'translate-y-1 rotate-45' : ''}
  `}
            />

            <span
              className={`
    block w-[30px] h-0.5 
    bg-black               /* force visible black lines */
    rounded-sm transform transition duration-300 
    ${isHamburgerOpen ? '-translate-y-1 -rotate-45' : ''}
  `}
            />

          </div>

          {/* CENTER: logo + brand text (keeps centered in navbar) */}
          <div className="logo-container flex items-center justify-center flex-1 pointer-events-auto order-2 md:order-2">
            <div className="inline-flex items-center gap-2">
              <img src={logo} alt={logoAlt} className="logo h-10 md:h-12" />
              <span className={`${brandTextClass} ${menuColorClass}`}>{brandText}</span>
            </div>
          </div>

          {/* RIGHT: CTA button */}
          <div className="order-3">
            <button
              type="button"
              className={`card-nav-cta-button hidden md:inline-flex border-0 rounded-[calc(0.75rem-0.2rem)] px-4 py-2.5 items-center h-full font-medium cursor-pointer transition-colors duration-300 ${ctaBgClass} ${ctaTextClass}`}
            >
              Get Started
            </button>
          </div>
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-1 ${isExpanded ? 'visible pointer-events-auto' : 'invisible pointer-events-none'} md:flex-row md:items-end md:gap-3`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className={`nav-card select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:h-full md:min-h-0 md:flex-[1_1_0%] ${item.bgClass ?? 'bg-neutral-900'} ${item.textClass ?? 'text-white'}`}
              ref={setCardRef(idx)}
            >
              <div className="nav-card-label font-normal tracking-[-0.5px] text-[18px] md:text-[22px]">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-0.5">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-1.5 no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px] md:text-[16px]"
                    href={lnk.href || '#'}
                    aria-label={lnk.ariaLabel}
                  >
                    <GoArrowUpRight className="nav-card-link-icon shrink-0" aria-hidden="true" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
