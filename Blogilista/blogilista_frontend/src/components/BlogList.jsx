// import Blog from './Blog'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link,
} from '@mui/material'
// import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <div className='blogList'>
      <Typography
        variant='h4'
        component='div'
      >
        Tervetuloa käyttämään blogilistaa
      </Typography>
      <TableContainer
        component={Paper}
        style={{ marginTop: 10 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Kirjoittaja</b>
              </TableCell>
              <TableCell>
                <b>Otsikko</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>{blog.author}</TableCell>
                <TableCell>
                  <Link
                    underline='none'
                    href={`/blogs/${blog.id}`}
                  >
                    {blog.title}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList
