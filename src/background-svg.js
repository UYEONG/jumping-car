import {map, step} from './env';
import arrayFrom from './utils/array-from';

const {bgImageWidth} = map;
const bgParal = arrayFrom(document.querySelectorAll('.graphic__background-group'));
const bgImages = bgParal.map((p) => arrayFrom(p.querySelectorAll('.graphic__background')));
const cache = [[0, bgImageWidth],[0, bgImageWidth]];
let steps;

const background = {
    use() {
        this.updateStep(step.range);
        bgParal.forEach((g) => g.classList.add('show'));
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
        // for (let i = 0, n = bgParal.length; i < n; i++) {
        //     let x1 = cache[i][0] - steps[i];
        //     let x2 = cache[i][1] - steps[i];
        //     x1 = x1 < -bgImageWidth ? x2 + bgImageWidth : x1;
        //     x2 = x2 < -bgImageWidth ? x1 + bgImageWidth : x2;
        //     bgImages[i][0].setAttribute('transform', 'translate(' + (x1 < x2 ? x1 : x1 - 1) + ',0)');
        //     bgImages[i][1].setAttribute('transform', 'translate(' + (x2 < x1 ? x2 : x2 - 1) + ',0)');
        //     cache[i][0] = x1;
        //     cache[i][1] = x2;
        // }
        // ------
        let x1 = cache[0][0] - steps[0];
        let x2 = cache[0][1] - steps[0];
        x1 = x1 < -bgImageWidth ? x2 + bgImageWidth : x1;
        x2 = x2 < -bgImageWidth ? x1 + bgImageWidth : x2;
        bgImages[0][0].setAttribute('transform', 'translate(' + (x1 < x2 ? x1 : x1 - 1) + ',0)');
        bgImages[0][1].setAttribute('transform', 'translate(' + (x2 < x1 ? x2 : x2 - 1) + ',0)');
        cache[0][0] = x1;
        cache[0][1] = x2;
        // ------
        x1 = cache[1][0] - steps[1];
        x2 = cache[1][1] - steps[1];
        x1 = x1 < -bgImageWidth ? x2 + bgImageWidth : x1;
        x2 = x2 < -bgImageWidth ? x1 + bgImageWidth : x2;
        bgImages[1][0].setAttribute('transform', 'translate(' + (x1 < x2 ? x1 : x1 - 1) + ',0)');
        bgImages[1][1].setAttribute('transform', 'translate(' + (x2 < x1 ? x2 : x2 - 1) + ',0)');
        cache[1][0] = x1;
        cache[1][1] = x2;
    }
};

export default background;
