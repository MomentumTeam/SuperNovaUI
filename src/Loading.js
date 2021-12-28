import React, { useRef } from 'react';
import LegoAnimation from './assets/images/animation/LegoAnimation.mp4';

function Loading() {
  const videoRef = useRef();

  const setPlayBack = () => {
    videoRef.current.playbackRate = 1.5; //to speed up the lego animation video
  };

  return (
    <div>
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        autoPlay
        muted
        loop
        style={{ position: 'absolute', top: 0, left: 0 }}
        onCanPlay={() => setPlayBack()}
      >
        <source src={LegoAnimation} type="video/mp4" />
      </video>
    </div>
  );
}

export default Loading;
