const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const blogCounts = lodash.countBy(blogs, 'author')
  const maxBlogs = lodash.max(lodash.values(blogCounts))
  const authorWithMostBlogs = lodash.findKey(blogCounts, (count) => count === maxBlogs)
  return {
    author: authorWithMostBlogs,
    blogs: maxBlogs,
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const likesByAuthor = lodash.groupBy(blogs, 'author')
  const totalLikesByAuthor = lodash.mapValues(likesByAuthor, (authorBlogs) => {
    return lodash.sumBy(authorBlogs, 'likes')
  })
  const maxLikes = lodash.max(lodash.values(totalLikesByAuthor))
  const authorWithMostLikes = lodash.findKey(totalLikesByAuthor, (likes) => likes === maxLikes)
  return {
    author: authorWithMostLikes,
    likes: maxLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
