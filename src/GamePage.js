import rec from './img/rec.png';
import title_s from './img/title_s.png';
import WebcamCapture from './WebcamCapture';
import Handsfree from 'handsfree';
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UseInterval from './UseInterval';
import {
    CANVAS_SIZE,
    SNAKE_START,
    APPLE_START,
    SCALE,
    SPEED,
    DIRECTIONS,
} from './Constants';

function handStart(handsfree) {
    handsfree.enablePlugins('browser');
    handsfree.start();
}

function GamePage() {
    const canvasRef = useRef(null);
    const { gameMode } = useParams(); // should be same as the param in App.js
    console.log(gameMode);

    const [mode, setMode] = useState(true);
    const [gameDis, setGameDis] = useState(false);
    const [playerChoose, setPlayerChoose] = useState(false);
    const [multi, setMulti] = useState(false);
    const [snake, setSnake] = useState(SNAKE_START);
    const [apple, setApple] = useState(APPLE_START);
    const [dir, setDir] = useState([0, -1]); // going up
    const [speed, setSpeed] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [interval, setInterval] = useState(null);
    

    let coordinate = [];
    let handDir = 0; // Don't know why const [dir, setDir] = useState([0, -1]); is not working in setInterval.
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

    function handDetect() {
        handStart(handsfree);
        setTimeout(() => {
            let detectHand = window.setInterval(function () {
                let detected = false;
                if (handsfree.data.hands.pointer[0].isVisible) {
                    console.log("Hand Detected!")
                    detected = true;
                }

                if (detected) clearInterval(detectHand);
            }, 500)
        }, 1500); 
    }

    function handPose() {
        // need to be fixed. detect which hand is using at the beginning
        let handNum = 0;
        let indexPose;
        let thumbLandmark;
        let indexLandmark;
        let middleLandmark;
        let pinkyLandmark;
        handsfree.data.hands.pointer.forEach((item, idx) => {
            if (item.isVisible) {
                handNum = idx;
                indexPose = handsfree.model.hands.getGesture()[handNum].pose[1][2];
            }
        })

        thumbLandmark = handsfree.data.hands.landmarks[handNum][4].y; // 4 = Thumb_tip
        indexLandmark = handsfree.data.hands.landmarks[handNum][7].y; // 7 = Index_finger_dip,
        middleLandmark = handsfree.data.hands.landmarks[handNum][12].y; // 12 = Middle_finger_tip
        pinkyLandmark = handsfree.data.hands.landmarks[handNum][19].y; // 19 = Pinky_dip

        
        if (handsfree.model.hands.getGesture()[handNum].name === "vertical") {
            if (indexPose === "Vertical Up" && handDir !== 1) {
                console.log("up");
                setDir(DIRECTIONS[38])
                handDir = 2;
            } else if ((indexPose === "Vertical Down" ||
                        indexPose.includes("Diagonal Down")) && handDir !== 2) {
                console.log("down");
                setDir(DIRECTIONS[40])
                handDir = 1;
            }
        } else if (handsfree.model.hands.getGesture()[handNum].name === "horizontal") {
            if (indexPose === "Horizontal Left" && handDir !== 3) {
                console.log("right");
                setDir(DIRECTIONS[39]);
                handDir = 4;
            } else if ((indexPose === "Horizontal Right" ||
                        indexPose === "Diagonal Up Right") && handDir !== 4) {
                console.log("left");
                setDir(DIRECTIONS[37]);
                handDir = 3;
            }
        } else {
            if ((indexPose === "Horizontal Right" ||
                        indexPose.includes("Diagonal Up Right"))
                        && handDir !== 4) {
                    console.log("left");
                    setDir(DIRECTIONS[37]);
                    handDir = 3;
            } else if (indexPose.includes("Diagonal Up")) {
                if (thumbLandmark < pinkyLandmark) {
                    if (indexLandmark > middleLandmark) {
                        if (handDir !== 1) {
                            console.log("1up");
                            setDir(DIRECTIONS[38])
                            handDir = 2;
                        }
                    } else {
                        if (handDir !== 3) {
                            console.log("1right");
                            setDir(DIRECTIONS[39]);
                            handDir = 4;
                        }
                    }
                } else {
                    if (indexLandmark > middleLandmark) {
                        if (handDir !== 1) {
                            console.log("1up");
                            setDir(DIRECTIONS[38])
                            handDir = 2;
                        }
                    } else {
                        if (handDir !== 3) {
                            console.log("2right");
                            setDir(DIRECTIONS[39]);
                            handDir = 4;
                        }
                    }
                }
            } else if ((indexPose === "Vertical Down" ||
                        indexPose.includes("Diagonal Down")) && handDir !== 2) {
                    console.log("down");
                    setDir(DIRECTIONS[40])
                    handDir = 1;
            }
        }
    }

    function handMoveSnake() {
        handDir = 2;
        if (!multi) {
            return window.setInterval(function () {
                handPose();
    
            }, SPEED);
            // return window.setInterval(function () {
                
            //     if (handsfree.data.hands.pointer[0].isVisible) {
            //         coordinate[0] = handsfree.data.hands.pointer[0].x;
            //         coordinate[1] = handsfree.data.hands.pointer[0].y;
                    
            //         if (Math.abs(coordinate[0] - (window.screen.width / 2)) >= Math.abs(coordinate[1] - 300)) {
            //             if (coordinate[0] > (window.screen.width / 2) && handDir !== 3) {
            //                 setDir(DIRECTIONS[39]);
            //                 handDir = 4;
            //             } else if (coordinate[0] < (window.screen.width / 2) && handDir !== 4) {
            //                 setDir(DIRECTIONS[37]);
            //                 handDir = 3;
            //             } else {
            //                 console.log("Not moving");
            //             }
                        
            //         } else {
            //             if (coordinate[1] > 300 && handDir !== 2) {
            //                 setDir(DIRECTIONS[40])
            //                 handDir = 1;
            //             } else if (coordinate[1] < 300 && handDir !== 1) {
            //                 setDir(DIRECTIONS[38])
            //                 handDir = 2;
            //             } else {
            //                 console.log("Not moving");
            //             }
                        
            //         }
                    
            //     } else {
            //         console.log("..");
            //     }
    
            // }, SPEED);
            
        } else {
            return window.setInterval(function () {
                handsfree.data.hands.pointer.forEach((item, idx) => {
                    console.log(item);
                    if (item.isVisible) {
                        let playerScreen = 0;
                        coordinate[0] = item.x;
                        coordinate[1] = item.y;
                        
                        if (idx === 0 || idx === 1) {
                            playerScreen = window.screen.width / 4;
                        } else if (idx === 2 || idx === 3) {
                            playerScreen = window.screen.width / 4 * 3;
                        }
                        console.log(playerScreen);
                        if (Math.abs(coordinate[0] - playerScreen) >= Math.abs(coordinate[1] - 300)) {
                                if (coordinate[0] > (playerScreen) && handDir !== 3) {
                                    setDir(DIRECTIONS[39]);
                                    handDir = 4;
                                } else if (coordinate[0] < (playerScreen) && handDir !== 4) {
                                    setDir(DIRECTIONS[37]);
                                    handDir = 3;
                                } else {
                                    console.log("Not moving");
                                }
                                
                            } else {
                                if (coordinate[1] > 300 && handDir !== 2) {
                                    setDir(DIRECTIONS[40])
                                    handDir = 1;
                                } else if (coordinate[1] < 300 && handDir !== 1) {
                                    setDir(DIRECTIONS[38])
                                    handDir = 2;
                                } else {
                                    console.log("Not moving");
                                }
                                
                            }
                    } else {
                        console.log("..");
                    }
                    
                });

            }, SPEED)
        }

    }

    const startGame = () => {
        setSnake(SNAKE_START);
        setApple(APPLE_START);
        setDir([0, -1]);
        setGameOver(false);
        // handStart(handsfree);
        setSpeed(SPEED);
        // setMode(false);
    }

    const startGameHand = () => {
        setSnake(SNAKE_START);
        setApple(APPLE_START);
        setDir([0, -1]);
        setGameOver(false);
        // handStart(handsfree);
        setSpeed(SPEED);
        setInterval(handMoveSnake);
        // setMode(false);
    }

    const endGame = () => {
        setSpeed(null);
        setGameOver(true);
        handsfree.stop();
        if (interval !== null) {
            clearInterval(interval);
        }
        setMode(true);
    }

    const moveSnake = ({ keyCode }) => {
        
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
    }
        
        
    const createApple = () =>  // can't add curly braces here, don't know why
        apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

    const checkCollision = (piece, snk = snake) => { // piece = head of the snake
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
        return false;
    }

    const checkAppleCollision = newSnake => {
        if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
            let newApple = createApple();
            // continue if the new apple is colliding with the snake
            while (checkCollision(newApple, newSnake)) {
                newApple = createApple();
            }
            setApple(newApple);
            return true;
        }
        return false;
    }

    const gameLoop = () => {
        // make a copy of the snake state. Don't mutate the state in React
        const snakeCopy = JSON.parse(JSON.stringify(snake)); // deep clone
        const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]] // [x + dir, y + dir] = new value of the snake head
        snakeCopy.unshift(newSnakeHead);
        if (checkCollision(newSnakeHead)) {
            endGame();
        }
        // only pop of the tail if the snake does not eat the apple
        if (!checkAppleCollision(snakeCopy)) {
            snakeCopy.pop();
        }
        setSnake(snakeCopy);
    }

    // trigger whenever snake, apple or end of the game state has been updated
    useEffect(() => {
        // get the context to be able to draw with this context on the canvas
        const context = canvasRef.current.getContext("2d");
        // set the scale each time to whatever we define in SCALE constant
        context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        // clear canvas before we start drawing a thing
        context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
        context.fillStyle = "pink";
        snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1)) // set x and y values to 1

        context.fillStyle = "lightblue";
        context.fillRect(apple[0], apple[1], 1, 1);

    }, [snake, apple, gameOver])

    UseInterval(() => gameLoop(), speed);

    const selectGameType = (opt) => {
        if (opt === "reg") {
            setGameDis("reg");
            setPlayerChoose(false);
        } else if (opt === "hand") {
            setPlayerChoose(true);
        }
    }

    const playerNum = (num) => {
        if (num === 1) {
            setMulti(false);
        } else if (num === 2) {
            setMulti(true);
        }
        setGameDis("hand");
    }

    return (
        <div className="gameSection mx-3">
            <img src={rec} alt="rectangle" />
            <img src={rec} alt="rectangle" />
            {gameDis !== "hand" ?
                <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
                    <canvas
                        style={{ border: "1px solid red"}}
                        ref={ canvasRef }
                        width={`${CANVAS_SIZE[0]}px`}
                        height={`${CANVAS_SIZE[1]}px`}
                    />
                    {gameOver && <div>GAME OVER!</div>}
                    <button onClick={startGame}>Start Game</button>
                </div> :
                <div>
                    <canvas
                        style={{ border: "1px solid red"}}
                        ref={ canvasRef }
                        width={`${CANVAS_SIZE[0]}px`}
                        height={`${CANVAS_SIZE[1]}px`}
                    />
                    {gameOver && <div>GAME OVER!</div>}
                    <button onClick={handDetect}>Hand Detect</button>
                    <button onClick={startGameHand}>Start Game</button>
                    <WebcamCapture isMulti={multi}/> 
                </div>
            }    
            <div className="d-flex justify-content-end">
                <img src={rec} alt="rectangle" />
                <img src={rec} alt="rectangle" />
            </div>
            <div className="optionSection">
                <img className="title d-block" src={title_s} alt="Snake Game" />
                <div>
                    <span>Regular</span>
                    <span>Hand</span>
                </div>
                <div>
                    <span>Single Player</span>
                    <span>Two Players</span>
                </div>
            </div>
            {mode && 
            <>
            <h1 className="bg-primary">Game type</h1>
            <button onClick={() => selectGameType("reg")}>Regular</button>
            <button onClick={() => selectGameType("hand")}>Hand Detection</button>
            <button>Test</button>
            <br />
            {playerChoose &&
                <>
                <button onClick={() => playerNum(1)}>Single Player</button>
                <button onClick={() => playerNum(2)}>Two Players</button>
                </>
            }
            <br />
            </>
            }
        </div>
    )
}
export default GamePage;