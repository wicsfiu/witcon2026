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
      <Hero />
      <Timer />
      <WhatIsWiTCON />
      <Carousel />
      <Testimonials />
      <Teams />
      <Faq />
    </div>
  );
}
