import type { BuildRouteHandler } from '@remix-run/fetch-router'
import { html } from '@remix-run/html-template'
import * as res from '@remix-run/fetch-router/response-helpers'

import type { routes } from '../routes.ts'
import * as data from '../data'
import * as templates from '../templates'

export let home: BuildRouteHandler<'GET', typeof routes.home> = ({ session }) => {
  let posts = data.getPosts()
  let currentUser = session.get('username') as string | undefined

  return res.html(
    templates.layout(
      html`
        <h1>Blog Posts</h1>
        ${posts.map(templates.postListItem)}
      `,
      currentUser,
    ),
  )
}
