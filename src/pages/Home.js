import { useState, useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import Exercises from "../components/Exercises";
import Carousel from "../components/Carousel";
import HomeBanner from "../components/HomeBanner";
import SectionCards from "../components/SectionCards";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store";

export default function Home() {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // console.log(isLoggedIn);
  const [carouselData, setCarouselData] = useState([]);
  const [searchByCarousel, setSearchByCarousel] = useState("");
  // const [user, setUser] = useState("");

  // const [firstRender, setFirstRender] = useState(true);

  const refreshToken = async () => {
    await axios
      .post(`${REACT_APP_BASE_URL}/auth/refreshToken`, {
        withCredentials: true,
      })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        sendRequestToGetUser();
      })
      .catch((err) => console.log(err));
  };

  const sendRequestToGetUser = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}/auth/private`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.data.error?.status === 401) {
        } else {
          // if(res.data.error?.error.status === 401){}
          dispatch(authActions.setUser(res.data.user));
          dispatch(authActions.login());
        }
      })
      .catch((err) => {
        console.log(err);
        refreshToken();
      });
  };

  useEffect(() => {
    if (isLoggedIn && !user?.email) {
      sendRequestToGetUser();
    }
  }, [isLoggedIn]);

  const getCarouselHomeData = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}/exercise/fetchCarouselDataHome`)
      .then((res) => setCarouselData(res.data))
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 700,
      easing: "ease-in-out",
      delay: 100,
    });

    getCarouselHomeData();
    sendRequestToGetUser();

    // if (firstRender) {
    //   setFirstRender(false);
    //   sendRequest();
    // }
    // let interval = setInterval(() => {
    //   refreshToken().then((data) => setUser(data?.user));
    // }, 1000 * 29);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div>
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
    </div>
  );
}
