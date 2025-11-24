import Hero from '../sections/Hero';
import Timer from '../components/Timer';
import WhatIsWiTCON from '../sections/WhatIsWiTCON';
import Testimonials from './Testimonials';
import Teams from './teams';

export default function Home() {
    return (
        <>
        <Hero />
        <Timer />
        <WhatIsWiTCON/>
        <Testimonials />
        <Teams />
        
        </>
    )
  }