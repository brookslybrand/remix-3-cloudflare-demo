import { on } from 'https://unpkg.com/@remix-run/interaction@0.2.0/dist/index.js'
import {
  longPress,
  pressDown,
  pressUp,
  pressCancel,
} from 'https://unpkg.com/@remix-run/interaction@0.2.0/press'

let circles = new WeakMap()
let timers = new WeakMap()

function cleanup(element) {
  let circle = circles.get(element)
  if (circle) {
    circle.remove()
    circles.delete(element)
  }
  let timer = timers.get(element)
  if (timer) {
    clearTimeout(timer)
    timers.delete(element)
  }
}

function createCircle(element, event, color = 'rgba(220, 53, 69, 0.2)') {
  let rect = element.getBoundingClientRect()
  let x = (event.clientX || rect.left + rect.width / 2) - rect.left
  let y = (event.clientY || rect.top + rect.height / 2) - rect.top

  cleanup(element)

  let circle = document.createElement('div')
  circle.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: ${color};
    border: 2px solid ${color.replace('0.2', '0.5')};
    pointer-events: none;
    z-index: 10;
    transform: translate(-50%, -50%);
    transition: width 0.5s ease-out, height 0.5s ease-out;
  `
  element.appendChild(circle)
  circles.set(element, circle)

  requestAnimationFrame(() => {
    if (circles.get(element) === circle) {
      circle.style.width = '120px'
      circle.style.height = '120px'
    }
  })
}

function popCircle(element, onComplete) {
  let circle = circles.get(element)
  if (!circle) {
    onComplete?.()
    return
  }

  circle.style.transition =
    'transform 0.15s ease-out, opacity 0.15s ease-out, background 0.1s ease-out, border-color 0.1s ease-out'
  circle.style.transform = 'translate(-50%, -50%) scale(2.5)'
  circle.style.background = 'rgba(220, 53, 69, 0.8)'
  circle.style.borderColor = 'rgba(220, 53, 69, 0.8)'
  circle.style.opacity = '0'

  let timer = setTimeout(() => {
    cleanup(element)
    onComplete?.()
  }, 200)
  timers.set(element, timer)
}

function setupLongPressDelete() {
  document.querySelectorAll('button[data-delete-form]').forEach((button) => {
    button.style.position = 'relative'

    on(button, {
      click: (e) => {
        e.preventDefault()
      },
      [pressDown]: (e) => {
        createCircle(button, e)
      },
      [longPress]: (e) => {
        e.preventDefault()
        popCircle(button, () => {
          let form = button.closest('form')
          form?.requestSubmit()
        })
      },
      [pressUp]: () => {
        cleanup(button)
      },
      pointerleave: () => {
        cleanup(button)
      },
      [pressCancel]: () => {
        cleanup(button)
      },
    })
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLongPressDelete)
} else {
  setupLongPressDelete()
}
