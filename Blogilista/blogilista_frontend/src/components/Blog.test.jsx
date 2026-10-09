import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'React sovellusten testaaminen',
    author: 'Kaisa',
    url: 'https://fullstackopen.com/osa5/react_sovellusten_testaaminen',
    likes: 7,
  }
  test('renders title', () => {
    render(<Blog blog={blog} />)

    const title = screen.getByText('React sovellusten testaaminen', {
      exact: false,
    })
    expect(title).toBeDefined()
  })

  test('renders url, author and likes', async () => {
    render(<Blog blog={blog} />)

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
})
