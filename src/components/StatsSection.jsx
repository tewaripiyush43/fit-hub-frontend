import React, { useEffect, useRef, useState } from "react";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import NoteAltIcon from "@mui/icons-material/NoteAlt";

const stats = [
  { icon: <FitnessCenterIcon className="stat-icon" />, target: 1300, suffix: "+", label: "Exercises" },
  { icon: <RestaurantIcon className="stat-icon" />, target: 500, suffix: "+", label: "Recipes" },
  { icon: <NoteAltIcon className="stat-icon" />, target: 10, suffix: "K+", label: "Workouts Created" },
  { icon: <AutoAwesomeIcon className="stat-icon" />, target: 24, suffix: "/7", label: "AI Trainer" },
];

const useCountUp = (target, duration = 1800, active) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);

  return count;
};

const StatItem = ({ icon, target, suffix, label, active }) => {
  const count = useCountUp(target, 1600, active);
  return (
    <div className="stat-item" data-aos="fade-up">
      <div className="stat-icon-wrapper">{icon}</div>
      <div className="stat-number">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-inner">
        <p className="stats-eyebrow">BY THE NUMBERS</p>
        <h2 className="stats-heading">Everything you need to <span>transform</span></h2>
        <div className="stats-grid">
          {stats.map((s, i) => (
            <StatItem key={i} {...s} active={visible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
