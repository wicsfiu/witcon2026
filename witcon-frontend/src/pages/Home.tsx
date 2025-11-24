import Hero from '../sections/Hero';
import Timer from '../components/Timer';
import WhatIsWiTCON from '../sections/WhatIsWiTCON';
import Testimonials from './Testimonials';
import Teams from './teams';
import Carousel from '../components/Carousel';

export default function Home() {
    return (
        <>
        <Hero />
        <Timer />
        <WhatIsWiTCON/>
        <Carousel />
        <Testimonials />
        <Teams />
        </>
    )
  }