This is a demo of a Remix 3 application running on Cloudflare Workers.

TODO: rework all of this, just messy notes for now

This is for Austin JS Meetup

Here's the abstract:

Last month at Remix Jam the co-creators of Remix and React Router shared an early glimpse of Remix 3: a full stack JavaScript framework built on web standards. If you've followed the Remix story at all up to this point, you're probably wondering 2 things:

1. Wasn't Remix 0.x-2.x also a full stack JavaScript framework built on web standards?,
2. Didn't they kill Remix with React Router 7?,

In this talk Brooks is going to answer "yes, but also no" to both of those questions while showing you around the Remix 3 landscape.

## The pieces

3 main files

- `server.ts` -- The server for handling requests/responses
  - `createRequestListener`
  - `router.fetch`
- `routes.ts` -- The route definitions
  - `route`
  - `formAction` -- helper for an `index` and `action`
  - `resources` -- helper to create various typical CRUD endpoints
- `router.ts`
  - global middleware
    - `logger()` -- simple logging
    - `formData()` -- automatically that parses `FormData` from the request body and populates `context.formData`
    - `methodOverride()` -- overrides context.method with the value of the method override field (this is my favorite middleware, and it's so simple what it's doing)
    - `session` -- manages `context.session` based on the session cookie.

`html` from `@remix-run/html-template` is necessary for escaping html and ensuring we prevent XSS

## The Story

Start with blank worker example:

```ts
export default {
  async fetch(request, env, ctx): Promise<Response> {
    return new Response('Hello World')
  },
} satisfies ExportedHandler<Env>
```

Create some routes with `route`

Create a router with `createRouter` and map the routes to the router with `router.map`

Use `router.fetch` in the fetch handler

Split up the logic into other files
