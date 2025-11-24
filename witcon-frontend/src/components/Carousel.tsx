import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";

import { EffectCoverflow, Autoplay } from "swiper/modules";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";
import slide4 from "../assets/slide4.jpg";
import slide5 from "../assets/slide5.jpg";
import slide6 from "../assets/slide6.jpg";
import slide7 from "../assets/slide7.jpg";

const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];

export default function Carousel() {
  return (
    <div className="w-full mx-auto pt-[10%]">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={2}
        slideToClickedSlide={true}
        loop={true}
        speed={10000}
        autoplay={{
          delay: 500,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 40,
          depth: 200,
          scale: 0.85,
          modifier: 1,
          slideShadows: false,
        }}
        modules={[EffectCoverflow, Autoplay]}
        className="w-full max-w-full h-[30vh] lg:h-[80%]"
      >
        {slides.map((image, index) => (
          <SwiperSlide key={index} className="overflow-hidden rounded-[10%]">
            <img 
              src={image} 
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}