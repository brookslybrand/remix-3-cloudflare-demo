# Talk Notes

## Abstract

**Austin JS Meetup**

Last month at Remix Jam the co-creators of Remix and React Router shared an early glimpse of Remix 3: a full stack JavaScript framework built on web standards. If you've followed the Remix story at all up to this point, you're probably wondering 2 things:

1. Wasn't Remix 0.x-2.x also a full stack JavaScript framework built on web standards?
2. Didn't they kill Remix with React Router 7?

In this talk Brooks is going to answer "yes, but also no" to both of those questions while showing you around the Remix 3 landscape.

## The Walkthrough

### Starting Point

Start with blank worker example:

```ts
export default {
  async fetch(request, env, ctx): Promise<Response> {
    return new Response('Hello World')
  },
} satisfies ExportedHandler<Env>
```

### Routing

Create a route definition in `routes.ts` with `route`, `formAction`, and `resources`

Final shape is:

```ts
export let routes = route({
  home: '/',
  login: formAction('/login'),
  logout: { method: 'POST', pattern: '/logout' },
  posts: {
    ...resources('posts', { only: ['index', 'new', 'create'] }),
    ...resource('/posts/:year-:month-:day/:slug', {
      only: ['show', 'edit', 'update', 'destroy'],
    }),
    comment: resources('/posts/:year-:month-:day/:slug/comment', {
      only: ['create', 'destroy'],
      param: 'commentId',
    }),
  },
})
```

### Handlers

Create a fetch router in `router.ts` with `createRouter`

Wire it up to `worker.ts` with `router.fetch`

Add middleware:

- logger()
- formData()
- methodOverride()
- session(cookie, storage)

Setup session middleware and login/logout routes

### Interactions

Put the script in `post.ts`

```html
<script type="module" src="/interactions.js"></script>
```

Add:

- click -- prevent default
- pressDown -- createCircle
- longPress -- popCircle
- pressUp, pointerleave, pressCancel -- cleanup
