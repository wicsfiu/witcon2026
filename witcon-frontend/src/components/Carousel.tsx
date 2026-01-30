import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";

import { EffectCoverflow, Autoplay } from "swiper/modules";

import slide1 from "../assets/slide1.webp";
import slide2 from "../assets/slide2.webp";
import slide3 from "../assets/slide3.webp";
import slide4 from "../assets/slide4.webp";
import slide5 from "../assets/slide5.webp";
import slide6 from "../assets/slide6.webp";
import slide7 from "../assets/slide7.webp";

const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];

export default function Carousel() {
  return (
    <div className="w-full mx-auto">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slideToClickedSlide={true}
        loop={true}
        speed={800}
        autoplay={{
          delay: 2000,
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
        breakpoints={{
          0: { slidesPerView: 1.1 },
          640: { slidesPerView: 1.3 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
        }}
      >
        {slides.map((image, index) => (
          <SwiperSlide key={index} className="overflow-hidden comic-imager">
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