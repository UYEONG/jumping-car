import {map, step} from './env';
import random from './utils/random';

const {viewBoxWidth, carImageWidth, carJumpHeight, landPositionY} = map;
const obstaclesEl = document.querySelector('.svg-obstacles');
const gapRange = [carImageWidth * 2.5, carImageWidth * 5.5];
const heightRange = [carJumpHeight / 4, carJumpHeight / 1.5];
let collection = [];
let stepValue = step.range;

const obstacles = {
    get(index) {
        return collection[index];
    },
    create() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const lastObstacle = collection[collection.length - 1] || null;
        const gap = random(gapRange[0], gapRange[1]);
        const width = carImageWidth / 5;
        const height = random(heightRange[0], heightRange[1]);
        const x = (lastObstacle ? lastObstacle.x : viewBoxWidth) + gap;
        const y = landPositionY - height + 1;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('class', 'svg-obstacles__obstacle');
        svg.setAttribute('x', x);
        svg.setAttribute('y', y);
        svg.insertAdjacentHTML('afterbegin', `
            <rect x="0"   y="0" width="100%" height="100%" opacity="1" fill="#eeeeee"></rect>
            <rect x="0"   y="0" width="65%"  height="100%" opacity="1" fill="#d3d3d3"></rect>
            <rect x="82%" y="0" width="18%"  height="100%" opacity="1" fill="#d3d3d3"></rect>
            <rect x="0"   y="0" width="30%"  height="100%" opacity="1" fill="#b3b3b3"></rect>
            <rect x="40%" y="0" width="10%"  height="100%" opacity="1" fill="#b3b3b3"></rect>
            <line x1="1"   y1="100%" x2="1"    y2="0"    stroke="#7f7f7f" stroke-width="2"></line>
            <line x1="0"   y1="0"    x2="100%" y2="0"    stroke="#7f7f7f" stroke-width="2"></line>
            <line x1="98%" y1="0"    x2="98%"  y2="100%" stroke="#979797" stroke-width="2"></line>
        `);
        collection.push({svg, x, y, width, height, counted: false});
        obstaclesEl.appendChild(svg);
    },
    updateStep(newStepValue) {
        stepValue = newStepValue;
    },
    draw() {
        // for (let i = 0; i < 5; i++) {
        //     let obstacle = collection[i];
        //     obstacle.x = obstacle.x - stepValue;
        //     obstacle.svg.setAttribute('x', obstacle.x);
        // }
        // ------
        let obstacle = collection[0];
        obstacle.x = obstacle.x - stepValue;
        obstacle.svg.setAttribute('x', obstacle.x);
        // ------
        obstacle = collection[1];
        obstacle.x = obstacle.x - stepValue;
        obstacle.svg.setAttribute('x', obstacle.x);
        // ------
        obstacle = collection[2];
        obstacle.x = obstacle.x - stepValue;
        obstacle.svg.setAttribute('x', obstacle.x);
        // ------
        obstacle = collection[3];
        obstacle.x = obstacle.x - stepValue;
        obstacle.svg.setAttribute('x', obstacle.x);
        // ------
        obstacle = collection[4];
        obstacle.x = obstacle.x - stepValue;
        obstacle.svg.setAttribute('x', obstacle.x);
        // ------
        obstacle = collection[0];
        if (obstacle.x + parseInt(obstacle.width, 10) < 0) {
            obstaclesEl.removeChild(obstacle.svg);
            collection = collection.filter((o) => o.svg !== obstacle.svg);
            setTimeout(() => this.create(), 0);
        }
    },
    clear() {
        collection.forEach((obstacle) => {
            obstaclesEl.removeChild(obstacle.svg);
        });
        collection = [];
    }
};

export default obstacles;
