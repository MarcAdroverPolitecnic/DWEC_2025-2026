// Ex e) - clock.js transformat en classe ES6
export class ClockRenderer {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx    = this.canvas.getContext("2d");
        this.radius = this.canvas.height / 2;
        this.ctx.translate(this.radius, this.radius);
        this.radius = this.radius * 0.90;
    }

    draw() {
        this.ctx.font = this.radius * 0.25 + "px 'Butterfly Kids', cursive";
        this._drawFace();
        this._drawNumbers();
        this._drawTime();
    }

    _drawFace() {
        const { ctx, radius } = this;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        const grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth   = radius * 0.1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    }

    _drawNumbers() {
        const { ctx, radius } = this;
        ctx.textBaseline = "middle";
        ctx.textAlign    = "center";
        for (let num = 1; num < 13; num++) {
            const ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }
    }

    _drawTime() {
        const { ctx, radius } = this;
        let hour   = parseInt(document.querySelector('#hours').value);
        let minute = parseInt(document.querySelector('#minutes').value);
        let second = parseInt(document.querySelector('#seconds').value);

        // Hora
        hour = hour % 12;
        hour = (hour   * Math.PI / 6) +
               (minute * Math.PI / (6 * 60)) +
               (second * Math.PI / (360 * 60));
        this._drawHand(hour, radius * 0.5, radius * 0.07);

        // Minut
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        this._drawHand(minute, radius * 0.8, radius * 0.07);

        // Segon
        second = (second * Math.PI / 30);
        this._drawHand(second, radius * 0.9, radius * 0.02);
    }

    _drawHand(pos, length, width) {
        const { ctx } = this;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap   = "round";
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }
}
