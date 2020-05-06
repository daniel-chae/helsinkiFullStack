import React, { useState } from 'react';

const Blogform = ({ submitNewBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const submitBlogToParent = (event) => {
    event.preventDefault();
    submitNewBlog({ title, author, url });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={submitBlogToParent}>
      <div>
        <label htmlFor="title-input">
          title:
          <input
            type="text"
            name="Title"
            value={title}
            onChange={({ target }) => {
              setTitle(target.value);
            }}
          />
        </label>
      </div>
      <div>
        <label htmlFor="author-input">
          author:
          <input
            type="text"
            name="Author"
            value={author}
            onChange={({ target }) => {
              setAuthor(target.value);
            }}
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type="text"
            name="Url"
            value={url}
            onChange={({ target }) => {
              setUrl(target.value);
            }}
          />
        </label>
      </div>

      <button type="submit">create</button>
    </form>
  );
};

export default Blogform;
