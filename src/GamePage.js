import rec from './img/rec.png';
import title_s from './img/title_s.png';
import start from './img/start.png';
import WebcamCapture from './WebcamCapture';
import Handsfree from 'handsfree';
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UseInterval from './UseInterval';
import {
    CANVAS_SIZE,
    SNAKE_START,
    SNAKE_START2,
    APPLE_START,
    APPLE_START2,
    SCALE,
    SPEED,
    DIRECTIONS,
    DIRECTIONS2,
} from './Constants';

// function handStart(handsfree) {
//     handsfree.enablePlugins('browser');
//     handsfree.start();
// }


function GamePage() {
    const canvasRef = useRef(null);
    const { gameMode } = useParams(); // should be same as the param in App.js
    const navigate = useNavigate();

    const [opacity, setOpacity] = useState(0);
    const [handMode, setHandMode] = useState();
    const [multi, setMulti] = useState();
    const [alert, setAlert] = useState("Please press the Start Game button and put your hands up");
    const [msg, setMsg] = useState("");
    // const [isDetected, setIsDetected] = useState(false);
    const [snake, setSnake] = useState(SNAKE_START);
    const [snake2, setSnake2] = useState(SNAKE_START2);
    const [apple, setApple] = useState(APPLE_START);
    const [apple2, setApple2] = useState(APPLE_START2);
    const [dir, setDir] = useState([0, -1]); // going up
    const [dir2, setDir2] = useState([0, -1]); // going up
    const [speed, setSpeed] = useState(null);
    const [gameOver, setGameOver] = useState(true);
    
    // let detected = false;

    let handDir = 0; // Don't know why const [dir, setDir] = useState([0, -1]); is not working in setInterval.
    let handDir2 = 0;
    const handsfree = new Handsfree({
        // showDebug: true,
        hands: {
            enabled: true,
            // The maximum number of hands to detect [0 - 4]
            maxNumHands: 2,
        },
    })

    handsfree.useGesture({
    "name": "vertical",
    "algorithm": "fingerpose",
    "models": "hands",
    "confidence": 6.5,
    "description": [
        [
        "addCurl",
        "Thumb",
        "NoCurl",
        1
        ],
        [
        "addDirection",
        "Thumb",
        "VerticalUp",
        1
        ],
        [
        "addCurl",
        "Index",
        "NoCurl",
        1
        ],
        [
        "addDirection",
        "Index",
        "VerticalUp",
        1
        ],
        [
        "addCurl",
        "Middle",
        "NoCurl",
        1
        ],
        [
        "addDirection",
        "Middle",
        "VerticalUp",
        1
        ],
        [
        "addCurl",
        "Ring",
        "NoCurl",
        1
        ],
        [
        "addDirection",
        "Ring",
        "VerticalUp",
        1
        ],
        [
        "addCurl",
        "Pinky",
        "NoCurl",
        1
        ],
        [
        "addDirection",
        "Pinky",
        "VerticalUp",
        1
        ],
        [
        "addDirection",
        "Thumb",
        "VerticalDown",
        1
        ],
        [
        "addDirection",
        "Index",
        "VerticalDown",
        1
        ],
        [
        "addDirection",
        "Middle",
        "VerticalDown",
        1
        ],
        [
        "addDirection",
        "Ring",
        "VerticalDown",
        1
        ],
        [
        "addDirection",
        "Pinky",
        "VerticalDown",
        1
        ],
        [
        "setWeight",
        "Index",
        2
        ]
    ],
    "enabled": true
    })

    handsfree.useGesture({
    "name": "horizontal",
    "algorithm": "fingerpose",
    "models": "hands",
    "confidence": 6.5,
    "description": [
        [
        "addCurl",
        "Thumb",
        "NoCurl",
        1
        ],
        [
        "addDirection",
        "Thumb",
        "HorizontalLeft",
        1
        ],
        [
        "addCurl",
        "Index",
        "NoCurl",
        1
        ],
        [
        "addDirection",
        "Index",
        "HorizontalLeft",
        1
        ],
        [
        "addCurl",
        "Middle",
        "NoCurl",
        1
        ],
        [
        "addDirection",
        "Middle",
        "HorizontalLeft",
        1
        ],
        [
        "addCurl",
        "Ring",
        "NoCurl",
        1
        ],
        [
        "addDirection",
        "Ring",
        "HorizontalLeft",
        1
        ],
        [
        "addCurl",
        "Pinky",
        "NoCurl",
        1
        ],
        [
        "addDirection",
        "Pinky",
        "HorizontalLeft",
        1
        ],
        [
        "addDirection",
        "Thumb",
        "HorizontalRight",
        1
        ],
        [
        "addDirection",
        "Index",
        "HorizontalRight",
        1
        ],
        [
        "addDirection",
        "Middle",
        "HorizontalRight",
        1
        ],
        [
        "addDirection",
        "Ring",
        "HorizontalRight",
        1
        ],
        [
        "addDirection",
        "Pinky",
        "HorizontalRight",
        1
        ],
        [
        "setWeight",
        "Index",
        2
        ]
    ],
    "enabled": true
    })

    function handStart(handsfree) {
        handsfree.enablePlugins('browser');
        handsfree.start();
    }


    // try detect the moment user enters
    const handDetect = async () => {
        return new Promise((resolve, reject) => {
            console.log(handsfree.isLooping);
            let detected = false;
            handStart(handsfree);
            const detectHand = window.setInterval(async () => {
                handsfree.data.hands.pointer.forEach((item, idx) => {
                    if (item.isVisible) {
                        console.log("Hand Detected!");
                        console.log(idx);
                        detected = true;
                    }
                })
            
                if (await detected) {
                    resolve();
                    clearInterval(detectHand);
                }
            }, 500)
        })
    }

    function handPose(handNum, indexPose, thumbLandmark, indexLandmark, middleLandmark, pinkyLandmark, hand, num = 1) {
        // let handNum = 0;
        // let indexPose;
        // let thumbLandmark;
        // let indexLandmark;
        // let middleLandmark;
        // let pinkyLandmark;
        // handsfree.data.hands.pointer.forEach((item, idx) => {
        //     if (item.isVisible) {
        //         handNum = idx;
        //         indexPose = handsfree.model.hands.getGesture()[handNum].pose[1][2];
        //     }
        // })
        // let result = 0;

        thumbLandmark = handsfree.data.hands.landmarks[handNum][4].y; // 4 = Thumb_tip
        indexLandmark = handsfree.data.hands.landmarks[handNum][7].y; // 7 = Index_finger_dip,
        middleLandmark = handsfree.data.hands.landmarks[handNum][12].y; // 12 = Middle_finger_tip
        pinkyLandmark = handsfree.data.hands.landmarks[handNum][19].y; // 19 = Pinky_dip
        console.log("hand num: "+ hand);

        
        if (handsfree.model.hands.getGesture()[handNum].name === "vertical") {
            if (indexPose === "Vertical Up" && hand !== 1) {
                console.log("up");
                (num === 1 ? setDir(DIRECTIONS[38]) : setDir2(DIRECTIONS2[87]));
                hand = 2;
                // result = 2;
            } else if ((indexPose === "Vertical Down" ||
                        indexPose.includes("Diagonal Down")) && hand !== 2) {
                console.log("down");
                (num === 1 ? setDir(DIRECTIONS[40]) : setDir2(DIRECTIONS2[83]));
                hand = 1;
                // result = 1;
            }
        } else if (handsfree.model.hands.getGesture()[handNum].name === "horizontal") {
            if (indexPose === "Horizontal Left" && hand !== 3) {
                console.log("right");
                (num === 1 ? setDir(DIRECTIONS[39]) : setDir2(DIRECTIONS2[68]));
                hand = 4;
                // result = 4;
            } else if ((indexPose === "Horizontal Right" ||
                        indexPose === "Diagonal Up Right") && hand !== 4) {
                console.log("left");
                (num === 1 ? setDir(DIRECTIONS[37]) : setDir2(DIRECTIONS2[65]));
                hand = 3;
                // result = 3;
            }
        } else {
            if ((indexPose === "Horizontal Right" ||
                        indexPose.includes("Diagonal Up Right"))
                        && hand !== 4) {
                    console.log("left");
                    (num === 1 ? setDir(DIRECTIONS[37]) : setDir2(DIRECTIONS2[65]));
                    hand = 3;
                    // result = 3;
            } else if (indexPose.includes("Diagonal Up")) {
                if (thumbLandmark < pinkyLandmark) {
                    if (indexLandmark > middleLandmark) {
                        if (hand !== 1) {
                            console.log("1up");
                            (num === 1 ? setDir(DIRECTIONS[38]) : setDir2(DIRECTIONS2[87]));
                            hand = 2;
                            // result = 2;
                        }
                    } else {
                        if (hand !== 3) {
                            console.log("1right");
                            (num === 1 ? setDir(DIRECTIONS[39]) : setDir2(DIRECTIONS2[68]));
                            hand = 4;
                            // result = 4;
                        }
                    }
                } else {
                    if (indexLandmark > middleLandmark) {
                        if (hand !== 1) {
                            console.log("1up");
                            (num === 1 ? setDir(DIRECTIONS[38]) : setDir2(DIRECTIONS2[87]));
                            hand = 2;
                            // result = 2;
                        }
                    } else {
                        if (hand !== 3) {
                            console.log("2right");
                            (num === 1 ? setDir(DIRECTIONS[39]) : setDir2(DIRECTIONS2[68]));
                            hand = 4;
                            // result = 4;
                        }
                    }
                }
            } else if ((indexPose === "Vertical Down" ||
                        indexPose.includes("Diagonal Down")) && hand !== 2) {
                    console.log("down");
                    (num === 1 ? setDir(DIRECTIONS[40]) : setDir2(DIRECTIONS2[83]));
                    hand = 1;
                    // result = 1;
            }
        }
        // return result;
    }

    function handMoveSnake() {
        handDir = 2;
        handDir2 = 2;
        let handNum = 0;
        let indexPose;
        let thumbLandmark;
        let indexLandmark;
        let middleLandmark;
        let pinkyLandmark;

        return window.setInterval(function () {
            if (!multi) {
                handsfree.data.hands.pointer.forEach((item, idx) => {
                    if (item.isVisible) {
                        handNum = idx;
                        indexPose = handsfree.model.hands.getGesture()[handNum].pose[1][2];
                    }
                })
                handPose(handNum, indexPose, thumbLandmark, indexLandmark, middleLandmark, pinkyLandmark, handDir);
            } else {
                let handNum2 = 0;
                let indexPose2;
                let thumbLandmark2;
                let indexLandmark2;
                let middleLandmark2;
                let pinkyLandmark2;

                handsfree.data.hands.pointer.forEach((item, idx) => {
                    if (item.isVisible) {
                        if (idx < 2) {
                            handNum = idx;
                            indexPose = handsfree.model.hands.getGesture()[handNum].pose[1][2];
                        } else {
                            handNum2 = idx;
                            indexPose2 = handsfree.model.hands.getGesture()[handNum2].pose[1][2];
                        }
                    }
                })
                handPose(handNum, indexPose, thumbLandmark, indexLandmark, middleLandmark, pinkyLandmark, handDir);
                handPose(handNum2, indexPose2, thumbLandmark2, indexLandmark2, middleLandmark2, pinkyLandmark2, handDir2, 2);
            }
    
        }, SPEED);
            
    }

    const moveSnake = ({ keyCode }) => {
        // console.log(keyCode);// 87 83 65 68
        if (keyCode >= 37 && keyCode <= 40) {
            switch (keyCode) {
                case 38:
                    if (dir[0] !== 0 && dir[1] !== 1) { // up
                        // This will only trigger for the arrow keycode and don't break.
                        return setDir(DIRECTIONS[keyCode]); // detect keyboard input and change direction
                    }
                    break;
                case 40:
                    if (dir[0] !== 0 && dir[1] !== -1) { // down
                        return setDir(DIRECTIONS[keyCode]);
                    }
                    break;
                case 37:
                    if (dir[0] !== 1 && dir[1] !== 0) { // left
                        return setDir(DIRECTIONS[keyCode]);
                    }
                    break;
                case 39:
                    if (dir[0] !== -1 && dir[1] !== 0) { // right
                        return setDir(DIRECTIONS[keyCode]);
                    }
                    break;
                default:
                    break;
            }
        }

        if (multi) {
            if (keyCode === 87 || keyCode === 83 || keyCode === 65 || keyCode === 68) {
                switch (keyCode) {
                    case 87:
                        if (dir2[0] !== 0 && dir2[1] !== 1) { // up
                            // This will only trigger for the arrow keycode and don't break.
                            return setDir2(DIRECTIONS2[keyCode]); // detect keyboard input and change direction
                        }
                        break;
                    case 83:
                        if (dir2[0] !== 0 && dir2[1] !== -1) { // down
                            return setDir2(DIRECTIONS2[keyCode]);
                        }
                        break;
                    case 65:
                        if (dir2[0] !== 1 && dir2[1] !== 0) { // left
                            return setDir2(DIRECTIONS2[keyCode]);
                        }
                        break;
                    case 68:
                        if (dir2[0] !== -1 && dir2[1] !== 0) { // right
                            return setDir2(DIRECTIONS2[keyCode]);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const setup = () => {
        setMsg("");
        setSnake(SNAKE_START);
        setApple(APPLE_START);
        setDir([0, -1]);
        if (multi) {
            setSnake2(SNAKE_START2);
            setApple2(APPLE_START2);
            setDir2([0, -1]);
        }
    }

    const startGame = () => {
        count();
        setup();
        setGameOver(false);
        setTimeout(() => {
            setSpeed(SPEED / 2);
            document.getElementById('canvas').focus();
            setMsg("")
        }, 4001)
    }

    const startGameHand = async () => {
        return new Promise((resolve, reject) => {
            handMoveSnake();
            setup();
            setGameOver(false);
            setSpeed(SPEED);
        })
    }

    const endGame = (count = 0) => {
        setSpeed(null);
        setGameOver(true);
        switch (count) {
            case 1:
                setMsg("P2 win!");
                break;
            case 2:
                setMsg("P1 win!");
                break
            case 3:
                setMsg("Tie!");
                break
            default:
                setMsg("Game Over!");
                break;
        }
        // handsfree.stop();
    }

    const count = () => {
        let count = 4;
        let countdown = window.setInterval(() => {
            if (count > 1) setMsg(--count)
            if (count === 0) clearInterval(countdown)
        }, 1000)
    }

    const handleStart = () => {
        setAlert("Detecting...");
        handDetect()
            .then(() => { setAlert("Hand(s) Detected") })
            .then(() => { setTimeout(() => setAlert(""), 1000) })
            .then(() => { count() })
            .then(() => {
                setTimeout(() => {
                    setMsg("")
                    startGameHand()
                }, 4001)
            });
    }        
        
    const createApple = (apple) =>  // can't add curly braces here, don't know why
        apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

    const checkCollision = (piece, snk = snake, snk2 = snake2) => { // piece = head of the snake
        // check if the snake head hits the wall
         if (
            piece[0] * SCALE >= CANVAS_SIZE[0] ||
            piece[0] < 0 ||
            piece[1] * SCALE >= CANVAS_SIZE[1] ||
            piece[1] < 0
         ) {
            return true;
        }
        
        // check if the snake head has same coordinate with the snake body
        for (const segment of snk) {
            if (piece[0] === segment[0] && piece[1] === segment[1]) {
                return true;
            }
        }
        if (multi) {
            for (const segment of snake2) {
                if (piece[0] === segment[0] && piece[1] === segment[1]) {
                    return true;
                }
            }
        }
        return false;
    }

    const checkAppleCollision = newSnake => {
        if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
            let newApple = createApple(apple);
            // continue if the new apple is colliding with the snake
            while (checkCollision(newApple, newSnake, snake2) || newApple === apple2) {
                newApple = createApple(apple);
            }
            setApple(newApple);
            return true;
        } else if (newSnake[0][0] === apple2[0] && newSnake[0][1] === apple2[1]) {
            let newApple = createApple(apple2);
            // continue if the new apple is colliding with the snake
            while (checkCollision(newApple, newSnake, snake) || newApple === apple) {
                newApple = createApple(apple2);
            }
            setApple2(newApple);
            return true;
        }
        return false;
    }

    const gameLoop = (snake, snake2) => {
        // make a copy of the snake state. Don't mutate the state in React
        let count = 0;
        const snakeCopy = JSON.parse(JSON.stringify(snake)); // deep clone
        const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]] // [x + dir, y + dir] = new value of the snake head
        snakeCopy.unshift(newSnakeHead);
        if (checkCollision(newSnakeHead)) {
            console.log("2 win!");
            count++;
        }
        // only pop of the tail if the snake does not eat the apple
        if (!checkAppleCollision(snakeCopy)) {
            snakeCopy.pop();
        }
        setSnake(snakeCopy);

        if (multi) {
            const snakeCopy2 = JSON.parse(JSON.stringify(snake2)); // deep clone
            const newSnakeHead2 = [snakeCopy2[0][0] + dir2[0], snakeCopy2[0][1] + dir2[1]] // [x + dir, y + dir] = new value of the snake head
            snakeCopy2.unshift(newSnakeHead2);
            if (checkCollision(newSnakeHead2)) {
                console.log("1 win!");
                count += 2;
            }

            // only pop of the tail if the snake does not eat the apple
            if (!checkAppleCollision(snakeCopy2)) {
                snakeCopy2.pop();
            }
            setSnake2(snakeCopy2);
        }

        if (count !== 0) {
            if (multi) endGame(count);
            else endGame();
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setOpacity(1)
        }, 100)
        if (gameMode === "regular_mode_single") {
        setHandMode(false);
        setMulti(false);

        } else if (gameMode === "regular_mode_multi") {
            setHandMode(false);
            setMulti(true);
    
        } else if (gameMode === "hand_mode_single") {
            setHandMode(true);
            setMulti(false);

            // try detect the moment user enters.
        } else if (gameMode === "hand_mode_multi") {
            setHandMode(true);
            setMulti(true);

        }
    }, [gameMode])

    // trigger whenever snake, apple or end of the game state has been updated
    useEffect(() => {
        // get the context to be able to draw with this context on the canvas
        const context = canvasRef.current.getContext("2d");
        // set the scale each time to whatever we define in SCALE constant
        context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        // clear canvas before we start drawing a thing
        context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
        // context.canvas.width  = (window.innerWidth) * 0.98;
        // context.canvas.height = (window.innerHeight) * 0.68;
        context.fillStyle = "pink";
        snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1)) // set x and y values to 1
        context.fillStyle = "green";
        if (multi) {
            snake2.forEach(([x, y]) => context.fillRect(x, y, 1, 1)) // set x and y values to 1
        }

        context.fillStyle = "lightblue";
        context.fillRect(apple[0], apple[1], 1, 1);
        context.fillStyle = "red";
        if (multi) {
            context.fillRect(apple2[0], apple2[1], 1, 1);
        }

    }, [snake, snake2, apple, apple2, gameOver, multi])

    UseInterval(() => gameLoop(snake, snake2), speed);

    const handleGameMode = (e) => {
        if (e.target.checked) {
            navigate(`/hand_mode_${!multi ? "single": "multi"}`);
        } else {
            navigate(`/regular_mode_${!multi ? "single" : "multi"}`);
            if (handsfree.isLooping !== undefined) {
                handsfree.stop();
            }
        }
        setup();
    }

    const handlePlayers = (e) => {
        if (e.target.checked) {
            if (handMode) {
                navigate(`/hand_mode_multi`);
            } else {
                navigate(`/regular_mode_multi`);
            }
            
        } else {
            if (handMode) {
                navigate(`/hand_mode_single`);
            } else {
                navigate(`/regular_mode_single`);
            }
        }
        setup();
    }

    return (
        <div>
            <div className="gameSection" style={{opacity : opacity}}>
                {/* <span className={enterEffect} data-value="1"></span> */}
                <img src={rec} alt="rectangle" />
                {!handMode ?
                    <div id="canvas" role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
                        <canvas
                            style={{ border: "3px solid #F3B707"}}
                            ref={ canvasRef }
                            width={`${CANVAS_SIZE[0]}px`}
                            height={`${CANVAS_SIZE[1]}px`}
                        />
                        <p className="alert countdown">{msg}</p>
                        {/* {gameOver && <div>GAME OVER!</div>} */}
                        {/* <button onClick={startGame}>Start Game</button> */}
                    </div> :
                    <div>
                        <canvas
                            style={{ border: "3px solid #F3B707"}}
                            ref={ canvasRef }
                            width={`${CANVAS_SIZE[0]}px`}
                            height={`${CANVAS_SIZE[1]}px`}
                        />
                        <p className="alert">{alert}</p>
                        <p className="alert countdown">{msg}</p>
                        {/* {gameOver && <div>GAME OVER!</div>} */}
                        
                        {/* <WebcamCapture isMulti={multi}/>  */}
                        
                    </div>
                }    
                <div className="d-flex justify-content-end">
                    <img src={rec} alt="rectangle" />
                </div>
            <div className="d-flex gameSet justify-content-between">
                    <div className="optionSection">
                        <img className="title d-block" src={title_s} alt="Snake Game" />
                        <div className="d-flex">
                            <p className={!handMode ? "isActive" : ""}>Regular</p>
                            <p className={handMode ? "isActive" : ""}>Hand</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" defaultChecked={handMode}
                                onClick={(e) => { handleGameMode(e) }} disabled={!gameOver}/>
                            <span className="slider round"></span>
                        </label>
                        <div className="d-flex">
                            <p className={!multi ? "isActive" : ""}>Single Player</p>
                            <p className={multi ? "isActive" : ""}>Two Players</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" defaultChecked={multi}
                                onClick={(e) => { handlePlayers(e) }} disabled={!gameOver}/>
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="mt-5 buttonBlock">
                    {handMode ? 
                        <>
                        <button className="button" onClick={handleStart}>
                            <span>Start Game</span>
                            <img src={start} alt="start" />
                            <svg>
                                <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                            </svg>
                        </button>    
                        </> :
                        <button className="button" onClick={startGame}>
                            <span>Start Game</span>
                            <img src={start} alt="start" />
                            <svg>
                                <rect x="0" y="0" fill="none" width="100%" height="100%"/>
                            </svg>
                        </button>
                    }
                    </div>
                    {handMode && <WebcamCapture isMulti={multi}/>}
                    
                </div>
            </div>
        </div>
    )
}
export default GamePage;