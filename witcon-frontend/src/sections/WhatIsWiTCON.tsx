import Header from "../components/text/Header";
import Text from "../components/text/Text";
import witcon_group from "../assets/witcon_group.webp";
import Cute from "../stickers/Cute.png"


export default function WhatIsWiTCON() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-x-10 gap-y-8
    ">
      {/* Left column container - groups header and body text together */}
      <div className="flex flex-col gap-5 order-1 md:order-none text-center md:text-left">
        <Header>What is WiTCON?</Header>
        <div className="hidden md:flex md:flex-col md:gap-5">
          <Text>
            WiTCON is the signature Women in Technology Conference at Florida
            International University!
          </Text>
          <Text>
            Join us for a full-day of learning, networking, and empowerment of
            underrepresented local talent in tech. The event is scheduled for
            March 27th, 2026, and will be held at the Graham Center Ballrooms at
            FIU Modesto Maidique Campus from 9AM - 9PM.
          </Text>
        </div>
      </div>

      {/* Image - order 2 on mobile */}
      <div className="order-2 md:order-none w-full comic-image-left comic-image-pop-left">
        <img
          className="w-full h-auto object-cover"
          src={witcon_group}
          alt="WiTCON 2025 volunteer crew"
        />

        <img 
            src ={Cute}
            alt = 'Bam'
            className = 'absolute -top-6 -left-6 w-15 h-15 lg:w-25 lg:h-25 lg:-top-10 lg:-left-10 pointer-events-none'
          />

          
      </div>

      {/* Body text - order 3 on mobile, hidden on desktop */}
      <div className="flex flex-col gap-5 order-3 md:hidden">
        <Text>
          WiTCON is the signature Women in Technology Conference at Florida
          International University!
        </Text>
        <Text>
          Join us for a full-day of learning, networking, and empowerment of
          underrepresented local talent in tech. The event is scheduled for
          March 27th, 2026, and will be held at the Graham Center Ballrooms at
          FIU Modesto Maidique Campus from 9AM - 8PM.
        </Text>
      </div>
    </section>
  );
}