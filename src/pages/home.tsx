import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";


import { toast } from "@/hooks/use-toast";

import logoOrangePath from "@assets/lp-logo-red.png";
import heroImg from "@assets/stock/hero-cpg.png";
import heroVid1 from "@assets/generated_videos/cpg-chocolate-pour.mp4";
import heroVid2 from "@assets/generated_videos/cpg-product-flatlay.mp4";
import heroVid3 from "@assets/generated_videos/cpg-retail-shelf.mp4";
import tazaBg from "@assets/stock/work/taza-bg.webp";
import tazaLogo from "@assets/stock/work/taza-logo.webp";
import grandyBg from "@assets/stock/work/grandy-bg.webp";
import grandyLogo from "@assets/stock/work/grandy-logo.webp";
import cappellosBg from "@assets/stock/work/cappellos-bg.webp";
import cappellosLogo from "@assets/stock/work/cappellos-logo.webp";
import lesserevilBg from "@assets/stock/work/lesserevil-bg.webp";
import lesserevilLogo from "@assets/stock/work/lesserevil-logo.webp";
import reuzelPerson from "@assets/stock/work/reuzel-person.webp";
import tazaReel from "@assets/stock/work/taza-reel.png";
import reuzelReel from "@assets/Group_1212_1780953994391.png";
import cappellosReel from "@assets/stock/work/cappellos-reel.png";
import lesserEvilFriends from "@assets/Image_514_1781014172267.png";
import honeyMamas from "@assets/Image_522_1781014164874.png";
import grandyCamp from "@assets/Rectangle_672_1780954095454.png";
import grandyProducts from "@assets/GrandyOrganics-13_1781014157199.jpg";
import dolcezza from "@assets/189A0254_1781014145523.png";
import cappellosSmile from "@assets/Image_512_1781014140431.png";
import bornSimpleMexican from "@assets/03_MexicanBowl_Ledge_0030_copy_1781014134890.jpg";
import bornSimpleCheese from "@assets/05_CheeseBag_0061_copy_1781014134890.jpg";
import bornSimpleFamily from "@assets/06_FamilyShot_0111_copy_1781014134891.jpg";
import bornSimpleTeriyaki from "@assets/10_TeriyakiBowl_Micro_0019_copy_1781014134891.jpg";
import cpgHoneyDrizzle from "@assets/generated_videos/cpg-honey-drizzle.mp4";
import cpgBrandLineup from "@assets/generated_videos/cpg-brand-lineup.mp4";
import logoWholeFoods from "@assets/1280px-Whole_Foods_Market_logo.svg_1781014195165.png";
import logoAlbertsons from "@assets/Albertsons_(logo).svg_1781014195166.png";
import logoHEB from "@assets/H-E-B_logo.svg_1781014798878.png";
import logoKroger from "@assets/Kroger-Racing_1781014195166.png";
import logoSprouts from "@assets/Sprouts_Farmers_Market_Logo_1781014195166.png";
import logoTarget from "@assets/Target_logo.svg_1781014195166.png";
import logoThrive from "@assets/Thrive_Market_logo_(2020)_1781014195166.svg";
import logoWalmart from "@assets/Walmart-Logo-PNG-Transparent.png-scaled_1781014195166.webp";

const ORANGE = "#F95500";
const DARK = "#0E0C0A";
const CREAM = "#F2EAE0";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

type ContactMode = "message" | "call";

/* Open the contact popup from anywhere via a window event so any CTA can
   trigger it without prop-drilling. The modal (rendered once in Home) listens. */
function openContact(mode: ContactMode = "message") {
  window.dispatchEvent(new CustomEvent("open-contact", { detail: mode }));
}

/* Open a brand's case study popup by its index in the `brands` array. */
function openCaseStudy(index: number) {
  window.dispatchEvent(new CustomEvent("open-case-study", { detail: index }));
}

/* Open the "About Us" popup from anywhere via a window event. */
function openAbout() {
  window.dispatchEvent(new CustomEvent("open-about"));
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL — whileInView (IntersectionObserver)
   Works reliably in all contexts incl. iframes.
───────────────────────────────────────────── */
function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
type CaseStudyStat = { value: string; label: string; context?: string };
type ChecklistItem = { number: string; title: string; description: string };
type CaseStudy = {
  subtitle?: string;
  tagline: string;
  heroStat?: CaseStudyStat;
  challenge?: string;
  approach?: string;
  result?: string;
  overview?: string;
  scope: string[];
  results?: CaseStudyStat[];
  checklist?: { title: string; items: ChecklistItem[] };
};
type Brand = {
  name: string;
  category: string;
  bg?: string;
  logo?: string;
  person?: string;
  variant?: string;
  span?: string;
  caseStudy: CaseStudy;
};

const brands: Brand[] = [
  {
    name: "Taza Chocolate",
    category: "Packaging Design · Content Creation",
    bg: tazaBg,
    logo: tazaLogo,
    span: "full",
    caseStudy: {
      subtitle: "Stone-ground organic chocolate · Partnership since 2022",
      tagline:
        "Crossed $2M total revenue for the first time in 2025 — paid grew 44% while ROAS improved, email grew to 50% of sales, and the program kept beating Klaviyo industry benchmarks.",
      heroStat: {
        value: "$2.1M",
        label: "Total revenue, 2025",
        context: "+24% YoY, with paid up 44% and ROAS improving year over year",
      },
      challenge:
        "Taza needed sustained, profitable growth across paid and email — not a one-quarter spike. The brand had strong product loyalty but DTC revenue needed a step change.",
      approach:
        "Took over paid media on Google and Meta and rebuilt the email program. Layered seasonal promotions, evergreen campaigns, and refreshed flows tied to Taza's strongest moments — holiday, Black Friday, limited-edition launches.",
      result:
        "Crossed $2M in total revenue for the first time in 2025. Paid revenue grew 44% while ROAS improved to 3.30x — proof that scaling spend can compound, not cannibalize. Email now drives half of all sales.",
      scope: ["Paid Media", "Email", "SMS", "Creative"],
      results: [
        { value: "3.30x", label: "Paid ROAS, 2025", context: "Up from 2.92x in 2024" },
        { value: "$750K", label: "Paid revenue, 2025", context: "+44% YoY vs $521K" },
        { value: "50%", label: "Of sales from email", context: "$1.05M attributed, +20% YoY" },
        { value: "5.10x", label: "BFCM ROAS, Nov 2025", context: "$26K spend → $133K revenue" },
      ],
    },
  },
  {
    name: "Reuzel",
    category: "Ecommerce Overhaul · Campaigns",
    variant: "reuzel",
    person: reuzelPerson,
    caseStudy: {
      subtitle: "Premium men's grooming · Partnership since August 2023",
      tagline:
        "Took over paid media and rebuilt email from the ground up — drove a 12% ROAS improvement and 51% YoY email revenue growth in the first full year.",
      heroStat: {
        value: "3.92x",
        label: "Blended ROAS, 2024",
        context: "$93.5K spend → $366K revenue across Google, Meta, and Microsoft",
      },
      challenge:
        "Reuzel needed a single agency partner to consolidate fragmented paid media efforts and unlock email as a meaningful revenue channel. Their goal: improve blended ROAS while scaling spend.",
      approach:
        "Took over 100% of paid media in August 2023 across Google, Meta, and Microsoft. Rebuilt the email program from the ground up with new flows, segmentation, and a campaign calendar tied to product launches and limited-edition drops.",
      result:
        "12% ROAS improvement across all paid channels in the first full year. Email grew to nearly half of all revenue, with Facebook ROAS scaling 20% while spend grew 10x.",
      scope: ["Paid Media", "Email", "SMS", "Creative"],
      results: [
        { value: "47%", label: "Of revenue from email", context: "2024 full year" },
        { value: "+51%", label: "Email revenue YoY", context: "2024 vs 2023" },
        { value: "+23%", label: "Total revenue YoY", context: "$1.16M total" },
        { value: "12.1x", label: "Meta revenue growth", context: "$5K → $64K" },
      ],
    },
  },
  {
    name: "Grandy Organics",
    category: "Packaging · Brand Design",
    bg: grandyBg,
    logo: grandyLogo,
    caseStudy: {
      subtitle: "Organic granola and snack mixes · Maine roots",
      tagline:
        "Full-line packaging refresh that modernized the look without losing shelf familiarity — plus a deep bank of brand assets, characters, and visual elements that now extend across digital.",
      challenge:
        "Grandy Organics needed a full-line packaging refresh that better reflected their adventurous spirit, Maine roots, and premium organic ingredients — without losing the at-a-glance familiarity their existing customers count on.",
      approach:
        "Reinvented how the product is showcased on-bag (without the traditional product window), developed a new character system and visual language, and clarified the product line hierarchy under one unified philosophy.",
      result:
        "A refreshed, ownable look across the full SKU lineup — plus a deep bank of brand assets, characters, and visual elements that now extend across Grandy's digital presence, social, and retail merchandising.",
      scope: ["Packaging", "Brand Design", "Creative"],
      checklist: {
        title: "Five packaging goals — delivered",
        items: [
          { number: "01", title: "Stripes + characters", description: "Highlight heritage, add personality" },
          { number: "02", title: "Product showcase", description: "Reinvented without a window" },
          { number: "03", title: "Line clarity", description: "Distinct yet unified system" },
          { number: "04", title: "Asset bank", description: "Extends across digital" },
          { number: "05", title: "Shelf familiarity", description: "Held customer recognition" },
        ],
      },
    },
  },
  {
    name: "Cappello's",
    category: "Influencer · Retail Launch",
    bg: cappellosBg,
    logo: cappellosLogo,
    caseStudy: {
      subtitle: "Grain-free pasta and baked goods · New SKU influencer launch",
      tagline:
        "Seeded 113 product kits to a curated creator mix and generated 11.2M reach from 190 pieces of organic content — a 51% creator share rate that made it our most successful influencer campaign to date.",
      heroStat: {
        value: "11.2M",
        label: "Total reach",
        context: "11.1M impressions · 190 posts · 58 creators · 113 kits sent",
      },
      challenge:
        "Cappello's was launching a first-in-category SKU and needed broad awareness with emphasis on retail distribution — getting the product in front of the right audiences at scale without relying purely on paid.",
      approach:
        "Seeded 113 product kits across a curated mix of macro and mid-tier creators — food, health, and lifestyle — spanning accounts with combined audiences in the tens of millions. Quality of fit over raw follower count.",
      result:
        "58 of 113 gifted creators posted unprompted — a 51% share rate well above typical gifting benchmarks — generating 190 pieces of content and 11.2M total reach. Our most successful influencer campaign to date.",
      scope: ["Influencer", "Brand Awareness", "Retail Launch"],
      results: [
        { value: "51%", label: "Creator share rate", context: "58 of 113 gifted creators posted" },
        { value: "190", label: "Posts generated", context: "Organic, unprompted content" },
        { value: "1.8M", label: "Top creator reach", context: "@skinnytaste, recipe developer" },
        { value: "113", label: "Kits seeded", context: "Macro to micro, food to lifestyle" },
      ],
    },
  },
  {
    name: "Lesser Evil",
    category: "Newsletter Campaigns · DTC",
    bg: lesserevilBg,
    logo: lesserevilLogo,
    caseStudy: {
      tagline: "Snack-time newsletters people actually open.",
      overview:
        "We turned LesserEvil's owned channels into a growth engine — newsletter campaigns and a tightened DTC journey that keep fans coming back for the next batch.",
      scope: ["Newsletter Campaigns", "DTC Strategy", "Lifecycle"],
      results: [
        { value: "+49%", label: "Repeat Purchase" },
        { value: "32%", label: "Click Rate" },
        { value: "+2.1×", label: "LTV" },
      ],
    },
  },
];

const tickerItems = [
  { label: "Taza Chocolate" },
  { stat: "3.92×", label: "Blended ROAS" },
  { label: "Reuzel" },
  { stat: "+51%", label: "Email Revenue YoY" },
  { label: "Cappello's" },
  { stat: "11.2M", label: "Influencer Reach" },
  { label: "Grandy Organics" },
  { stat: "34.7×", label: "SMS ROI" },
  { label: "Born Simple" },
  { stat: "20+", label: "CPG Brands" },
  { label: "Honey Mama's" },
  { stat: "$2.1M", label: "Revenue, 2025" },
  { label: "Lesser Evil" },
  { stat: "23%", label: "Opt-in to Purchase" },
] as const;

const stats: { value: string; label: string; context?: string }[] = [
  { value: "3.92×", label: "Blended ROAS", context: "Reuzel, 2024" },
  { value: "+25%", label: "Ecomm Growth YoY", context: "Taza, 2025" },
  { value: "34.7×", label: "SMS Program ROI", context: "Taza, Lifetime" },
  { value: "20+", label: "CPG Brands Partnered", context: "100% CPG-Focused" },
];

/* ─────────────────────────────────────────────
   NAV — centered logo, links on each side
   Mirrors Stone exactly.
───────────────────────────────────────────── */
function Navbar({ tone }: { tone: "dark" | "light" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // tone === "dark" => dark background behind nav => use white text/logo
  const onDarkBg = tone === "dark";
  const textColor = onDarkBg ? "#fff" : DARK;

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 backdrop-blur-md" : "py-5"
        }`}
        style={{
          background: scrolled
            ? onDarkBg
              ? "rgba(14,12,10,0.55)"
              : "rgba(242,234,224,0.7)"
            : "transparent",
          borderBottom: scrolled
            ? onDarkBg
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(0,0,0,0.06)"
            : "none",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 items-center">
          {/* Left links */}
          <div className="hidden md:flex items-center gap-8">
            {["Work"].map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l.toLowerCase())}
                className="text-xs font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-60 cursor-pointer"
                style={{ color: textColor, background: "none", border: "none", padding: 0 }}
                data-testid={`link-nav-${l.toLowerCase()}`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Center logo */}
          <div className="flex justify-center">
            <a href="/" aria-label="Little Pilot">
              <img
                src={logoOrangePath}
                alt="Little Pilot"
                className="h-8 md:h-9 object-contain"
                data-testid="img-logo"
                style={{ filter: onDarkBg ? "brightness(0) invert(1)" : "none", transition: "filter 0.5s ease" }}
              />
            </a>
          </div>

          {/* Right links */}
          <div className="hidden md:flex items-center justify-end gap-8">
            <button
              onClick={() => scrollTo("about")}
              className="text-xs font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-60 cursor-pointer"
              style={{ color: textColor, background: "none", border: "none", padding: 0 }}
              data-testid="link-nav-about"
            >
              About
            </button>
            <button
              onClick={() => openContact()}
              className="text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 border transition-colors cursor-pointer"
              style={{ color: ORANGE, borderColor: ORANGE, background: "transparent" }}
              onMouseEnter={(e) => { const t = e.currentTarget as HTMLElement; t.style.background = ORANGE; t.style.color = "#fff"; }}
              onMouseLeave={(e) => { const t = e.currentTarget as HTMLElement; t.style.background = "transparent"; t.style.color = ORANGE; }}
              data-testid="link-nav-cta"
            >
              Reach Out
            </button>
          </div>

          {/* Mobile burger */}
          <div className="md:hidden flex justify-end col-span-2">
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setOpen(!open)}
              data-testid="button-mobile-menu"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block h-0.5 w-6"
                  style={{ background: textColor }}
                  animate={
                    open
                      ? i === 1
                        ? { opacity: 0 }
                        : i === 0
                        ? { rotate: 45, y: 8 }
                        : { rotate: -45, y: -8 }
                      : { opacity: 1, rotate: 0, y: 0 }
                  }
                />
              ))}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-8 text-3xl font-bold uppercase tracking-wide"
            style={{ background: DARK, color: "#fff" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {["Work", "About"].map((l) => (
              <button key={l} onClick={() => { scrollTo(l.toLowerCase()); setOpen(false); }} className="hover:opacity-60 transition-opacity cursor-pointer" style={{ background: "none", border: "none", color: "#fff", fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit" }}>{l}</button>
            ))}
            <button onClick={() => { openContact(); setOpen(false); }} style={{ color: ORANGE, background: "none", border: "none", fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit", cursor: "pointer" }}>Reach Out</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────────
   HERO — fast-cut mixed slideshow: real brand photos + stock videos.
   Images: 2.2 s with Ken Burns zoom. Videos: 3.5 s then advance.
   Hard dissolve: 0.35 s.
───────────────────────────────────────────── */
type HeroSlide =
  | { kind: "image"; src: string; duration: number }
  | { kind: "video"; src: string; duration: number };

const heroSlides: HeroSlide[] = [
  { kind: "image", src: bornSimpleFamily,   duration: 4500 },
  { kind: "image", src: lesserEvilFriends,  duration: 4500 },
  { kind: "video", src: heroVid1,           duration: 6000 },
  { kind: "image", src: cappellosSmile,     duration: 4500 },
  { kind: "image", src: grandyCamp,         duration: 4500 },
  { kind: "video", src: heroVid3,           duration: 6000 },
  { kind: "image", src: honeyMamas,         duration: 4500 },
  { kind: "image", src: dolcezza,           duration: 4500 },
  { kind: "image", src: grandyProducts,     duration: 4500 },
  { kind: "video", src: heroVid2,           duration: 6000 },
  { kind: "image", src: bornSimpleCheese,   duration: 4500 },
  { kind: "image", src: bornSimpleMexican,  duration: 4500 },
  { kind: "image", src: bornSimpleTeriyaki, duration: 4500 },
  { kind: "video", src: cpgHoneyDrizzle,    duration: 6000 },
  { kind: "video", src: cpgBrandLineup,     duration: 6000 },
];

function HeroSlideshow() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => setIdx((i) => (i + 1) % heroSlides.length), []);

  useEffect(() => {
    if (reduce) return;
    const slide = heroSlides[idx];
    timerRef.current = setTimeout(advance, slide.duration);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [idx, reduce, advance]);

  if (reduce) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <img src={heroImg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }

  const slide = heroSlides[idx];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Poster fallback — visible until first slide fades in */}
      <img src={heroImg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />

      <AnimatePresence mode="sync">
        <motion.div
          key={idx}
          className="absolute inset-0"
          style={{ zIndex: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {slide.kind === "image" ? (
            <motion.img
              src={slide.src}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.0 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: (slide.duration + 700) / 1000, ease: "linear" }}
            />
          ) : (
            <video
              key={slide.src}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onEnded={advance}
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Cinematic parallax + orange flood on scroll
  const layerY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const orangeOverlay = useTransform(scrollYProgress, [0.35, 0.8], [0, 1]);
  // Fade the tagline out early (before the wordmark scales up) and push it
  // slightly DOWN/away — so the growing logo can never collide with it.
  const contentOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.9], ["0%", "10%"]);

  // Scroll-linked logo: scales up and fades out as you scroll down
  const logoScale = useTransform(scrollYProgress, [0, 0.6], [1, 2.3]);
  const logoGroupOpacity = useTransform(scrollYProgress, [0.45, 0.72], [1, 0]);


  return (
    <section
      ref={ref}
      data-navtone="dark"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: DARK }}
    >
      {/* Video backdrop with parallax */}
      <motion.div className="absolute inset-0" style={{ y: layerY }}>
        <HeroSlideshow />
      </motion.div>

      {/* Permanent legibility scrim */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(14,12,10,0.55) 0%, rgba(14,12,10,0.25) 40%, rgba(14,12,10,0.65) 100%)" }}
      />

      {/* Orange flood overlay — pours in on scroll */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: ORANGE, opacity: orangeOverlay }} />

      {/* Hero column — wordmark + tagline stacked in one centered flow so they
         can never overlap. Wordmark is scroll-linked: white → orange, grows, then fades. */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div
          className="relative w-[18rem] md:w-[40rem]"
          style={{ scale: logoScale, opacity: logoGroupOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.86 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.34, 1.9, 0.64, 1] }}
          >
            {/* orange — visible on load, sits underneath */}
            <img
              src={logoOrangePath}
              alt="Little Pilot"
              className="w-full object-contain"
              style={{ filter: "drop-shadow(0 6px 40px rgba(249,85,0,0.45))" }}
            />
            {/* white — fades in on top, becoming the resting state */}
            <motion.img
              src={logoOrangePath}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full object-contain"
              style={{ filter: "brightness(0) invert(1) drop-shadow(0 6px 34px rgba(0,0,0,0.55))" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.8, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Tagline + subtext — clearly below the wordmark */}
        <motion.div
          className="flex flex-col items-center mt-10 md:mt-14"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {/* Tagline — word-by-word stagger */}
          <div className="flex flex-wrap justify-center gap-x-[0.45em] gap-y-0">
            {["Damn", "Good", "Digital", "Marketing"].map((word, i) => (
              <div key={word} className="overflow-hidden">
                <motion.span
                  className="block text-white text-xl md:text-2xl font-normal tracking-[0.35em] uppercase"
                  initial={{ y: "115%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.5 + i * 0.1, ease: [0.2, 1.5, 0.4, 1] }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            className="my-8 h-px w-16 bg-white origin-center"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          />

          {/* Subtext */}
          <motion.p
            className="text-white/55 text-sm tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            CPG-Native · Growth-Focused
          </motion.p>
        </motion.div>
      </div>

      {/* Scrolling stats + brand ticker */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden"
        style={{
          background: "rgba(14,12,10,0.52)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 2.0 }}
      >
        <div className="py-3 overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            style={{ width: "max-content" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 px-5">
                {"stat" in item ? (
                  <>
                    <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: ORANGE }}>
                      {item.stat}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                      {item.label}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
                    {item.label}
                  </span>
                )}
                <span className="text-white/20 ml-2">·</span>
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   INTRO — dark section, big centered statement
───────────────────────────────────────────── */
function Intro() {
  return (
    <section
      id="intro"
      data-navtone="dark"
      className="relative min-h-[100dvh] flex flex-col justify-center py-40"
      style={{ background: DARK }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Label top-left */}
        <motion.div
          className="lg:col-span-3 flex items-start"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="text-xs font-bold uppercase tracking-[0.25em]"
            style={{ color: ORANGE }}
          >
            CPG Digital Marketing
          </span>
        </motion.div>

        {/* Giant headline */}
        <motion.div
          className="lg:col-span-9"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="font-black uppercase leading-[0.88] tracking-tight text-white"
            style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
          >
            Damn Good<br />
            Digital Marketing<br />
            <span style={{ color: ORANGE }}>For Brands</span><br />
            That Mean Business.
          </h2>
        </motion.div>

        {/* Body + CTA bottom-right */}
        <motion.div
          className="lg:col-start-7 lg:col-span-6"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-white/50 text-lg leading-relaxed mb-10">
            Little Pilot is a small, senior team of marketers and designers built specifically for natural products and CPG brands. We run paid media, email & SMS, creative, and influencer programs as a true extension of your in-house team — closer to a partner than a vendor, with the reporting and accountability of an agency.
          </p>
          <button
            onClick={() => openContact()}
            className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest border-b-2 pb-1 transition-colors hover:opacity-70 cursor-pointer"
            style={{ color: ORANGE, borderColor: ORANGE, background: "none", border: "none", borderBottom: `2px solid ${ORANGE}` }}
            data-testid="link-intro-cta"
          >
            Let's Build What Comes Next
            <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>→</motion.span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SERVICES — full-funnel capabilities from deck
───────────────────────────────────────────── */
const serviceList = [
  {
    num: "01",
    title: "Paid Media",
    body: "Google, Meta, Microsoft, and retail media — Instacart, Walmart Connect, GoPuff. Full-funnel paid strategy built for CPG.",
  },
  {
    num: "02",
    title: "Email & SMS",
    body: "Klaviyo + Postscript. Campaign strategy, automated flows, segmentation, and list growth that compounds over time.",
  },
  {
    num: "03",
    title: "Social & Influencer",
    body: "Organic content strategy and calendars. Paid + in-kind influencer partnerships, from identification through reporting.",
  },
  {
    num: "04",
    title: "Creative & Content",
    body: "Photo production, UGC, graphic design, package design, copywriting — all in-house, built for shelf and feed.",
  },
  {
    num: "05",
    title: "Ecomm Strategy",
    body: "Shopify strategy, e-retailer distribution, SEO, and paid — full DTC growth infrastructure for emerging CPG brands.",
  },
  {
    num: "06",
    title: "Retailer Support",
    body: "Geo-targeted velocity pushes, buyer pitch decks, on-shelf and digital coordination across major national retailers.",
  },
];

function Services() {
  return (
    <section data-navtone="light" id="services" className="border-t border-black/10" style={{ background: CREAM }}>
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <ScrollReveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: ORANGE }}>
            What We Do
          </span>
        </ScrollReveal>
        <ScrollReveal>
          <h2
            className="font-black uppercase tracking-tight leading-[0.92] mt-6"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
          >
            Full-funnel growth<br />
            <span style={{ color: ORANGE }}>for CPG brands.</span>
          </h2>
        </ScrollReveal>
        <div
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: "rgba(14,12,10,0.12)" }}
        >
          {serviceList.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 0.04}>
              <div className="p-8 h-full" style={{ background: CREAM }}>
                <div
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
                  style={{ color: ORANGE }}
                >
                  {s.num}
                </div>
                <h3
                  className="font-black uppercase tracking-tight text-xl mb-3"
                  style={{ color: DARK }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/60">{s.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   BRAND CARD — portfolio piece, photo + white logo
───────────────────────────────────────────── */
function BrandCard({ brand, index }: { brand: typeof brands[0]; index: number }) {
  const isReuzel = brand.variant === "reuzel";
  const isFull = brand.span === "full";

  return (
    <motion.button
      type="button"
      onClick={() => openCaseStudy(index)}
      aria-label={`${brand.name} — view case study`}
      className={`group relative block w-full text-left overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EAE0] ${isFull ? "md:col-span-2" : ""}`}
      style={{ background: DARK, aspectRatio: isFull ? "16 / 7" : "4 / 3", border: "none", ["--tw-ring-color" as string]: ORANGE }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`card-brand-${index}`}
    >
      {isReuzel ? (
        <>
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 28% 45%, #341607 0%, #0E0C0A 68%)" }}
          />
          <img
            src={brand.person}
            alt=""
            className="absolute right-2 bottom-0 h-[92%] object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col justify-center pl-8 md:pl-14 pr-[42%] pointer-events-none">
            <h3
              className="text-white font-black uppercase tracking-tight leading-none transition-transform duration-700 group-hover:-translate-y-1"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
            >
              Reuzel
            </h3>
          </div>
        </>
      ) : (
        <>
          <img
            src={brand.bg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(14,12,10,0.78) 0%, rgba(14,12,10,0.18) 45%, rgba(14,12,10,0.4) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-10 pointer-events-none">
            <img
              src={brand.logo}
              alt={brand.name}
              className="object-contain transition-transform duration-700 group-hover:-translate-y-1"
              style={{ maxHeight: isFull ? "32%" : "38%", maxWidth: "62%" }}
            />
          </div>
        </>
      )}

      {/* Category + reveal */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between gap-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/85">
          {brand.category}
        </span>
        <span
          className="text-[11px] font-bold uppercase tracking-[0.22em] opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 whitespace-nowrap"
          style={{ color: ORANGE }}
        >
          View →
        </span>
      </div>
    </motion.button>
  );
}

function Work() {
  return (
    <section id="work" data-navtone="light" className="border-t border-black/10" style={{ background: CREAM }}>
      {/* Section header — real copy from littlepilot.co/work */}
      <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-12 md:pb-16">
        <ScrollReveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: ORANGE }}>
            Selected Work
          </span>
        </ScrollReveal>
        <ScrollReveal>
          <h2
            className="font-black lowercase tracking-tight leading-[0.95] mt-6"
            style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)" }}
          >
            work we're proud of.
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-foreground/60 leading-relaxed">
            From newsletter campaigns to ecommerce overhauls to packaging design and content
            creation, we listen to our partner's needs and meet them where they're at.
          </p>
        </ScrollReveal>
      </div>

      {/* Brand grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {brands.map((b, i) => (
            <BrandCard key={b.name} brand={b} index={i} />
          ))}
        </div>
      </div>

      {/* Closing CTA */}
      <div className="max-w-7xl mx-auto px-6 pb-24 border-t border-black/10 pt-16">
        <ScrollReveal>
          <button
            onClick={() => openContact()}
            className="text-sm font-bold uppercase tracking-widest inline-flex items-center gap-3 hover:opacity-60 transition-opacity cursor-pointer"
            style={{ background: "none", border: "none" }}
            data-testid="link-view-all-work"
          >
            Let's work together →
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   WORK REEL — dual-row auto-scrolling project strip
───────────────────────────────────────────── */
const reelRowOne = [
  { src: tazaBg, alt: "Taza Chocolate", label: "Taza Chocolate", category: "Paid · Email · SMS" },
  { src: grandyBg, alt: "Grandy Organics", label: "Grandy Organics", category: "Packaging · Brand" },
  { src: cappellosReel, alt: "Cappello's products", label: "Cappello's", category: "Influencer · Retail" },
  { src: reuzelPerson, alt: "Reuzel ambassador", label: "Reuzel", category: "Influencer · Paid" },
];
const reelRowTwo = [
  { src: lesserevilBg, alt: "Lesser Evil snacks", label: "Lesser Evil", category: "Newsletter · DTC" },
  { src: cappellosSmile, alt: "Cappello's influencer", label: "Cappello's", category: "Influencer · Social" },
  { src: tazaReel, alt: "Taza product shot", label: "Taza Chocolate", category: "Social · Creative" },
  { src: lesserEvilFriends, alt: "Lesser Evil campaign", label: "Lesser Evil", category: "Influencer · DTC" },
];

function WorkReel() {
  const items = [...reelRowOne, ...reelRowTwo];
  const looped = [...items, ...items];
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const paused = useRef(false);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollStart = useRef(0);
  const SPEED = 0.6;
  const CARD_W = 330;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = () => {
      if (!paused.current && !dragging.current && track) {
        track.scrollLeft += SPEED;
        if (track.scrollLeft >= track.scrollWidth / 2) track.scrollLeft = 0;
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * CARD_W, behavior: "smooth" });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStartX.current = e.clientX;
    dragScrollStart.current = trackRef.current?.scrollLeft ?? 0;
    e.preventDefault();
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = dragScrollStart.current - (e.clientX - dragStartX.current);
  };
  const stopDrag = () => { dragging.current = false; };

  const cardStyle: React.CSSProperties = {
    width: "clamp(220px, 20vw, 320px)",
    height: "clamp(150px, 15vw, 220px)",
    flexShrink: 0,
    position: "relative",
    overflow: "hidden",
    borderRadius: "3px",
  };

  const arrowBtn: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    background: "rgba(14,12,10,0.75)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "white",
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "22px",
    lineHeight: 1,
    backdropFilter: "blur(6px)",
    transition: "background 0.2s",
  };

  return (
    <section
      data-navtone="dark"
      style={{ background: DARK, overflow: "hidden", paddingTop: "0.5rem", paddingBottom: "0.5rem", position: "relative" }}
    >
      <button style={{ ...arrowBtn, left: "1rem" }} onClick={() => scrollBy(-1)} aria-label="Previous">‹</button>
      <button style={{ ...arrowBtn, right: "1rem" }} onClick={() => scrollBy(1)} aria-label="Next">›</button>
      <div
        ref={trackRef}
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; dragging.current = false; }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "scroll",
          scrollbarWidth: "none",
          cursor: dragging.current ? "grabbing" : "grab",
          userSelect: "none",
          paddingLeft: "0.25rem",
          paddingRight: "0.25rem",
        }}
      >
        {looped.map((item, i) => (
          <div key={i} style={cardStyle}>
            <img
              src={item.src}
              alt={item.alt}
              draggable={false}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,12,10,0.72) 0%, transparent 55%)" }} />
            <div style={{ position: "absolute", bottom: "1rem", left: "1.25rem" }}>
              <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(255,255,255,0.9)" }}>
                {item.label}
              </div>
              <div style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: ORANGE, marginTop: "2px" }}>
                {item.category}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   BRAVE BRANDS — Stone's "WE ARE FOR BRAVE BRANDS"
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   RETAILERS — scrolling logo strip
───────────────────────────────────────────── */
const W = "brightness(0) invert(1)"; // dark-on-transparent → white
const G = "grayscale(1) brightness(2)"; // complex colored bg → preserve shape
const retailerLogos = [
  { src: logoWholeFoods, alt: "Whole Foods Market", filter: W },
  { src: logoTarget, alt: "Target", filter: G },
  { src: logoWalmart, alt: "Walmart", filter: W },
  { src: logoKroger, alt: "Kroger", filter: W },
  { src: logoSprouts, alt: "Sprouts Farmers Market", filter: W },
  { src: logoAlbertsons, alt: "Albertsons", filter: W },
  { src: logoHEB, alt: "H-E-B", filter: G },
  { src: logoThrive, alt: "Thrive Market", filter: W },
];

function Retailers() {
  const logos = [...retailerLogos, ...retailerLogos];
  return (
    <section
      data-navtone="dark"
      style={{ background: DARK, borderTop: `1px solid rgba(255,255,255,0.06)`, overflow: "hidden" }}
      className="py-20"
    >
      <ScrollReveal>
        <div className="text-center mb-12">
          <span
            className="text-xs font-bold uppercase tracking-[0.25em] mb-4 block"
            style={{ color: ORANGE }}
          >
            Retailer Presence
          </span>
          <h2
            className="font-black uppercase leading-none"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: CREAM }}
          >
            On Shelf Where It Counts
          </h2>
          <p
            className="mt-4 text-sm uppercase tracking-[0.18em]"
            style={{ color: "rgba(242,234,224,0.45)" }}
          >
            We've helped our brands earn — and keep — placement at the retailers that matter.
          </p>
        </div>
      </ScrollReveal>

      <div style={{ overflow: "hidden", maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)" }}>
        <motion.div
          className="flex items-center"
          style={{ gap: "4rem", width: "max-content" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        >
          {logos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: "clamp(120px, 12vw, 180px)", height: "64px" }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  filter: logo.filter,
                  opacity: 0.6,
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section
      id="about"
      data-navtone="dark"
      className="relative py-40 overflow-hidden"
      style={{ background: DARK }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="font-black uppercase text-white leading-[0.88] tracking-tight mb-16"
          style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          We Are For<br />
          <span style={{ color: ORANGE }}>Brave Brands.</span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lg:col-span-6">
            <p className="text-white/50 text-xl leading-relaxed">
              It takes guts to launch, invest, re-think, or fight for shelf space. We meet brands in the moment — whether you're an emerging challenger or an established player — and build forward with real strategy and damn good execution.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <button
              onClick={() => openAbout()}
              className="text-sm font-bold uppercase tracking-widest inline-flex items-center gap-3 transition-opacity hover:opacity-60 cursor-pointer"
              style={{ color: ORANGE, background: "none", border: "none", borderBottom: `1px solid ${ORANGE}`, paddingBottom: "4px" }}
              data-testid="link-about-cta"
            >
              Learn About Us →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   STATS
───────────────────────────────────────────── */
function Stats() {
  return (
    <section data-navtone="light" className="py-32 border-t border-black/10" style={{ background: CREAM }}>
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="mb-20">
          <h2
            className="font-black uppercase tracking-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)" }}
          >
            Results That Move<br />
            <span style={{ color: ORANGE }}>The Needle.</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-black/10">
          {stats.map((s, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="py-12 pr-8 border-b lg:border-b-0 border-r border-black/10 last:border-r-0">
                <div
                  className="font-black leading-none mb-3"
                  style={{ fontSize: "clamp(3rem, 6vw, 6rem)", color: ORANGE }}
                >
                  {s.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-foreground/50">
                  {s.label}
                </div>
                {s.context && (
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-foreground/35">
                    {s.context}
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CASE STUDY MODAL — placeholder write-up per brand
───────────────────────────────────────────── */
function CaseStudyModal() {
  const [brand, setBrand] = useState<typeof brands[0] | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent<number>).detail;
      restoreRef.current = document.activeElement as HTMLElement | null;
      setBrand(brands[idx] ?? null);
    };
    window.addEventListener("open-case-study", handler as EventListener);
    return () => window.removeEventListener("open-case-study", handler as EventListener);
  }, []);

  const close = () => setBrand(null);

  // Focus management + scroll lock while the dialog is open.
  useEffect(() => {
    if (!brand) return;

    const getFocusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    // Move focus into the dialog on open.
    const focusTimer = window.setTimeout(() => getFocusable()[0]?.focus(), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      // Restore focus to the card that opened the dialog.
      restoreRef.current?.focus?.();
    };
  }, [brand]);

  const cs = brand?.caseStudy;
  const coverImg = brand?.bg ?? brand?.person;
  const hasNarrative = Boolean(cs?.challenge || cs?.approach || cs?.result);
  const narrativeBlocks: Array<[string, string]> = cs
    ? [
        ["Challenge", cs.challenge],
        ["Approach", cs.approach],
        ["Result", cs.result],
      ].flatMap(([title, text]) => (text ? [[title, text] as [string, string]] : []))
    : [];
  const resultsCols = (cs?.results?.length ?? 0) >= 4 ? "md:grid-cols-4" : "sm:grid-cols-3";

  return (
    <AnimatePresence>
      {brand && cs && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(14,12,10,0.78)", backdropFilter: "blur(4px)" }}
          />
          <motion.div
            ref={panelRef}
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto"
            style={{ background: CREAM }}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${brand.name} case study`}
            data-testid="modal-case-study"
          >
            {/* Header image */}
            <div className="relative h-48 md:h-60 overflow-hidden" style={{ background: DARK }}>
              {coverImg && (
                <img src={coverImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(14,12,10,0.9) 0%, rgba(14,12,10,0.3) 100%)" }}
              />
              <button
                onClick={close}
                aria-label="Close case study"
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white text-2xl leading-none rounded-full cursor-pointer"
                style={{ background: "rgba(0,0,0,0.4)", border: "none" }}
                data-testid="button-close-case-study"
              >
                ×
              </button>
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: ORANGE }}>
                  Case Study
                </span>
                <h3
                  className="text-white font-black uppercase tracking-tight leading-none mt-2"
                  style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
                >
                  {brand.name}
                </h3>
                {cs.subtitle && (
                  <p className="text-white/65 text-xs md:text-sm mt-3 max-w-lg leading-relaxed">
                    {cs.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-10">
              <p className="text-xl md:text-2xl font-bold tracking-tight leading-snug">{cs.tagline}</p>

              {/* Hero stat */}
              {cs.heroStat && (
                <div className="mt-8 p-6 md:p-8" style={{ background: DARK }}>
                  <div
                    className="font-black leading-none"
                    style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", color: ORANGE }}
                  >
                    {cs.heroStat.value}
                  </div>
                  <div className="mt-4 text-sm font-bold uppercase tracking-widest text-white">
                    {cs.heroStat.label}
                  </div>
                  {cs.heroStat.context && (
                    <div className="mt-2 text-sm text-white/55 max-w-md leading-relaxed">
                      {cs.heroStat.context}
                    </div>
                  )}
                </div>
              )}

              {/* Narrative or overview */}
              {hasNarrative ? (
                <div className="mt-8 space-y-6">
                  {narrativeBlocks.map(([title, text]) => (
                    <div key={title}>
                      <span
                        className="text-[11px] font-bold uppercase tracking-[0.25em]"
                        style={{ color: ORANGE }}
                      >
                        {title}
                      </span>
                      <p className="mt-2 text-foreground/70 leading-relaxed max-w-2xl">{text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                cs.overview && (
                  <p className="mt-5 text-foreground/60 leading-relaxed max-w-2xl">{cs.overview}</p>
                )
              )}

              {/* Scope */}
              <div className="mt-8 flex flex-wrap gap-2">
                {cs.scope.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-2 border"
                    style={{ borderColor: "rgba(14,12,10,0.2)", color: DARK }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Results */}
              {cs.results && cs.results.length > 0 && (
                <div
                  className={`mt-10 grid grid-cols-2 ${resultsCols} gap-px`}
                  style={{ background: "rgba(14,12,10,0.12)" }}
                >
                  {cs.results.map((r) => (
                    <div key={r.label} className="p-5" style={{ background: CREAM }}>
                      <div
                        className="font-black leading-none"
                        style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: ORANGE }}
                      >
                        {r.value}
                      </div>
                      <div className="mt-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground/60">
                        {r.label}
                      </div>
                      {r.context && (
                        <div className="mt-2 text-[11px] text-foreground/45 leading-snug">
                          {r.context}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Checklist (design-led case studies) */}
              {cs.checklist && (
                <div className="mt-10">
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: ORANGE }}
                  >
                    {cs.checklist.title}
                  </span>
                  <div
                    className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-px"
                    style={{ background: "rgba(14,12,10,0.12)" }}
                  >
                    {cs.checklist.items.map((item) => (
                      <div key={item.number} className="p-5" style={{ background: CREAM }}>
                        <div className="font-black text-lg" style={{ color: ORANGE }}>
                          {item.number}
                        </div>
                        <div className="mt-1 font-bold text-sm" style={{ color: DARK }}>
                          {item.title}
                        </div>
                        <div className="mt-1 text-[13px] text-foreground/55 leading-snug">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() => {
                  close();
                  openContact();
                }}
                className="mt-4 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest px-8 py-4 cursor-pointer"
                style={{ background: ORANGE, color: "#fff", border: "none" }}
                data-testid="button-case-study-cta"
              >
                Start a project →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   ABOUT MODAL — who we are / how we fly
───────────────────────────────────────────── */
const ABOUT_PILLARS = [
  {
    title: "Strategy First",
    body: "Every flight plan starts with sharp positioning — who you're for, why you win, and where to grow.",
  },
  {
    title: "Built For CPG",
    body: "We live in grocery aisles and DTC carts. We know shelf, retail media, and the metrics that actually move.",
  },
  {
    title: "Damn Good Craft",
    body: "Brand, content, performance — executed to a standard that makes challenger brands look inevitable.",
  },
];

const ABOUT_FACTS: { value: string; label: string }[] = [
  { value: "2018", label: "Wheels up" },
  { value: "40+", label: "Brands flown" },
  { value: "100%", label: "CPG focused" },
];

function AboutModal() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handler = () => {
      restoreRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener("open-about", handler);
    return () => window.removeEventListener("open-about", handler);
  }, []);

  const close = () => setOpen(false);

  // Focus management + scroll lock while the dialog is open.
  useEffect(() => {
    if (!open) return;

    const getFocusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const focusTimer = window.setTimeout(() => getFocusable()[0]?.focus(), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(14,12,10,0.78)", backdropFilter: "blur(4px)" }}
          />
          <motion.div
            ref={panelRef}
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto"
            style={{ background: CREAM }}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="About Little Pilot"
            data-testid="modal-about"
          >
            {/* Header */}
            <div className="relative p-6 md:p-10 pb-0">
              <button
                onClick={close}
                aria-label="Close about"
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-2xl leading-none rounded-full cursor-pointer"
                style={{ background: "rgba(14,12,10,0.08)", border: "none", color: DARK }}
                data-testid="button-close-about"
              >
                ×
              </button>
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: ORANGE }}
              >
                About Us
              </span>
              <h3
                className="font-black uppercase tracking-tight leading-none mt-3"
                style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", color: DARK }}
              >
                We Help Brands<br />
                <span style={{ color: ORANGE }}>Take Off.</span>
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 md:p-10 pt-6">
              <p className="text-lg md:text-xl font-bold tracking-tight leading-snug" style={{ color: DARK }}>
                Little Pilot is a CPG marketing studio for brave brands.
              </p>
              <p className="mt-5 text-foreground/60 leading-relaxed max-w-2xl">
                We're a tight crew of strategists, designers, and growth operators who pair
                big-agency craft with founder-level hustle. From first launch to national
                retail, we plot the route and fly it with you — no fluff, no hand-offs, just
                damn good marketing that earns its place on the shelf.
              </p>

              {/* Pillars */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {ABOUT_PILLARS.map((p) => (
                  <div key={p.title}>
                    <h4
                      className="text-sm font-black uppercase tracking-wide"
                      style={{ color: DARK }}
                    >
                      {p.title}
                    </h4>
                    <p className="mt-2 text-sm text-foreground/55 leading-relaxed">{p.body}</p>
                  </div>
                ))}
              </div>

              {/* Facts */}
              <div className="mt-10 grid grid-cols-3 border-t" style={{ borderColor: "rgba(14,12,10,0.12)" }}>
                {ABOUT_FACTS.map((f) => (
                  <div
                    key={f.label}
                    className="py-6 pr-4 border-r last:border-r-0"
                    style={{ borderColor: "rgba(14,12,10,0.12)" }}
                  >
                    <div
                      className="font-black leading-none"
                      style={{ fontSize: "clamp(1.6rem, 4vw, 2.75rem)", color: ORANGE }}
                    >
                      {f.value}
                    </div>
                    <div className="mt-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground/50">
                      {f.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  close();
                  openContact();
                }}
                className="mt-10 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest px-8 py-4 cursor-pointer"
                style={{ background: ORANGE, color: "#fff", border: "none" }}
                data-testid="button-about-cta"
              >
                Start a project →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   CONTACT / FOOTER — dark, cinematic
───────────────────────────────────────────── */
function Contact() {
  return (
    <section
      id="reach-out"
      data-navtone="dark"
      className="relative min-h-[90vh] flex flex-col justify-center py-40 overflow-hidden"
      style={{ background: DARK }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(249,85,0,0.15) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.3em] mb-8"
          style={{ color: ORANGE }}
        >
          Let's Work Together
        </p>

        <h2
          className="font-black uppercase text-white leading-[0.85] tracking-tight mb-12"
          style={{ fontSize: "clamp(3.5rem, 12vw, 12rem)" }}
        >
          Ready<br /><span style={{ color: ORANGE }}>To Fly?</span>
        </h2>

        <div className="flex flex-col sm:flex-row items-start gap-8">
          <motion.button
            onClick={() => openContact("message")}
            data-testid="button-contact-cta"
            className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-widest px-10 py-5 cursor-pointer"
            style={{ background: ORANGE, color: "#fff", border: "none" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Reach Out
            <motion.span
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.button>

          <a
            href="https://calendar.app.google/rCcAn6k31VuAKyTX9"
            target="_blank"
            rel="noopener noreferrer"
            className="self-center inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest px-8 py-4"
            style={{ background: "transparent", color: CREAM, border: `1px solid rgba(242,234,224,0.3)` }}
          >
            Book a Call →
          </a>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/25 uppercase tracking-widest">
        <p>© 2025 Little Pilot. All rights reserved.</p>
        <a
          href="mailto:alex@littlepilot.co"
          data-testid="link-contact-email"
          className="hover:text-white/50 transition-colors normal-case"
          style={{ textTransform: "none", letterSpacing: "normal" }}
        >
          alex@littlepilot.co
        </a>
        <p>CPG Digital Marketing Agency</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT POPUP — send a message or book a call
───────────────────────────────────────────── */
const EMPTY_FORM = { name: "", email: "", company: "", message: "", preferredTime: "" };

function ContactModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ContactMode>("message");
  const [form, setForm] = useState(EMPTY_FORM);
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ data }: { data: any }) => {
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error("Failed to submit");
    return res.json();
  };
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<ContactMode>).detail;
      restoreRef.current = document.activeElement as HTMLElement | null;
      setMode(detail === "call" ? "call" : "message");
      setOpen(true);
    };
    window.addEventListener("open-contact", onOpen);
    return () => window.removeEventListener("open-contact", onOpen);
  }, []);

  // Focus management + scroll lock while the dialog is open.
  useEffect(() => {
    if (!open) return;

    const getFocusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    // Move focus into the dialog on open.
    const focusTimer = window.setTimeout(() => getFocusable()[0]?.focus(), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      // Restore focus to the CTA that opened the dialog.
      restoreRef.current?.focus?.();
    };
  }, [open]);

  const close = () => setOpen(false);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        data: {
          type: mode,
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || undefined,
          message: form.message.trim() || undefined,
          preferredTime:
            mode === "call" ? form.preferredTime.trim() || undefined : undefined,
        },
      });
      toast({
        title: mode === "call" ? "Call request sent" : "Message sent",
        description:
          mode === "call"
            ? "We'll reach out to lock in a time. Talk soon!"
            : "Thanks for reaching out — we'll be in touch shortly.",
      });
      setForm(EMPTY_FORM);
      setOpen(false);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again, or email alex@littlepilot.co.",
        variant: "destructive",
      });
    }
  };

  const inputBase =
    "w-full bg-transparent border-b py-3 text-base outline-none transition-colors placeholder:text-white/30 focus:border-[#F95500]";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(8,7,6,0.78)", backdropFilter: "blur(6px)" }}
            onClick={close}
            data-testid="contact-backdrop"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            className="relative w-full max-w-lg overflow-hidden"
            style={{ background: DARK, border: "1px solid rgba(255,255,255,0.1)", color: CREAM }}
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            role="dialog"
            aria-modal="true"
            aria-label="Contact Little Pilot"
            data-testid="contact-modal"
          >
            <div
              className="absolute inset-x-0 top-0 h-1 pointer-events-none"
              style={{ background: ORANGE }}
            />
            <button
              onClick={close}
              aria-label="Close"
              data-testid="button-close-contact"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-xl text-white/50 hover:text-white transition-colors cursor-pointer"
              style={{ background: "none", border: "none" }}
            >
              ✕
            </button>

            <div className="p-8 md:p-10">
              <p
                className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
                style={{ color: ORANGE }}
              >
                Let's Talk
              </p>
              <h3 className="font-black uppercase leading-[0.9] tracking-tight text-3xl md:text-4xl mb-8 text-white">
                Send A Message
              </h3>

              <form onSubmit={onSubmit} className="space-y-5">
                <input
                  required
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your name *"
                  data-testid="input-name"
                  className={inputBase}
                  style={{ borderColor: "rgba(255,255,255,0.18)", color: CREAM }}
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="Email *"
                  data-testid="input-email"
                  className={inputBase}
                  style={{ borderColor: "rgba(255,255,255,0.18)", color: CREAM }}
                />
                <input
                  value={form.company}
                  onChange={set("company")}
                  placeholder="Company / Brand"
                  data-testid="input-company"
                  className={inputBase}
                  style={{ borderColor: "rgba(255,255,255,0.18)", color: CREAM }}
                />

                <textarea
                  required
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell us about your brand *"
                  rows={3}
                  data-testid="input-message"
                  className={inputBase + " resize-none"}
                  style={{ borderColor: "rgba(255,255,255,0.18)", color: CREAM }}
                />

                <motion.button
                  type="submit"
                  disabled={isPending}
                  data-testid="button-submit-contact"
                  className="w-full inline-flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest px-8 py-4 mt-2 cursor-pointer disabled:opacity-60"
                  style={{ background: ORANGE, color: "#fff", border: "none" }}
                  whileHover={{ scale: isPending ? 1 : 1.02 }}
                  whileTap={{ scale: isPending ? 1 : 0.98 }}
                >
                  {isPending
                    ? "Sending…"
                    : mode === "call"
                      ? "Request Call"
                      : "Send Message"}
                  {!isPending && <span>→</span>}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────── */
export default function Home() {
  const [navTone, setNavTone] = useState<"dark" | "light">("dark");

  // Section-aware nav: flips logo/link color based on the section
  // currently sitting behind the fixed navbar.
  useEffect(() => {
    const probeY = 40;
    let ticking = false;
    const update = () => {
      ticking = false;
      const sections = document.querySelectorAll<HTMLElement>("[data-navtone]");
      let tone: "dark" | "light" = "dark";
      for (const el of Array.from(sections)) {
        const r = el.getBoundingClientRect();
        if (r.top <= probeY && r.bottom > probeY) {
          tone = (el.dataset.navtone as "dark" | "light") ?? "dark";
          break;
        }
      }
      setNavTone(tone);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div style={{ background: DARK }}>
      <Navbar tone={navTone} />
      <Hero />
      <Intro />
      <Services />
      <Work />
      <WorkReel />
      <Retailers />
      <Statement />
      <Stats />
      <Contact />
      <ContactModal />
      <CaseStudyModal />
      <AboutModal />
    </div>
  );
}
