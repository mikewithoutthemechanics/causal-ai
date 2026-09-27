import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, initGlobalMotion } from "./lib/motion";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Illusion from "./components/Illusion";
import Manifesto from "./components/Manifesto";
import Ladder from "./components/Ladder";
import Spells from "./components/Spells";
import Proof from "./components/Proof";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Reading from "./components/Reading";
import Footer from "./components/Footer";
import { Atmosphere, Cursor, ProgressRail } from "./components/Chrome";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      try {
        initGlobalMotion(document);
      } catch (error) {
        // Never let an animation failure hide the page.
        console.error("[wizard] motion init failed, revealing content", error);
        document
          .querySelectorAll<HTMLElement>("[data-reveal], [data-spell-inner], [data-step]")
          .forEach((el) => {
            el.style.opacity = "";
            el.style.visibility = "";
            el.style.transform = "";
          });
      }

      // Layout settles once webfonts land and on every resize.
      const refresh = () => ScrollTrigger.refresh();
      const fontTimer = window.setTimeout(refresh, 400);
      document.fonts?.ready.then(refresh).catch(() => undefined);
      window.addEventListener("load", refresh);

      return () => {
        window.clearTimeout(fontTimer);
        window.removeEventListener("load", refresh);
      };
    },
    { scope: appRef },
  );

  return (
    <div ref={appRef} className="relative min-h-screen bg-ink">
      <a
        href="#illusion"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:rounded-full focus:bg-ember focus:px-5 focus:py-3 focus:text-[13px] focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <Nav />
      <Atmosphere />
      <Cursor />
      <ProgressRail />

      <main>
        <Hero />
        <Ticker />
        <Illusion />
        <Manifesto />
        <Ladder />
        <Spells />
        <Proof />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Reading />
      </main>

      <Footer />
    </div>
  );
}
