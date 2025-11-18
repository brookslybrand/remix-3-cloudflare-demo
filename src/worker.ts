import { router } from './router'

export default {
  async fetch(request, _env, _ctx): Promise<Response> {
    try {
      return router.fetch(request)
    } catch (error) {
      console.error(error)
      return new Response('Internal Server Error', { status: 500 })
    }
  },
} satisfies ExportedHandler<Env>
