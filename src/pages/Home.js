import { useState, useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import Exercises from "../components/Exercises";
import Carousel from "../components/Carousel";
import HomeBanner from "../components/HomeBanner";
import SectionCards from "../components/SectionCards";

import axios from "axios";

export default function Home() {
  const [carouselData, setCarouselData] = useState([]);
  const [searchByCarousel, setSearchByCarousel] = useState("");

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 700,
      easing: "ease-in-out",
      delay: 100,
    });

    const getCarouselHomeData = async () => {
      await axios
        .get("http://localhost:9000/fetchCarouselDataHome")
        .then((res) => setCarouselData(res.data))
        .catch((err) => console.log(err.message));
    };

    getCarouselHomeData();
  }, []);

  return (
    <>
      <HomeBanner />
      <SectionCards />
      <Carousel
        id="exercise-carousel"
        setSearchByCarousel={setSearchByCarousel}
        carouselData={carouselData}
        carouselTitle="BODY PARTS"
      />
      <Exercises
        searchByCarousel={searchByCarousel}
        setSearchByCarousel={setSearchByCarousel}
      />
    </>
  );
}
