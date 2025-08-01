"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [step, setStep] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showClickToStart, setShowClickToStart] = useState(true);
  const [showFlash, setShowFlash] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (video) {
      video.currentTime = 0;
      video.pause();
      
      video.onloadeddata = () => {
        console.log("Video loaded, duration:", video.duration);
        setVideoLoaded(true);
      };
      
      video.onerror = (e) => {
        console.error("Video error:", e);
      };

      video.onended = () => {
        handleLogoDisplay();
      };
      
      video.onplay = () => setIsPlaying(true);
      video.onpause = () => setIsPlaying(false);
    }
    
    const handleLogoDisplay = () => {
      setShowFlash(true);
      
      setTimeout(() => {
        setShowFlash(false);
        setShowLogo(true);
      }, 500);
    };
    
    return () => {
      if (video) {
        video.pause();
        video.src = "";
      }
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);
  
  const playWithAudio = (videoTime: number, audioTime: number) => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video || !audio) return;
    
    video.currentTime = videoTime;
    audio.currentTime = audioTime;
    
    audio.play().catch(err => console.error("Audio playback error:", err));
    video.play().catch(err => console.error("Video playback error:", err));
  };
  
  const handleTimedStop = (timeInMs: number, nextStep: number) => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video) return;
    
    setTimeout(() => {
      video.pause();
      if (audio) audio.pause();
      setStep(nextStep);
    }, timeInMs);
  };
  
  const handleClick = () => {
    if (showLogo) {
      resetAnimation();
      return;
    }
    
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video || !videoLoaded || isPlaying || !audio) return;
    
    console.log("Current step:", step);
    setShowClickToStart(false);
    
    switch (step) {
      case 0:
        playWithAudio(0, 0);
        handleTimedStop(1050, 1);
        break;
        
      case 1:
        playWithAudio(1.05, 1.05);
        handleTimedStop(700, 2);
        break;
        
      case 2:
        playWithAudio(1.75, 1.75);
        handleTimedStop(800, 3);
        break;
        
      case 3:
        playWithAudio(2.55, 2.55);
        handleTimedStop(1200, 4);
        break;
        
      case 4:
        playWithAudio(3.70, 3.70);
        
        setTimeout(() => {
          setShowFlash(true);
          
          setTimeout(() => {
            setShowFlash(false);
            setShowLogo(true);
            video.pause();
            audio.pause();
          }, 500);
        }, 300);
        break;
    }
  };
  
  const resetAnimation = () => {
    setShowLogo(false);
    setShowFlash(false);
    setStep(0);
    setShowClickToStart(true);
    setIsPlaying(false);
    
    const video = videoRef.current;
    if (video) {
      video.style.display = "block";
      video.currentTime = 0;
      video.pause();
    }
    
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen bg-black cursor-pointer overflow-hidden" 
      onClick={handleClick}
    >
      <video 
        ref={videoRef}
        className="w-full h-full object-cover absolute inset-0"
        src="/rdr2-intro.mp4"
        playsInline
        preload="auto"
        muted
      >
        Your browser does not support video playback.
      </video>
      
      <audio 
        ref={audioRef}
        src="/cont.mp3"
        preload="auto"
      />
      
      {showClickToStart && videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-white text-3xl md:text-5xl font-bold animate-fadeIn animate-textShadowPulse">
            trust me, just click when it stops
          </div>
        </div>
      )}

      {!showClickToStart && !showLogo && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-64 md:w-80 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {showFlash && (
        <div className="absolute inset-0 bg-white z-30 animate-flash"></div>
      )}

      {showLogo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black">
          <div className="animate-fadeInSlow text-center">
          {/*
            <img
              src="/nexus.svg" 
              alt="Nexsu Logo" 
              className="w-[250px] md:w-[400px] h-auto invert object-contain mx-auto"
              onError={(e) => {
                console.error("Logo loading error");
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            */}
            <h1 className="text-white text-4xl md:text-6xl font-bold mt-8 animate-pulse animate-textShadowPulse">
              NEXSU
            </h1>
            <p className="text-white text-sm md:text-base mt-4 opacity-70">
              i said you can trust me, click to restart
            </p>

            <p className="text-white text-xs mt-4 opacity-50">
              © 2025 NEXSU • All Rights Reserved
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
