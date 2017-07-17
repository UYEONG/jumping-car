import {map, step} from './env';
import arrayFrom from './utils/array-from';

const {bgImageWidth} = map;
const bgFixed = arrayFrom(document.querySelectorAll('.showcase__background.fixed'));
const bgParal = arrayFrom(document.querySelectorAll('svg .parallax'));
const bgImages = bgParal.map((p) => arrayFrom(p.querySelectorAll('image')));
const cache = [[0, bgImageWidth],[0, bgImageWidth]];
let steps;

const background = {
    use() {
        this.updateStep(step.range);
        bgFixed.forEach((bg) => bg.style.width = `${bgImageWidth}px`);
        bgParal.forEach((g) => g.style.display = 'block');
        bgImages.forEach((bgs) => {
            bgs.forEach((bg, i) => {
                bg.setAttribute('width', bgImageWidth);
                bg.setAttribute('transform', `translate(${i * bgImageWidth},0)`);
            });
        });
        return this;
    },
    updateStep(range) {
        steps = bgParal.map((bg, i) => range / (bgParal.length - i));
    },
    draw() {
        for (let i = 0, n = bgParal.length; i < n; i++) {
            let x1 = cache[i][0] - steps[i];
            let x2 = cache[i][1] - steps[i];
            x1 = x1 < -bgImageWidth ? x2 + bgImageWidth : x1;
            x2 = x2 < -bgImageWidth ? x1 + bgImageWidth : x2;
            bgImages[i][0].setAttribute('transform', 'translate(' + (x1 < x2 ? x1 : x1 - 1) + ',0)');
            bgImages[i][1].setAttribute('transform', 'translate(' + (x2 < x1 ? x2 : x2 - 1) + ',0)');
            cache[i][0] = x1;
            cache[i][1] = x2;
        }
    }
};

export default background;
