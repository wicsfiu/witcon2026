import Hero from "../sections/Hero";
import Timer from "../components/Timer";
import WhatIsWiTCON from "../sections/WhatIsWiTCON";
import Testimonials from "../sections/Testimonials";
import Teams from "../sections/teams";
import Carousel from "../components/Carousel";
import Faq from "../sections/Faq";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-40">
      <section id="hero" className="scroll-mt-24">
        <Hero />
      </section>

      <section id="timer" className="scroll-mt-24 -mt-8">
        <Timer />
      </section>

      <section id="about" className="scroll-mt-24">
        <WhatIsWiTCON />
      </section>

      <section id="carousel" className="scroll-mt-24">
        <Carousel />
      </section>

      <section id="testimonials" className="scroll-mt-24 pb-12">
        <Testimonials />
      </section>

      <section id="teams" className="scroll-mt-24">
        <Teams />
      </section>

      <section id="faq" className="scroll-mt-24">
        <Faq />
      </section>
    </div>
  );
}
