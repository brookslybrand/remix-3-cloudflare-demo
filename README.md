# Remix 3 Cloudflare Demo

A demo application showcasing Remix 3 running on Cloudflare Workers.

## Getting Started

### Development

Run the development server:

```bash
pnpm dev
```

Open your browser at `http://localhost:8787/` to see your worker in action.

### Deployment

Deploy your worker to Cloudflare:

```bash
pnpm deploy
```

### Type Generation

After adding bindings to `wrangler.jsonc`, regenerate TypeScript types for the `Env` object:

```bash
pnpm cf-typegen
```

## Learn More

- [Remix 3 Repository](https://github.com/remix-run/remix)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
