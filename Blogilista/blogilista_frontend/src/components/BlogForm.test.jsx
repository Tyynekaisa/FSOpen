import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(
    <MemoryRouter>
      <BlogForm createBlog={createBlog} />
    </MemoryRouter>,
  )

  const title = screen.getByRole('textbox', { name: 'Otsikko' })
  const author = screen.getByRole('textbox', { name: 'Kirjoittaja' })
  const url = screen.getByRole('textbox', { name: 'Url' })
  const sendButton = screen.getByRole('button', { name: 'Tallenna' })

  await user.type(title, 'Lomakkeen testausta')
  await user.type(author, 'Kaisa')
  await user.type(
    url,
    'https://fullstackopen.com/osa5/react_sovellusten_testaaminen#lomakkeiden-testaus',
  )
  await user.click(sendButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Lomakkeen testausta',
    author: 'Kaisa',
    url: 'https://fullstackopen.com/osa5/react_sovellusten_testaaminen#lomakkeiden-testaus',
  })
})
