import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, requestDeleteBlog, requestUpdateBlog, user }) => {
  const [detailView, setDetailView] = useState(false);

  const showWhenDetailView = {
    display: detailView ? '' : 'none',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  const hideWhenDetailView = {
    display: detailView ? 'none' : '',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleDetailView = () => {
    setDetailView(!detailView);
  };

  const onDeleteRequest = () => {
    requestDeleteBlog(blog);
  };

  const onUpdateRequest = () => {
    requestUpdateBlog(blog, {
      title: blog.title,
      author: blog.author,
      likes: blog.likes + 1,
      url: blog.url,
    });
  };

  return (
    <div className="blogItem">
      <div style={hideWhenDetailView} className="simple">
        {blog.title} {blog.author}
        <button onClick={toggleDetailView}>view</button>
      </div>
      <div style={showWhenDetailView} className="detail">
        <div>
          {blog.title}
          <button onClick={toggleDetailView}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div className="like" data-testid="like">
          {blog.likes} <button onClick={onUpdateRequest}>like</button>
        </div>
        <div>{blog.author}</div>
        {blog.user.username === user.username ? (
          <button onClick={onDeleteRequest}>remove</button>
        ) : null}
      </div>
    </div>
  );
};

Blog.propTypes = {
  requestDeleteBlog: PropTypes.func.isRequired,
  requestUpdateBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
};

export default Blog;
