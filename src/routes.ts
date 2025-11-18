import { route } from '@remix-run/fetch-router'

export let routes = route({
  home: '/',
  about: '/about',
  contact: '/contact',
})
