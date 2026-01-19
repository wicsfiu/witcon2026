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

      <section id="timer" className="scroll-mt-24 -mt-10">
        <Timer />
      </section>

      <section id="about" className="scroll-mt-24 -mt-6 pb-2">
        <WhatIsWiTCON />
      </section>

      <section id="carousel" className="scroll-mt-24 -my-7">
        <Carousel />
      </section>

      <section id="testimonials" className="scroll-mt-24 py-10 -mt-4">
        <Testimonials />
      </section>

      <section id="teams" className="scroll-mt-24 pt-5">
        <Teams />
      </section>

      <section id="faq" className="scroll-mt-24 -mt-10">
        <Faq />
      </section>
    </div>
  );
}
