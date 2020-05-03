const _ = require('lodash');

const dummy = (blogs) => 1;
const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);
const favoriteBlog = (blogs) => {
  const maxLike = blogs.reduce(
    (result, blog, idx) => {
      if (blog.likes >= result[0]) {
        return [blog.likes, idx];
      } else {
        return result;
      }
    },
    [Number.MIN_VALUE, null]
  );

  return blogs[maxLike[1]];
};

const mostBlogs = (blogs) => {
  const authorObj = _.countBy(blogs, 'author');
  const blogCount = Math.max(...Object.values(authorObj));
  const author = _.invert(authorObj)[blogCount];
  return { author, blogs: blogCount };
};

const mostLikes = (blogs) => {
  // Create an empty object
  const likesPerAuthor = {};

  // Add sum of like per each author
  blogs.forEach((blog) => {
    const author = blog.author;
    likesPerAuthor[author] = likesPerAuthor[author]
      ? (likesPerAuthor[author] += blog.likes)
      : blog.likes;
  });

  // Calculate most likes among all
  const mostLikes = Math.max(...Object.values(likesPerAuthor));

  // Find author with most likes
  const author = _.invert(likesPerAuthor)[mostLikes];
  return { author, likes: mostLikes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
