import React, { useRef } from 'react';
import LegoAnimation from './assets/images/animation/LegoAnimation.mp4';
import './App.css';

function Loading() {
  const videoRef = useRef();

  const setPlayBack = () => {
    videoRef.current.playbackRate = 1.5; //to speed up the lego animation video
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        className="loadingLogo"
        onCanPlay={() => setPlayBack()}
      >
        <source src={LegoAnimation} type="video/mp4" />
      </video>
    </div>
  );
}

export default Loading;
