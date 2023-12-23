import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination, Navigation } from "swiper";

const Carousel = ({ carouselData, setSearchByCarousel, carouselTitle }) => {
  const handleCarouselClick = (value) => {
    setSearchByCarousel(value);
  };

  return (
    <div className="exercises-carousel-container">
      <h1 className="carousel-title">{carouselTitle}</h1>
      {carouselData?.length > 0 && (
        <Swiper
          data-aos="fade-in"
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          slideToClickedSlide={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 5,
            // scale: 1,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            clickable: "true",
            dynamicBullets: "true",
          }}
          navigation={true}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="mySwiper"
        >
          {carouselData?.map((data, index) => {
            return (
              <SwiperSlide
                onClick={() => handleCarouselClick(data?.part)}
                key={index}
              >
                <h3 className="carousel-slide-text">{data?.part}</h3>
                <img className="slider-img" alt="slider-img" src={data?.url} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default Carousel;
