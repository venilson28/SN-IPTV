const carousel = document.getElementById('carousel')

let position = 0
let speed = 0.6 // controle da suavidade

function animate() {

    position += speed

    // reset quando chega no final
    if (position >= carousel.scrollWidth - carousel.clientWidth) {
        position = 0
    }

    carousel.scrollLeft = position

    requestAnimationFrame(animate)
}

animate()