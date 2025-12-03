import Hero from '../sections/Hero';
import Timer from '../components/Timer';
import WhatIsWiTCON from '../sections/WhatIsWiTCON';
import Testimonials from '../sections/Testimonials';
import Teams from '../sections/teams';
import Carousel from '../components/Carousel';
import Faq from '../sections/Faq';

export default function Home() {
    return (
        <>
        <Hero />
        <Timer />
        <WhatIsWiTCON/>
        <Carousel />
        <Testimonials />
        <Faq />
        <Teams />
        </>
    )
  }