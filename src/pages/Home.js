import { useState, useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import Exercises from "../components/Exercises";
import Carousel from "../components/Carousel";
import HomeBanner from "../components/HomeBanner";
import SectionCards from "../components/SectionCards";
import StatsSection from "../components/StatsSection";
import FeaturesSection from "../components/FeaturesSection";
import { errorPopUp } from "../helpers/errorPopUp";
import { fetchCarouselDataHome } from "../api/exerciseApi";

export default function Home() {
  const [carouselData, setCarouselData] = useState([]);
  const [searchByCarousel, setSearchByCarousel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getCarouselHomeData = async () => {
    try {
      const data = await fetchCarouselDataHome();
      setCarouselData(data);
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (errorMessage.length > 0) {
      errorPopUp(errorMessage);
      setErrorMessage("");
    }
  }, [errorMessage]);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 700,
      easing: "ease-in-out",
      delay: 100,
    });
    getCarouselHomeData();
  }, []);

  return (
    <div className="home-container">
      <HomeBanner />
      <StatsSection />
      <FeaturesSection />
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
    </div>
  );
}

