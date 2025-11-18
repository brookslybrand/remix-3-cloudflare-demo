# Talk Notes

## Abstract

**Austin JS Meetup**

Last month at Remix Jam the co-creators of Remix and React Router shared an early glimpse of Remix 3: a full stack JavaScript framework built on web standards. If you've followed the Remix story at all up to this point, you're probably wondering 2 things:

1. Wasn't Remix 0.x-2.x also a full stack JavaScript framework built on web standards?
2. Didn't they kill Remix with React Router 7?

In this talk Brooks is going to answer "yes, but also no" to both of those questions while showing you around the Remix 3 landscape.

## The Pieces

### Core Files

**3 main files:**

- `src/worker.ts` - The server for handling requests/responses
  - `createRequestListener`
  - `router.fetch`

- `src/routes.ts` - The route definitions
  - `route` - Route definition helper
  - `formAction` - Helper for an `index` and `action`
  - `resources` - Helper to create various typical CRUD endpoints

- `src/router.ts` - Router configuration
  - Global middleware
    - `logger()` - Simple logging
    - `formData()` - Automatically parses `FormData` from the request body and populates `context.formData`
    - `methodOverride()` - Overrides `context.method` with the value of the method override field (this is my favorite middleware, and it's so simple what it's doing)
    - `session` - Manages `context.session` based on the session cookie

### Important Details

- `html` from `@remix-run/html-template` is necessary for escaping HTML and ensuring we prevent XSS

## The Story / Narrative Flow

### Starting Point

Start with blank worker example:

```ts
export default {
  async fetch(request, env, ctx): Promise<Response> {
    return new Response('Hello World')
  },
} satisfies ExportedHandler<Env>
```

### Building Up

1. Create some routes with `route`
2. Create a router with `createRouter` and map the routes to the router with `router.map`
3. Use `router.fetch` in the fetch handler
4. Split up the logic into other files

### Things to Show

- Adding handlers
- Adding middleware
- Adding assets
