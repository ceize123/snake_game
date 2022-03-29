import Webcam from "react-webcam";
import { useState, useRef, useEffect } from "react";
import detect from './img/detectionIns.gif';
import keyboard from './img/keyboardIns.gif';

const WebcamCapture = (prop) => {
    const { isOn } = prop;
    const webcamRef = useRef(null);
    const webcamBlock = useRef(null);
    const [hand, setHandMode] = useState("");

    useEffect(() => {
        if (prop.hand === true) {
            setHandMode(detect);
        } else {
            setHandMode(keyboard);
        }
    }, [prop]);


    // useEffect(() => {
    //     // let centerX = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 2)
    //     // let centerY = webcamBlock.current.offsetTop + (webcamBlock.current.offsetHeight / 2)
    //     // setStyle({
    //     //     left: centerX,
    //     //     top: centerY
    //     // })
    //     // console.log(webcamBlock.current.offsetTop);
    //     // console.log(2);
    //     // console.log(webcamBlock.current.offsetHeight);
    //     // console.log(3);
    //     // console.log(window.innerHeight);
    //     setTimeout(() => {
    //         if (isOn) {
    //             let centerX = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 4)
    //             // Impossible to detect center Y of the webcam in the screen
    //             let centerY = webcamBlock.current.offsetTop + (webcamBlock.current.offsetHeight * 300 / window.innerHeight)
    //             setStyle({
    //                 left: centerX,
    //                 top: centerY
    //             })
    //             let centerX2 = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 4 * 3)
    //             let centerY2 = webcamBlock.current.offsetTop + (webcamBlock.current.offsetHeight * 300 / window.innerHeight)
    //             setStyle2({
    //                 left: centerX2,
    //                 top: centerY2
    //             })
    //         } else { // single player
    //             let centerX = webcamBlock.current.offsetLeft + (webcamBlock.current.offsetWidth / 2)
    //             // Impossible to detect center Y of the webcam in the screen
    //             let centerY = webcamBlock.current.offsetTop + (webcamBlock.current.offsetHeight * 300 / window.innerHeight)
    //             setStyle({
    //                 left: centerX,
    //                 top: centerY
    //             })
    //         }
    //     }, 1500)
    //         // console.log(isMulti);
    //         // console.log(webcamBlock);
        
    // }, [isOn])

  return (
    <div className="webcam d-flex mt-3" ref={webcamBlock} style={{ border: "3px solid #F3B707"}}>
            
          {isOn && prop.hand ?
              <Webcam
                audio={false}
                ref={webcamRef}
                mirrored={true}
              /> :
              <img src={hand} alt="Instruction" />
          }
        
    </div>
  );
};

export default WebcamCapture;