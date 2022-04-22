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