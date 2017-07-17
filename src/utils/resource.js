function image(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
}

function audio(src = '', options = {}) {
    return new Promise((resolve, reject) => {
        const sound = new Howl((options.src = src, options));
        sound.on('load', () => resolve(sound));
        sound.on('loaderror', reject);
    });
}

function font(names = []) {
    return new Promise((resolve, reject) => {
        WebFont.load({
            google: {
                families: names
            },
            active: resolve,
            inactive: reject
        });
    });
}

function load() {
    return Promise.all([
        image('dist/images/sunset.png'),
        image('dist/images/sun.png'),
        image('dist/images/tree.png'),
        image('dist/images/land.png'),
        audio('dist/sounds/background.mp3', {volume: .8, loop: true}),
        audio('dist/sounds/car-jump.mp3', {volume: .5}),
        audio('dist/sounds/car-bang.wav', {volume: .5}),
        font(['Dosis'])
    ]).then((resources) => {
        return {
            images: resources.slice(0, 4),
            sounds: resources.slice(4, 7)
        };
    });
}

export default load;
export {image, audio};
