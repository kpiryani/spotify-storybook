// src/App.jsx
import { useState, useEffect, useRef } from "react";
import Timeline from "./components/Timeline";
import FileUpload from "./components/FileUpload";
import AllTracks from "./components/AllTracks";
import { normalizeTracks, analyzeGenres, topNGenres } from "./utils/analyzer";
import { buildActs } from "./utils/storyteller";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import { TextPlugin } from "gsap/TextPlugin";
import "./App.css";


export default function App() {
  const [playlistData, setPlaylistData] = useState(null);
  const [acts, setActs] = useState(null);

  const scrollerRef = useRef(null);
  const titleRef = useRef(null);


  // --- NEW: animate act boxes on scroll ---
  const animateActBoxes = () => {
    const boxes = document.querySelectorAll(".act-box");

    boxes.forEach((box) => {
      gsap.fromTo(
        box,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: box,
            scroller: ".container",
            start: "top 90%",        // starts when bottom gets close
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  };

  useEffect(() => {
    if (!playlistData) return;
    if (scrollerRef.current) return;

    gsap.registerPlugin(ScrollTrigger, TextPlugin);


    const scrollContainer = document.querySelector(".container");
    if (!scrollContainer) {
      console.warn("Locomotive: .container not found - skipping scroller init");
      return;
    }

    const scroller = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
    });

    scrollerRef.current = scroller;

    scroller.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(".container", {
      scrollTop(value) {
        if (arguments.length) {
          scroller.scrollTo(value, { duration: 0, disableLerp: true });
          return;
        }
        return scroller.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          left: 0,
          top: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: scrollContainer.style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => scroller.update());
    ScrollTrigger.refresh();

    return () => {
      if (scrollerRef.current) {
        scrollerRef.current.destroy();
        scrollerRef.current = null;
      }
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [playlistData]);

  useEffect(() => {
    if (!titleRef.current) return;
  
    // Use default text if no playlist yet
    const playlistName = playlistData?.playlist_name || "Spotify Playlist Story";
  
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
  
    tl.to(titleRef.current, {
      duration: playlistName.length * 0.15, // ~0.15s per character
      text: playlistName,
      ease: "none"
    })
    .to({}, { duration: 5 }) // hold for 5 seconds
    .to(titleRef.current, {
      duration: playlistName.length * 0.08,
      text: "",
      ease: "none"
    })
    .to({}, { duration: 0.5 }); // short pause before repeating
  }, [playlistData]);
  
  

  const handleFileUpload = (jsonData) => {
    try {
      if (!jsonData.playlist_name || !jsonData.tracks || !Array.isArray(jsonData.tracks)) {
        alert("Invalid playlist JSON. Expected 'playlist_name' and 'tracks' array.");
        return;
      }

      const normalizedTracks = normalizeTracks(jsonData.tracks);
      const { genreCounts, genrePositions } = analyzeGenres(normalizedTracks);
      const topGenres = topNGenres(genreCounts, 3);
      const generatedActs = buildActs(normalizedTracks, topGenres, genrePositions);

      setPlaylistData(jsonData);
      setActs(generatedActs);

      setTimeout(() => {
        ScrollTrigger.refresh();
        animateActBoxes(); // <-- NEW animation call
      }, 80);
    } catch (error) {
      alert("Error processing playlist: " + error.message);
      console.error("Processing error:", error);
    }
  };

  return (
    <div className="wrapper">        {/* <-- animated background */}
      <div className="container">    {/* <-- locomotive scroll area */}
        <div className="app">
        <div className="upload-container">
        <h1 className="title" ref={titleRef}>Spotify Playlist Story</h1>
        <p className="subtitle">Upload your playlist JSON to see its narrative</p>
        <FileUpload onFileUpload={handleFileUpload} />
      </div>

        </div>
      </div>
    </div>
  );
  
}
