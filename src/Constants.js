const CANVAS_SIZE = [window.innerWidth - 40, window.innerHeight - 350];
const SNAKE_START = [
    [10, 15],
    [10, 16]
];
const SNAKE_START2 = [
    [20, 15],
    [20, 16]
];

const APPLE_START = [8, 3];
const APPLE_START2 = [18, 3];
const SCALE = 30;
const SPEED = 300;

const DIRECTIONS = {
    38: [0, -1], // up
    40: [0, 1], // down
    37: [-1, 0], // left
    39: [1, 0] // right
};

const DIRECTIONS2 = {
    87: [0, -1], // up
    83: [0, 1], // down
    65: [-1, 0], // left
    68: [1, 0] // right
};

export {
    CANVAS_SIZE,
    SNAKE_START,
    SNAKE_START2,
    APPLE_START,
    APPLE_START2,
    SCALE,
    SPEED,
    DIRECTIONS,
    DIRECTIONS2,
}