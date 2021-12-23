import React from 'react';
import Lottie from 'react-lottie';
import animationData from "../assets/images/lottie/cactus.json";

class DecorAnimation extends React.Component {



    render() {

        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid slice"
            }
        };
        return (
            <div className="decor-animation">
                <Lottie options={defaultOptions} width="90"/>
            </div>
        );

    }
}



export default DecorAnimation
