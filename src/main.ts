const keys = {
  left: { pressed: false },
  right: { pressed: false }
}
import platformBg from "./assets/platform.png"
import platformSmallBg from "./assets/platformSmallTall.png"
import backgroundBg from "./assets/background.png"
import hills from "./assets/hills.png"

const canvas = document.querySelector("canvas")!
const c = canvas.getContext("2d")!

// canvas.width = 1280
// canvas.height = 720;
canvas.width = 1024
canvas.height = 576;
const gravity = 0.5

function createImage(imageSrc: string) {
  const image = new Image()
  image.src = imageSrc
  return image
}


class Player {
  position: { x: number; y: number; };
  velocity: { x: number; y: number; };
  height: number;
  width: number;
  speed = 5

  constructor() {
    this.position = {
      x: 100,
      y: 300
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.height = 30;
    this.width = 30
  }

  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if ((this.position.y + this.height + this.velocity.y) <= canvas.height) {
      this.velocity.y += gravity
    } else {
      // this.velocity.y = 0
    }
  }
}

class Platform {
  position: { x: number; y: number };
  height: number;
  width: number;
  image: CanvasImageSource;
  constructor({ x, y, image }: { x: number; y: number; image: HTMLImageElement }) {
    this.position = { x, y }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}
class GenericObject {
  position: { x: number; y: number };
  height: number;
  width: number;
  image: CanvasImageSource;
  constructor({ x, y, image }: { x: number; y: number; image: HTMLImageElement }) {
    this.position = { x, y }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}


const player = new Player();
const platforms = [
  new Platform({ x: -1, y: 452, image: createImage(platformBg) }),
  new Platform({
    x: createImage(platformBg).width - 3, y: 452, image: createImage(platformBg)
  }),
  new Platform({
    x: createImage(platformBg).width * 2 + 100, y: 452, image: createImage(platformBg)
  }),
  new Platform({
    x: createImage(platformBg).width * 3 + 200, y: 452, image: createImage(platformBg)
  }),
  new Platform({
    x: createImage(platformBg).width * 3 + 490, y: 452 - createImage(platformSmallBg).height, image: createImage(platformSmallBg)
  }),
  new Platform({
    x: createImage(platformBg).width * 4 + 600, y: 452, image: createImage(platformBg)
  }),
]
const objects = [
  new GenericObject({ x: -1, y: -1, image: createImage(backgroundBg) }),
  new GenericObject({ x: -1, y: -1, image: createImage(hills) }),
]

let scrollOffset = 0
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  objects.forEach(object => {
    object.draw()
  })
  platforms.forEach(platform => {
    platform.draw()
  })
  player.update()

  if (keys.left.pressed && player.position.x >= 80) {
    player.velocity.x = -player.speed
  } else if (keys.right.pressed && player.position.x <= (canvas.width / 2)) {
    player.velocity.x = player.speed
  } else {
    player.velocity.x = 0

    if (keys.left.pressed) {
      scrollOffset -= player.speed;
      objects.forEach(object => {
        object.position.x += player.speed * 0.66
      })
      if (scrollOffset !== 0) {
        platforms.forEach(platform => {
          platform.position.x += player.speed
        })
      }

    } else if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach(platform => {
        platform.position.x -= player.speed
      })
      objects.forEach(object => {
        object.position.x -= player.speed * 0.66
      })
    }
  }

  platforms.forEach(platform => {
    if (((player.position.y + player.height) <= platform.position.y)
      && player.position.y + player.height + player.velocity.y >= platform.position.y
      && player.position.x + player.width >= platform.position.x
      && player.position.x <= (platform.position.x + platform.width)
    ) {
      player.velocity.y = 0
    }
  })
  console.log(scrollOffset)
  if (scrollOffset >= 1000) {
    console.log("You Win 🥂🎉")
  }

  if (player.position.y >= canvas.height) {
    console.log("You Loose 😭")
  }

}

animate()

addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === 'w') {
    player.velocity.y -= 12
  }

  if (event.key.toLowerCase() === 'd') {
    keys.right.pressed = true
  }
  if (event.key.toLowerCase() === 'a') {
    keys.left.pressed = true
  }
})
addEventListener("keyup", (event) => {
  if (event.key.toLowerCase() === 'd') {
    keys.right.pressed = false
  }
  if (event.key.toLowerCase() === 'a') {
    keys.left.pressed = false
  }
})






