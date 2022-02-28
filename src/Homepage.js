import title from './img/title.png';
import snake_1 from './img/snake_1.png';
import snake_2 from './img/snake_2.png';
import keyboard from './img/keyboard.png';
import hand from './img/hand.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Homepage() {
    const [content, setContent] = useState("");
    const [content2, setContent2] = useState("");
    const [modeSelected, setModeSelected] = useState("");
    const [enterEffect, setEnterEffect] = useState("color");
    const navigate = useNavigate();

    let initialTxt = "Regular Mode";
    let initialTxt2 = "Hand Mode";
    let initialTxt3 = "Single Player";
    let initialTxt4 = "Two Players";

    const handleClick = (mode) => {
        if (modeSelected === "") {
            setTimeout(() => {
                setModeSelected(mode);
                if (mode === "regular_mode") {
                    setContent("bi bi-person-fill")
                } else {
                    setContent2("bi bi-people-fill")
                }
            }, 600)
        } else {
            setModeSelected("");
            setContent("")
            setContent2("")
        }
    }

    const handleNavigate = (link) => {
        setEnterEffect("color expanded");
        setTimeout(() => navigate(link), 500);
    }
    
    return (
        <div className="homeSection">
            <img className="snakeBackground" src={snake_1} alt="snake" />
            <img className="snakeBackground snakeBottom" src={snake_2} alt="snake" />
            <div className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center">
                <img className="title" src={title} alt="Snake Game" />
                {modeSelected === "" ?
                <>
                <p className="text-primary">Select the mode</p>
                <div className="d-flex buttonBlock">
                    <button className="d-block text-center button"
                        onMouseOver={() => setContent(keyboard)}
                        onMouseLeave={() => setContent("")}
                        onClick={() => handleClick("regular_mode")}>
                        <svg>
                            <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                        </svg>
                        {content ? <img src={content} alt="keyboard" /> : initialTxt}
                    </button>
                    <button className="d-block text-center button"
                        onMouseOver={() => setContent2(hand)}
                        onMouseLeave={() => setContent2("")}
                        onClick={() =>  handleClick("hand_mode")}>
                        <svg>
                            <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                        </svg>
                        {content2 ? <img src={content2} alt="hand" /> : initialTxt2}
                    </button>
                </div> 
                </> :
                <>
                <p className="text-primary">Select player number</p>
                <div className="d-flex buttonBlock">
                    <button className="d-block text-center button"
                        onMouseOver={() => setContent("bi bi-person-fill")}
                        onMouseLeave={() => setContent("")}
                        onClick={() =>  handleNavigate(`/${modeSelected}_single`)}>         
                        <svg>
                            <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                        </svg>
                        {content ? <i className={content}></i> : initialTxt3}
                    </button>
                    <button className="d-block text-center button"
                        onMouseOver={() => setContent2("bi bi-people-fill")}
                        onMouseLeave={() => setContent2("")}
                        onClick={() =>  handleNavigate(`/${modeSelected}_multi`)}>
                        <svg>
                            <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                        </svg>
                        {content2 ? <i className={content2}></i> : initialTxt4}
                    </button>
                    <p className="returnMode" onClick={() => handleClick()}>Select the mode</p> 
                        
                </div>
                
                </>
                }
                <span className={enterEffect} data-value="1"></span>
            </div>
        </div>
    )
}
export default Homepage;