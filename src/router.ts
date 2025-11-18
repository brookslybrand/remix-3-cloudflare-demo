import { createRouter } from '@remix-run/fetch-router'
import * as res from '@remix-run/fetch-router/response-helpers'

import { routes } from './routes'

export let router = createRouter()

let nav = `
  <nav>
    <a href="/">Home</a> |
    <a href="/about">About</a> |
    <a href="/contact">Contact</a>
  </nav>
`

router.map(routes, {
  home: () => res.html(`<html><body>${nav}<h1>Hello World!</h1></body></html>`),
  about: () => res.html(`<html><body>${nav}<h1>About Page</h1></body></html>`),
  contact: () => res.html(`<html><body>${nav}<h1>Contact Page</h1></body></html>`),
})
