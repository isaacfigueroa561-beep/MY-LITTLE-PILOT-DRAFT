import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";

import { useCreateContactSubmission } from "@workspace/api-client-react";
import { toast } from "@/hooks/use-toast";

import logoOrangePath from "@assets/lp-logo-red.png";
import heroImg from "@assets/stock/hero-food.jpg";
import heroVid1 from "@assets/generated_videos/cpg-fresh-food.mp4";
import heroVid2 from "@assets/generated_videos/cpg-beverage-pour.mp4";
import heroVid3 from "@assets/generated_videos/cpg-product-flatlay.mp4";
import tazaBg from "@assets/stock/work/taza-bg.webp";
import tazaLogo from "@assets/stock/work/taza-logo.webp";
import grandyBg from "@assets/stock/work/grandy-bg.webp";
import grandyLogo from "@assets/stock/work/grandy-logo.webp";
import cappellosBg from "@assets/stock/work/cappellos-bg.webp";
import cappellosLogo from "@assets/stock/work/cappellos-logo.webp";
import lesserevilBg from "@assets/stock/work/lesserevil-bg.webp";
import lesserevilLogo from "@assets/stock/work/lesserevil-logo.webp";
import reuzelPerson from "@assets/stock/work/reuzel-person.webp";

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
const brands = [
  {
    name: "Taza Chocolate",
    category: "Packaging Design · Content Creation",
    bg: tazaBg,
    logo: tazaLogo,
    span: "full",
    caseStudy: {
      tagline: "Bean-to-bar storytelling that sells the craft.",
      overview:
        "We partnered with Taza to translate their stone-ground, organic ethos into packaging and content that pops on shelf and in feed — a cohesive visual system that makes the craft impossible to scroll past.",
      scope: ["Packaging Design", "Content Creation", "Art Direction"],
      results: [
        { value: "+38%", label: "Shelf Conversion" },
        { value: "2.4M", label: "Content Impressions" },
        { value: "12", label: "SKUs Refreshed" },
      ],
    },
  },
  {
    name: "Reuzel",
    category: "Ecommerce Overhaul · Campaigns",
    variant: "reuzel",
    person: reuzelPerson,
    caseStudy: {
      tagline: "A grooming icon, rebuilt for the cart.",
      overview:
        "Reuzel's brand had swagger — their store didn't keep up. We overhauled the ecommerce experience and ran campaigns that matched the attitude, turning browsers into loyal regulars.",
      scope: ["Ecommerce Overhaul", "Paid Campaigns", "CRO"],
      results: [
        { value: "+52%", label: "Online Revenue" },
        { value: "3.1×", label: "ROAS" },
        { value: "-19%", label: "Bounce Rate" },
      ],
    },
  },
  {
    name: "Grandy Organics",
    category: "Content Creation · Email",
    bg: grandyBg,
    logo: grandyLogo,
    caseStudy: {
      tagline: "Wholesome made craveable.",
      overview:
        "We helped Grandy Organics show up like the small-batch favorite it is — with content and email that feel personal, warm, and impossible to unsubscribe from.",
      scope: ["Content Creation", "Email & SMS", "Social"],
      results: [
        { value: "+44%", label: "Email Revenue" },
        { value: "11.3K", label: "New Subscribers" },
        { value: "27%", label: "Avg. Open Rate" },
      ],
    },
  },
  {
    name: "Cappello's",
    category: "Social · Paid Ads",
    bg: cappellosBg,
    logo: cappellosLogo,
    caseStudy: {
      tagline: "Grain-free, guilt-free, scroll-stopping.",
      overview:
        "Cappello's needed paid social that performed as well as their product tastes. We built a creative testing engine and a paid funnel that scaled spend without sacrificing efficiency.",
      scope: ["Paid Social", "Creative Testing", "Performance"],
      results: [
        { value: "4×", label: "ROAS" },
        { value: "+61%", label: "Add-to-Cart" },
        { value: "-23%", label: "CPA" },
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

const stats = [
  { value: "11.3K", label: "Social Engagements" },
  { value: "4×", label: "ROAS on Paid Ads" },
  { value: "60+", label: "Brands Served" },
  { value: "$2M+", label: "Ad Spend Managed" },
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
   HERO — full-bleed image, orange floods in on scroll
   Stone-style: cinematic photo bg, content centered,
   orange overlay wipes over the image as you scroll.
───────────────────────────────────────────── */
const heroClips = [heroVid1, heroVid2, heroVid3];

/* Cross-fading looping video background. Each clip plays muted,
   advances to the next when it ends — Stone-style "videos changing". */
function VideoBackdrop() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState<Record<number, boolean>>({});
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  // Drive playback imperatively so each clip starts when it becomes active.
  useEffect(() => {
    if (reduce) return;
    const v = refs.current[active];
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, [active, reduce]);

  // Reduced motion: hold a single still frame, no autoplay.
  if (reduce) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <img src={heroImg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Poster — shown until the active clip is actually playing (graceful
          fallback when autoplay is blocked or the clip is still buffering). */}
      <img src={heroImg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
      {heroClips.map((src, i) => (
        <motion.video
          key={src}
          ref={(el) => { refs.current[i] = el; }}
          src={src}
          autoPlay={i === 0}
          muted
          playsInline
          preload={i === 0 ? "auto" : "metadata"}
          onPlaying={() => setReady((r) => (r[i] ? r : { ...r, [i]: true }))}
          onEnded={() => setActive((p) => (p + 1) % heroClips.length)}
          className="absolute inset-0 w-full h-full object-cover"
          initial={false}
          animate={{ opacity: i === active && ready[i] ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      ))}
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

  // Scroll-linked hero logo: white → orange, grows larger, then disappears
  const logoScale = useTransform(scrollYProgress, [0, 0.6], [1, 2.3]);
  const logoGroupOpacity = useTransform(scrollYProgress, [0.45, 0.72], [1, 0]);
  const logoWhiteOpacity = useTransform(scrollYProgress, [0.05, 0.28], [1, 0]);
  const logoOrangeOpacity = useTransform(scrollYProgress, [0.12, 0.32], [0, 1]);

  return (
    <section
      ref={ref}
      data-navtone="dark"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: DARK }}
    >
      {/* Video backdrop with parallax */}
      <motion.div className="absolute inset-0" style={{ y: layerY }}>
        <VideoBackdrop />
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* white state */}
            <motion.img
              src={logoOrangePath}
              alt="Little Pilot"
              className="w-full object-contain"
              style={{
                filter: "brightness(0) invert(1) drop-shadow(0 6px 34px rgba(0,0,0,0.55))",
                opacity: logoWhiteOpacity,
              }}
            />
            {/* orange state — cross-fades in on scroll */}
            <motion.img
              src={logoOrangePath}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full object-contain"
              style={{
                filter: "drop-shadow(0 6px 34px rgba(0,0,0,0.45))",
                opacity: logoOrangeOpacity,
              }}
            />
          </motion.div>
        </motion.div>

        {/* Tagline + subtext — clearly below the wordmark */}
        <motion.div
          className="flex flex-col items-center mt-10 md:mt-14"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {/* Tagline */}
          <div className="overflow-hidden">
            <motion.h1
              className="text-white text-xl md:text-2xl font-normal tracking-[0.35em] uppercase"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Damn Good Digital Marketing
            </motion.h1>
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
            CPG Digital Marketing Agency
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo("intro")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40 hover:text-white/70 transition-colors z-10 cursor-pointer"
        style={{ background: "none", border: "none" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <span className="text-[9px] uppercase tracking-[0.35em]">Scroll Down</span>
        <motion.div
          className="w-px h-12 origin-top bg-white/40"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.button>
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
            We help great CPG brands grow online and in-store. From Instacart to Instagram — we know where your customer is, and we know how to reach them.
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
   BRAVE BRANDS — Stone's "WE ARE FOR BRAVE BRANDS"
───────────────────────────────────────────── */
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
  const coverImg = brand ? (brand as { bg?: string; person?: string }).bg ?? (brand as { bg?: string; person?: string }).person : undefined;

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
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-10">
              <p className="text-xl md:text-2xl font-bold tracking-tight leading-snug">{cs.tagline}</p>
              <p className="mt-5 text-foreground/60 leading-relaxed max-w-2xl">{cs.overview}</p>

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
              <div className="mt-10 grid grid-cols-3 border-t" style={{ borderColor: "rgba(14,12,10,0.12)" }}>
                {cs.results.map((r) => (
                  <div
                    key={r.label}
                    className="py-6 pr-4 border-r last:border-r-0"
                    style={{ borderColor: "rgba(14,12,10,0.12)" }}
                  >
                    <div
                      className="font-black leading-none"
                      style={{ fontSize: "clamp(1.6rem, 4vw, 2.75rem)", color: ORANGE }}
                    >
                      {r.value}
                    </div>
                    <div className="mt-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground/50">
                      {r.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Placeholder note + CTA */}
              <p className="mt-8 text-xs uppercase tracking-widest text-foreground/40">
                Placeholder case study — full write-up coming soon.
              </p>
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
            href="mailto:hello@littlepilot.co"
            className="self-center text-white/40 hover:text-white/70 transition-colors text-sm tracking-wide"
            data-testid="link-contact-email"
          >
            hello@littlepilot.co
          </a>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/25 uppercase tracking-widest">
        <p>© 2025 Little Pilot. All rights reserved.</p>
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
  const { mutateAsync, isPending } = useCreateContactSubmission();
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
        description: "Please try again, or email hello@littlepilot.co.",
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
              <h3 className="font-black uppercase leading-[0.9] tracking-tight text-3xl md:text-4xl mb-6 text-white">
                {mode === "call" ? "Book A Call" : "Send A Message"}
              </h3>

              {/* Mode toggle */}
              <div className="flex gap-1 p-1 mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
                {(["message", "call"] as ContactMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    data-testid={`tab-${m}`}
                    className="flex-1 text-xs font-bold uppercase tracking-widest py-2.5 transition-colors cursor-pointer"
                    style={{
                      background: mode === m ? ORANGE : "transparent",
                      color: mode === m ? "#fff" : "rgba(255,255,255,0.55)",
                      border: "none",
                    }}
                  >
                    {m === "message" ? "Send a Message" : "Book a Call"}
                  </button>
                ))}
              </div>

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

                {mode === "call" ? (
                  <input
                    required
                    value={form.preferredTime}
                    onChange={set("preferredTime")}
                    placeholder="Preferred day / time *"
                    data-testid="input-preferred-time"
                    className={inputBase}
                    style={{ borderColor: "rgba(255,255,255,0.18)", color: CREAM }}
                  />
                ) : (
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
                )}

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
      <Work />
      <Statement />
      <Stats />
      <Contact />
      <ContactModal />
      <CaseStudyModal />
      <AboutModal />
    </div>
  );
}
