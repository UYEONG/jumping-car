import babel from 'rollup-plugin-babel';

export default {
    entry: 'game.js',
    dest: 'dist/bundle.js',
    format: 'umd',
    plugins: [
        babel()
    ]
};
