import Webcam from "react-webcam";
import { useState, useRef, useEffect } from "react";

const WebcamCapture = () => {
    const webcamRef = useRef(null);
    const webcamBlock = useRef(null);
    const [style, setStyle] = useState();


    useEffect(() => {
        let centerX = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 2)
        let centerY = webcamBlock.current.offsetTop + (webcamBlock.current.offsetHeight / 2)
        console.log(webcamBlock)
        setStyle({
            left: centerX,
            top: centerY
        })
    }, [])
    


  return (
    <div className="webcam" ref={webcamBlock}>
    
        <Webcam
        audio={false}
        ref={webcamRef}
        height={360}
        width={640}
        mirrored={true}
        />
        <div
            className="dot"
            style={style}
        ></div>  
    </div>
  );
};

export default WebcamCapture;