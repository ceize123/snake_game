import Webcam from "react-webcam";
import { useState, useRef, useEffect } from "react";

const WebcamCapture = (prop) => {
    const { isMulti } = prop;
    const webcamRef = useRef(null);
    const webcamBlock = useRef(null);
    const [style, setStyle] = useState();
    const [style2, setStyle2] = useState();


    useEffect(() => {
        // let centerX = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 2)
        // let centerY = webcamBlock.current.offsetTop + (webcamBlock.current.offsetHeight / 2)
        // setStyle({
        //     left: centerX,
        //     top: centerY
        // })
        if (isMulti) {
            let centerX = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 4)
            // Impossible to detect center Y of the webcam in the screen
            let centerY = webcamBlock.current.offsetTop + (360 * 300 / window.innerHeight) // 360 = webcam height
            setStyle({
                left: centerX,
                top: centerY
            })
            let centerX2 = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 4 * 3)
            let centerY2 = webcamBlock.current.offsetTop + (360 * 300 / window.innerHeight) // 360 = webcam height
            setStyle2({
                left: centerX2,
                top: centerY2
            })
        } else { // single player
            let centerX = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 2)
            // Impossible to detect center Y of the webcam in the screen
            let centerY = webcamBlock.current.offsetTop + (360 * 300 / window.innerHeight) // 360 = webcam height
            setStyle({
                left: centerX,
                top: centerY
            })
        }
        // console.log(isMulti);
        // console.log(webcamBlock);
        
    }, [isMulti])
    


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
        {isMulti &&
        <div
            className="dot"
            style={style2}
        ></div>  
        }  
    </div>
  );
};

export default WebcamCapture;