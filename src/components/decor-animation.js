import Lottie from 'react-lottie';
import animationData from "../assets/images/lottie/cactus.json";

const DecorAnimation = () => {
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
            <Lottie options={defaultOptions} />
        </div>
    );
}

export default DecorAnimation;