export function initDraw(canvas: HTMLCanvasElement) {
    // get the context
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return;
    }

    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // startX endY width height
    // ctx.strokeRect(25,25,100,100)

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        startY = e.clientY;

        clicked = true;
    })

    canvas.addEventListener("mouseup", (e) => {
        clicked = false
    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(0, 0, 0)"
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(startX, startY, width, height)
        }
    })
}