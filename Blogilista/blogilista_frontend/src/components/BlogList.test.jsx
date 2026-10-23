import { render, screen } from '@testing-library/react'
import BlogList from './BlogList'

describe('<BlogList />', () => {
  const blog = {
    title: 'React sovellusten testaaminen',
    author: 'Kaisa',
    url: 'https://fullstackopen.com/osa5/react_sovellusten_testaaminen',
    likes: 7,
  }

  test('renders author and title', () => {
    render(<BlogList blogs={[blog]} />)
    const title = screen.getByText('React sovellusten testaaminen')
    const author = screen.queryByText('Kaisa')
    const url = screen.queryByRole('link', {
      name: 'https://fullstackopen.com/osa5/react_sovellusten_testaaminen',
    })
    const likes = screen.queryByText('Tykkäyksiä: 7')

    // screen.debug()

    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  // test('renders url, author and likes when expanded', async () => {
  //   render(<BlogList blogs={[blog]} />)
  //   const user = userEvent.setup()
  //   const button = screen.getByText('Näytä tiedot')
  //   await user.click(button)

  //   const title = screen.getByText('React sovellusten testaaminen', {
  //     exact: false,
  //   })
  //   const author = screen.getByText('Kaisa', { exact: false })
  //   const url = screen.getByText(
  //     'https://fullstackopen.com/osa5/react_sovellusten_testaaminen',
  //     {
  //       exact: false,
  //     },
  //   )
  //   const likes = screen.getByText('7', { exact: false })

  //   expect(title).toBeDefined()
  //   expect(author).toBeDefined()
  //   expect(url).toBeDefined()
  //   expect(likes).toBeDefined()
  // })
})
