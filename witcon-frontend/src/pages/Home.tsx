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
      <section id="hero">
        <Hero />
      </section>

      <section id="timer">
        <Timer />
      </section>

      <section id="about">
        <WhatIsWiTCON />
      </section>

      <section id="carousel">
        <Carousel />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="teams">
        <Teams />
      </section>

      <section id="faq">
        <Faq />
      </section>
    </div>
  );
}

