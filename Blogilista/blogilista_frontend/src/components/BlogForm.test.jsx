import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByLabelText('Otsikko')
  const author = screen.getByLabelText('Kirjoittaja')
  const url = screen.getByLabelText('Url')
  const sendButton = screen.getByRole('button', { name: 'Tallenna' })

  await user.type(title, 'Lomakkeen testausta')
  await user.type(author, 'Kaisa')
  await user.type(
    url,
    'https://fullstackopen.com/osa5/react_sovellusten_testaaminen#lomakkeiden-testaus',
  )
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Lomakkeen testausta')
  expect(createBlog.mock.calls[0][0].author).toBe('Kaisa')
  expect(createBlog.mock.calls[0][0].url).toBe(
    'https://fullstackopen.com/osa5/react_sovellusten_testaaminen#lomakkeiden-testaus',
  )
})
