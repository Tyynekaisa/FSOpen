import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogList from './BlogList'

// HUOM! Nämä testit eivät enää toimi

describe('<BlogList /> with togglable and buttons', () => {
  const blog = {
    title: 'React sovellusten testaaminen',
    author: 'Kaisa',
    url: 'https://fullstackopen.com/osa5/react_sovellusten_testaaminen',
    likes: 7,
  }

  test('renders only title when not expanded', () => {
    render(<BlogList blogs={[blog]} />)
    const title = screen.getByText('React sovellusten testaaminen')
    const author = screen.queryByText('Kaisa')
    const url = screen.queryByRole('link', {
      name: 'https://fullstackopen.com/osa5/react_sovellusten_testaaminen',
    })
    const likes = screen.queryByText('Tykkäyksiä: 7')

    // screen.debug()

    expect(title).toBeDefined()
    expect(author).toBeNull()
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('renders url, author and likes when expanded', async () => {
    render(<BlogList blogs={[blog]} />)
    const user = userEvent.setup()
    const button = screen.getByText('Näytä tiedot')
    await user.click(button)

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

  test('clicking the like button twice calls event handler twice', async () => {
    const mockHandler = vi.fn()
    render(
      <BlogList
        blogs={[blog]}
        onLike={mockHandler}
      />,
    )
    const user = userEvent.setup()
    const button = screen.getByText('Näytä tiedot')
    await user.click(button)

    const likeButton = screen.getByRole('button', { name: 'Tykkää' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
