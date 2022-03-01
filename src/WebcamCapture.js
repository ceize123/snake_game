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
        // console.log(webcamBlock.current.offsetTop);
        // console.log(2);
        // console.log(webcamBlock.current.offsetHeight);
        // console.log(3);
        // console.log(window.innerHeight);
        setTimeout(() => {
            if (isMulti) {
                let centerX = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 4)
                // Impossible to detect center Y of the webcam in the screen
                let centerY = webcamBlock.current.offsetTop + (webcamBlock.current.offsetHeight * 300 / window.innerHeight)
                setStyle({
                    left: centerX,
                    top: centerY
                })
                let centerX2 = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 4 * 3)
                let centerY2 = webcamBlock.current.offsetTop + (webcamBlock.current.offsetHeight * 300 / window.innerHeight)
                setStyle2({
                    left: centerX2,
                    top: centerY2
                })
            } else { // single player
                let centerX = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 2)
                // Impossible to detect center Y of the webcam in the screen
                let centerY = webcamBlock.current.offsetTop + (webcamBlock.current.offsetHeight * 300 / window.innerHeight)
                setStyle({
                    left: centerX,
                    top: centerY
                })
            }
        }, 1500)
            // console.log(isMulti);
            // console.log(webcamBlock);
        
    }, [isMulti])
    


  return (
    <div className="webcam d-flex mt-3" ref={webcamBlock} style={{ border: "3px solid #F3B707"}}>
    
        <Webcam
        audio={false}
        ref={webcamRef}
        mirrored={true}
        />
        {/* <div
            className="dot"
            style={style}
        ></div>  
        {isMulti &&
        <div
            className="dot"
            style={style2}
        ></div>  
        }   */}
    </div>
  );
};

export default WebcamCapture;