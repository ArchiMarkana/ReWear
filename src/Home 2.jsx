import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import "./Home.css";
import banner2 from "./assets/banner2.png";
import banner3 from "./assets/banner3.png";
import banner4 from "./assets/banner4.png";

const banners = [
  { image: banner2, link: "https://example.com/page1" },
  { image: banner3, link: "https://example.com/page2" },
  { image: banner4, link: "https://example.com/page3" },
];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header />
      <div className="banner-container">
        <a
          href={banners[currentIndex].link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={banners[currentIndex].image}
            alt={`banner ${currentIndex + 1}`}
            className="banner-image"
          />
        </a>
      </div>

      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Welcome to Your E-Commerce Store</h2>
      </div>
    </div>
  );
}

export default Home;
