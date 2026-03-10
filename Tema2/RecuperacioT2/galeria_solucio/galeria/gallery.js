// h) gallery.js refactoritzat a ES6 — classe CanvasGallery
export class CanvasGallery {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx    = this.canvas.getContext('2d');
        this.img    = new Image();
        this.img.crossOrigin = 'anonymous';
        this.img.id = 'featuredimage';
        this.img.onload = () => this._resizeImage();
        this.img.src = 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg';
    }

    _resizeImage() {
        this.canvas.width  = 400;
        this.canvas.height = 300;
        const sizer = Math.min(
            this.canvas.width  / this.img.width,
            this.canvas.height / this.img.height
        );
        this.ctx.drawImage(this.img, 0, 0,
            this.img.width, this.img.height,
            0, 0,
            this.img.width * sizer, this.img.height * sizer
        );
    }

    setImage(url) {
        this.img.src = url;
        this.img.onload = () => this._resizeImage();
    }

    original()   { this._resizeImage(); }

    grayscale() {
        this._resizeImage();
        const id = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < id.data.length; i += 4) {
            const avg = (id.data[i] + id.data[i+1] + id.data[i+2]) / 3;
            id.data[i] = id.data[i+1] = id.data[i+2] = avg;
        }
        this.ctx.putImageData(id, 0, 0);
    }

    invert() {
        this._resizeImage();
        const id = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < id.data.length; i += 4) {
            id.data[i]   = 255 - id.data[i];
            id.data[i+1] = 255 - id.data[i+1];
            id.data[i+2] = 255 - id.data[i+2];
        }
        this.ctx.putImageData(id, 0, 0);
    }

    sepia() {
        this._resizeImage();
        const id = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < id.data.length; i += 4) {
            const r = id.data[i], g = id.data[i+1], b = id.data[i+2];
            id.data[i]   = Math.min(Math.round(0.393*r + 0.769*g + 0.189*b), 255);
            id.data[i+1] = Math.min(Math.round(0.349*r + 0.686*g + 0.168*b), 255);
            id.data[i+2] = Math.min(Math.round(0.272*r + 0.534*g + 0.131*b), 255);
        }
        this.ctx.putImageData(id, 0, 0);
    }
}
