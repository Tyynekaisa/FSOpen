import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: 'blog-1',
    title: 'React sovellusten testaaminen',
    author: 'Kaisa',
    url: 'https://fullstackopen.com/osa5/react_sovellusten_testaaminen',
    likes: 7,
    user: { id: 'user-1', userName: 'alice', name: 'Alice' },
  }

  const renderBlog = (props = {}) =>
    render(
      <MemoryRouter>
        <Blog
          blog={blog}
          {...props}
        />
      </MemoryRouter>,
    )

  test('renders title', () => {
    renderBlog()

    const title = screen.getByText('React sovellusten testaaminen', {
      exact: false,
    })
    expect(title).toBeDefined()
  })

  test('renders url, author and likes', async () => {
    renderBlog()

    const title = screen.getByText('React sovellusten testaaminen', {
      exact: false,
    })
    const author = screen.getByText('Kaisa', { exact: false })
    const url = screen.getByText(
      'https://fullstackopen.com/osa5/react_sovellusten_testaaminen',
      {
        exact: false,
      },
    )
    const likes = screen.getByText('7', { exact: false })
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('shows blog details and likes but no buttons to a logged-out user', () => {
    renderBlog()

    expect(
      screen.getByText(/Kaisa: React sovellusten testaaminen/),
    ).toBeDefined()
    expect(screen.getByRole('link', { name: blog.url })).toBeDefined()
    expect(screen.getByText(/Tykkäyksiä: 7/)).toBeDefined()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  test('shows only the like button to a logged-in user who is not the creator', () => {
    renderBlog({
      user: { id: 'user-2', userName: 'bob', name: 'Bob' },
      likeBlog: () => {},
      deleteBlog: () => {},
    })

    expect(screen.getByRole('button', { name: 'Tykkää' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Poista blogi' })).toBeNull()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  test('shows the delete button to the blog creator as well as the like button', () => {
    renderBlog({
      user: { id: 'user-1', userName: 'alice', name: 'Alice' },
      likeBlog: () => {},
      deleteBlog: () => {},
    })

    expect(screen.getByRole('button', { name: 'Tykkää' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Poista blogi' })).toBeDefined()
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })
})
