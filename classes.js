
const ratio = 48; // 48 is 3 * 16, our tiles are 16, at 300% when exported

class Boundary {
    static width = ratio;
    static height = ratio;
    constructor({position}) {
        this.position = position;
        this.width = ratio; 
        this.height = ratio;
    };

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    };
}

class Sprite {
    constructor({position, velocity, image, frames = { max: 1, hold: 10}, sprites }, animate = false) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0};

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height
        }
        this.animate = animate;
        this.sprites = sprites;
    };

    draw() {
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.width,
            this.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height,
        );
        // Return if not moving so we don't animate the character
        if (!this.animate) return

        if (this.frames.max > 1) this.frames.elapsed++;
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0;
        }
    };
};
