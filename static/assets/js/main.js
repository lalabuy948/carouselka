class Carousel {
  constructor(cont) {
    cont = cont || document.body
    this.cont = cont;
    this.imgs = []
    this.points = []
    this.imgId = 0
    this.contImg = document.createElement('div')
    this.enableEventWeel = true
  }
  getImages(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', url, true);

      xhr.onload = () => {
        this.imgs = JSON.parse(xhr.responseText).map(el => el.url)
        console.log("Recived " + this.imgs.length + " images.");
        // console.log(this.imgs);
        resolve()
      }

      xhr.onerror = function() {
        console.log('Error, ups something went wrong...' + this.status);
        reject()
      }

      xhr.send();
    });
  }

  createElements() {
    let cont = document.createElement('div')
    cont.classList.add("contK");

    let navL = document.createElement('div')
    navL.classList.add("navL");
    navL.innerHTML = '<';

    let navR = document.createElement('div')
    navR.classList.add("navR");
    navR.innerHTML = '>';

    let nav = document.createElement('div')
    nav.classList.add("nav");

    this.contImg.classList.add("contImg");
    // console.log(this.imgs);

    this.imgs.forEach((url, i) => {
      let point = document.createElement('div')
      point.classList.add("point");
      if (!i) {
        this.appendImg(this.imgs.length - 1)
        point.classList.add("active");
      }

      if (i < 2) {
        this.appendImg(i)
      }

      nav.appendChild(point)
      point.addEventListener('click', () => {
        // console.log('test');
        this.goToItem(i)
      })
      this.points.push(point)
    })

    cont.appendChild(this.contImg);
    cont.appendChild(navL);
    cont.appendChild(navR);
    cont.appendChild(nav);

    this.cont.appendChild(cont);

    this.navR = navR
    this.navL = navL
    this.nav = nav
  }

  appendImg(id) {
    let img = document.createElement('img')
    img.src = this.imgs[id]
    this.contImg.appendChild(img)
  }

  getTrueId(id) {
    if (id < 0) {
      // console.log(id % this.imgs.length - 1);
      return this.imgs.length + (id % this.imgs.length - 1)
    } else {
      return id % this.imgs.length
    }
  }

  preAppendImg(id) {
    let img = document.createElement('img')
    if (id < 0) {
      img.src = this.imgs[this.imgs.length + id]
    } else {
      img.src = this.imgs[id]
    }
    this.contImg.insertBefore(img, this.contImg.firstChild)
  }

  nextItem() {
    // console.log(this.contImg.children);
    this.contImg.children[0].remove()
    this.nav.children[this.getTrueId(this.imgId)].classList.remove("active");
    this.imgId++;
    this.nav.children[this.getTrueId(this.imgId)].classList.add("active");
    this.contImg
    this.appendImg(this.getTrueId(this.imgId + 1))
  }

  previousItem() {
    // console.log(this.contImg.children);
    this.contImg.children[2].remove()
    this.nav.children[this.getTrueId(this.imgId)].classList.remove("active");
    this.imgId -= 1;
    this.nav.children[this.getTrueId(this.imgId)].classList.add("active");
    this.contImg
    this.preAppendImg(this.getTrueId(this.imgId - 1))
  }

  goToItem(id) {
    (async () => {
      this.nav.children[this.getTrueId(this.imgId)].classList.remove("active");
      this.imgId = id;
      this.nav.children[this.getTrueId(this.imgId)].classList.add("active");
      this.contImg.children[0].remove()
      this.appendImg(this.getTrueId(id - 1))
      this.contImg.children[0].remove()
      this.appendImg(this.getTrueId(id))
      this.contImg.children[0].remove()
      this.appendImg(this.getTrueId(id + 1))
    })()
  }

  enableEvents() {
    // on click on right arrow call nextItem func
    this.navR.addEventListener("click", async (e) => {
        // console.log(e);
        this.nextItem()
    })
    // on click on left arrow call previousItem func
    this.navL.addEventListener("click", async (e) => {
        // console.log(e);
        this.previousItem()
    })
    // Handle wheel activiti to scroll the images
    this.contImg.addEventListener('wheel', async (e) => {
      // console.log(e.deltaY)
      if (this.enableEventWeel) {
        this.enableEventWeel = false
        if (e.deltaY < 0) {
          this.nextItem()
        } else if (e.deltaY > 0) {
          this.previousItem()
        }
        await delay(1000)
        this.enableEventWeel = true
      }
    })
    // Handle "drag and drop" function for swiping images
    this.contImg.addEventListener('mousedown', async (e) => {
      this.contImg.style.transition = ''
      this.screenX = e.screenX
      this.md = true
    })
    this.contImg.addEventListener('mouseup', async (e) => {
      if (e.screenX - this.screenX > 100) {
        this.previousItem()
      }
      if (e.screenX - this.screenX < -100) {
        this.nextItem()
      }
      this.contImg.style.transition = '0.4s'
      this.contImg.style.left = 0 + 'px'
      this.md = false
    })
    this.contImg.addEventListener('mousemove', async (e) => {
      if (this.md) {
        this.contImg.style.left = e.screenX - this.screenX + 'px'
      }
    })

    // Handle touch events
    this.contImg.addEventListener('touchstart', async (e) => {
      this.contImg.style.transition = ''
      this.screenX = e.screenX
      this.md = true
    })
    this.contImg.addEventListener('touchend', async (e) => {
      if (e.screenX - this.screenX > 100) {
        this.previousItem()
      }
      if (e.screenX - this.screenX < -100) {
        this.nextItem()
      }
      this.contImg.style.transition = '0.4s'
      this.contImg.style.left = 0 + 'px'
      this.md = false
    })
    this.contImg.addEventListener('touchmove', async (e) => {
      if (this.md) {
        this.contImg.style.left = e.screenX - this.screenX + 'px'
      }
    })
  }

}

function delay(time) {
  return new Promise(function(resolve) {
    setInterval(function() {
      resolve();
    }, time);
  });
}

function touchHandler(event) {
    let touches = event.changedTouches;
    let  type = "";
    switch(event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;
        case "touchend":   type = "mouseup";   break;
        default:           return;
    }

    // initMouseEvent(type, canBubble, cancelable, view, clickCount,
    //                screenX, screenY, clientX, clientY, ctrlKey,
    //                altKey, shiftKey, metaKey, button, relatedTarget);

    let simulatedEvent = document.createEvent("MouseEvent");
    let first = touches[0];
    simulatedEvent.initMouseEvent(
      type, true, true, window, 1,
      first.screenX, first.screenY,
      first.clientX, first.clientY, false,
      false, false, false, 0/*left*/, null
    );

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}

(async () => {
  init()

  carousel = new Carousel(document.querySelector('.cont'))
  carousel2 = new Carousel(document.querySelector('.cont'))
  carousel3 = new Carousel(document.querySelector('.cont'))
  let prom = []
  prom.push(carousel.getImages('/getImages'))
  prom.push(carousel2.getImages('/getImages'))
  prom.push(carousel3.getImages('/getImages'))
  await Promise.all(prom)

  carousel.createElements()
  carousel2.createElements()
  carousel2.enableEvents()
  carousel3.createElements()
  await delay(1000)
  carousel.nextItem()
  await delay(1000)
  carousel.nextItem()
  await delay(1000)
  carousel.nextItem()
  await delay(1000)
  carousel.nextItem()
  await delay(1000)
  carousel.previousItem()
  await delay(1000)
  carousel.previousItem()
  await delay(1000)
  carousel.previousItem()
  await delay(1000)
  carousel.previousItem()
  await delay(1000)
  carousel.goToItem(3)
  await delay(1000)
  carousel.goToItem(5)
  await delay(1000)
  carousel.goToItem(1)
})()
