import type { RouteHandlers } from '@remix-run/fetch-router'
import { html } from '@remix-run/html-template'
import * as res from '@remix-run/fetch-router/response-helpers'

import { routes } from '../routes'
import type { Post } from '../data'
import * as data from '../data'
import * as templates from '../templates'
import { generateSlug, getPostHrefParams, loginUrl } from '../utils'

function postForm(post?: Post) {
  let action = post ? routes.posts.update.href(getPostHrefParams(post)) : routes.posts.create.href()
  let heading = post ? 'Edit Post' : 'New Post'

  return html`
    <h1>${heading}</h1>
    <form method="POST" action="${action}">
      ${post ? html`<input type="hidden" name="_method" value="PUT" />` : null}
      <div>
        <label for="title">Title</label>
        <input type="text" id="title" name="title" value="${post?.title}" required />
      </div>
      <div>
        <label for="content">Content</label>
        <textarea id="content" name="content" rows="10" required>${post?.content}</textarea>
      </div>
      <button type="submit">${post ? 'Update' : 'Create'} Post</button>
    </form>
    <p>
      <a href="${routes.posts.index.href()}">← Back to Posts</a>
    </p>
  `
}

export let posts = {
  index({ session }) {
    let posts = data.getPosts()
    let currentUser = session.get('username') as string | undefined

    return res.html(
      templates.layout(
        html`
          <h1>All Posts</h1>
          <p><a href="${routes.posts.new.href()}">Create New Post</a></p>
          ${posts.map(templates.postListItem)}
        `,
        currentUser,
      ),
    )
  },
  new({ session }) {
    let currentUser = session.get('username') as string | undefined
    return res.html(templates.layout(postForm(), currentUser))
  },
  create({ formData }) {
    let title = formData.get('title') as string
    let content = formData.get('content') as string

    if (!title || !content) {
      return res.html(templates.layout(postForm()), { status: 400 })
    }

    let post = data.createPost(title, content)
    return res.redirect(routes.posts.show.href(getPostHrefParams(post)))
  },
  show({ params, session }) {
    let post = data.getPost(params.slug)
    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    let comments = data.getComments(params.slug)
    let currentUser = session.get('username') as string | undefined

    let postUrl = routes.posts.show.href(getPostHrefParams(post))

    return res.html(
      templates.layout(
        html`
          <article>
            <h1>${post.title}</h1>
            <header>
              <a href="${routes.posts.index.href()}">← Back to Posts</a>
              <a href="${routes.posts.edit.href(getPostHrefParams(post))}">Edit Post</a>
              <form method="POST" action="${routes.posts.destroy.href(getPostHrefParams(post))}">
                <input type="hidden" name="_method" value="DELETE" />
                <button type="submit">Delete Post</button>
              </form>
            </header>
            <div>${post.content}</div>
            <footer>
              <small>Posted on ${post.createdAt.toLocaleDateString()}</small>
              ${post.updatedAt.getTime() !== post.createdAt.getTime()
                ? html`<small>Updated on ${post.updatedAt.toLocaleDateString()}</small>`
                : null}
            </footer>
          </article>
          <section>
            <h2>Comments</h2>
            ${comments.length > 0
              ? comments.map((comment) => {
                  let isCommentAuthor = currentUser && currentUser === comment.author
                  return html`
                    <article>
                      <header>
                        <strong>${comment.author}</strong>
                        <small>${comment.createdAt.toLocaleDateString()}</small>
                      </header>
                      <p>${comment.content}</p>
                      ${isCommentAuthor
                        ? html`
                            <form
                              method="POST"
                              action="${routes.posts.comment.destroy.href({
                                ...getPostHrefParams(post),
                                commentId: comment.id,
                              })}"
                            >
                              <input type="hidden" name="_method" value="DELETE" />
                              <button type="submit">Delete</button>
                            </form>
                          `
                        : null}
                    </article>
                  `
                })
              : html`<p>No comments yet.</p>`}
            ${currentUser
              ? html`
                  <form
                    method="POST"
                    action="${routes.posts.comment.create.href(getPostHrefParams(post))}"
                  >
                    <h3>Add a Comment</h3>
                    <div>
                      <textarea name="content" rows="4" required></textarea>
                    </div>
                    <button type="submit">Post Comment</button>
                  </form>
                `
              : html`<p><a href="${loginUrl(postUrl)}">Login</a> to add a comment.</p>`}
          </section>
        `,
        currentUser,
      ),
    )
  },
  edit({ params, session }) {
    let post = data.getPost(params.slug)
    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    let currentUser = session.get('username') as string | undefined
    return res.html(templates.layout(postForm(post), currentUser))
  },
  update({ params, formData }) {
    let post = data.getPost(params.slug)
    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    let title = formData.get('title') as string
    let content = formData.get('content') as string

    if (!title || !content) {
      return res.html(templates.layout(postForm(post)), { status: 400 })
    }

    let updatedPost = data.updatePost(params.slug, title, content)
    if (!updatedPost) {
      return new Response('Post not found', { status: 404 })
    }
    let newSlug = generateSlug(title)
    let finalPost = data.getPost(newSlug) ?? updatedPost
    return res.redirect(routes.posts.show.href(getPostHrefParams(finalPost)))
  },
  destroy({ params }) {
    let post = data.getPost(params.slug)
    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    data.deletePost(params.slug)
    return res.redirect(routes.posts.index.href())
  },
} satisfies RouteHandlers<Omit<typeof routes.posts, 'comment'>>
