function colliding(rect1, rect2){
    const x1 = parseInt(rect1.x, 10);
    const y1 = parseInt(rect1.y, 10);
    const w1 = parseInt(rect1.width, 10);
    const h1 = parseInt(rect1.height, 10);
    const x2 = parseInt(rect2.x, 10);
    const y2 = parseInt(rect2.y, 10);
    const w2 = parseInt(rect2.width, 10);

    return (
        x1 + w1 > x2 && y1 + h1 > y2 && x1 < x2 + w2
    );
}

export default colliding;
