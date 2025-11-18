import { html, type SafeHtml } from '@remix-run/html-template'

import type { Post } from './data'
import { routes } from './routes'
import { getPostHrefParams } from './utils'

export function layout(body: SafeHtml | string, currentUser?: string) {
  return html`
    <!doctype html>
    <html>
      <head>
        <title>Blog Demo</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <nav>
          <ul>
            <li><a href="${routes.home.href()}">Home</a></li>
            <li><a href="${routes.posts.index.href()}">Posts</a></li>
            <li><a href="${routes.posts.new.href()}">New Post</a></li>
          </ul>
          ${currentUser
            ? html`<ul>
                <li><span>${currentUser}</span></li>
                <li>
                  <form method="POST" action="${routes.logout.href()}">
                    <button type="submit">Logout</button>
                  </form>
                </li>
              </ul>`
            : html`<ul>
                <li><a href="${routes.login.index.href()}">Login</a></li>
              </ul>`}
        </nav>
        <main>${body}</main>
      </body>
    </html>
  `
}

export function postListItem(post: Post) {
  return html`
    <article>
      <h2>
        <a href="${routes.posts.show.href(getPostHrefParams(post))}">${post.title}</a>
      </h2>
      <p>${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : null}</p>
      <footer>
        <small>Posted on ${post.createdAt.toLocaleDateString()}</small>
      </footer>
    </article>
  `
}

export function redirectToInput(redirectTo: string | null): SafeHtml | null {
  return redirectTo ? html`<input type="hidden" name="redirectTo" value="${redirectTo}" />` : null
}
