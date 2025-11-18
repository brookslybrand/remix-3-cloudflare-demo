import { createCookie } from '@remix-run/cookie'
import { createRouter } from '@remix-run/fetch-router'
import { formData } from '@remix-run/fetch-router/form-data-middleware'
import { logger } from '@remix-run/fetch-router/logger-middleware'
import { methodOverride } from '@remix-run/fetch-router/method-override-middleware'
import { session } from '@remix-run/fetch-router/session-middleware'
import { staticFiles } from '@remix-run/fetch-router/static-middleware'
import { createCookieStorage } from '@remix-run/session/cookie-storage'

import { routes } from './routes'

import * as marketingHandlers from './handlers/marketing'
import * as authHandlers from './handlers/auth'
import * as postsHandlers from './handlers/posts'
import * as commentHandlers from './handlers/comment'

let cookie = createCookie('__sess', {
  secrets: ['s3cr3t'],
})
let storage = createCookieStorage()

export let router = createRouter({
  middleware: [
    logger(),
    formData(),
    methodOverride(),
    session(cookie, storage),
    // staticFiles('./public', {
    //   cacheControl: 'public, max-age=3600',
    //   etag: 'strong',
    // }),
  ],
})

router.map(routes.home, marketingHandlers.home)

router.map(routes.login, authHandlers.login)
router.post(routes.logout, authHandlers.logout)

router.map(routes.posts, {
  ...postsHandlers.posts,
  comment: commentHandlers.comment,
})
