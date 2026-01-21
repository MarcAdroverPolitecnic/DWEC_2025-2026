// view/CanvasView.js
export default class CanvasView {

    /**
     * Constructor: Prepara el canvas, el contexto 2D y la imagen vacía.
     * También inicia los "oídos" (listeners) para los botones de filtros.
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error("Canvas no trobat");
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.img = new Image();
        this.img.crossOrigin = 'anonymous'; // Necesario para manipular imágenes externas

        // Binding de eventos para los filtros (Radio buttons)
        this.initFilterListeners();
    }

    /**
     * Carga una imagen desde una URL.
     * Cuando termina de cargar, la dibuja automáticamente en modo original.
     */
    setImage(url) {
        this.img.src = url;
        this.img.onload = () => {
            this.renderOriginal(); // Al cargar, mostrar original
        };
    }

    // Lógica de redimensionado encapsulada
    resizeImage() {
        this.canvas.width = 400;
        this.canvas.height = 300;

        const w = this.img.width;
        const h = this.img.height;
        const sizer = Math.min(this.canvas.width / w, this.canvas.height / h);

        this.ctx.drawImage(this.img, 0, 0, w, h, 0, 0, w * sizer, h * sizer);
    }

    // Filtros
    renderOriginal() {
        this.resizeImage();
    }

    renderGrayscale() {
        this.resizeImage();
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    renderInvert() {
        this.resizeImage();
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];     // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    renderSepia() {
        this.resizeImage();
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let red = data[i], green = data[i + 1], blue = data[i + 2];
            data[i] = Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);
            data[i + 1] = Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
            data[i + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    /**
     * Configura los botones de radio (Original, Gris, etc.) para que
     * ejecuten el filtro correspondiente al hacer clic.
     * (Versión simplificada con if/else)
     */
    initFilterListeners() {
        // 1. Cogemos todos los botones de radio del grupo "color" a la vez
        const buttons = document.querySelectorAll('input[name="color"]');

        // 2. Recorremos cada botón para ponerle la "oreja" (listener)
        buttons.forEach(btn => {
            btn.addEventListener('change', () => {

                // 3. Comprobamos cuál se ha pulsado y llamamos a su función
                if (btn.id === 'original') {
                    this.renderOriginal();
                } else if (btn.id === 'grayscale') {
                    this.renderGrayscale();
                } else if (btn.id === 'inverted') {
                    this.renderInvert();
                } else if (btn.id === 'sepia') {
                    this.renderSepia();
                }
            });
        });
    }
}