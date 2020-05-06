import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Blogform from './components/Blogform';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import blogUtils from './utils/blogUtils';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogUtils.sortBlogs(blogs));
    });
  }, []);

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = React.createRef();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedInUser', JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);

      setMessage({
        message: `Welcome ${user.username}. You are logged in!`,
        type: 'success',
      });
      setTimeout(() => {
        setMessage(null);
      }, 3000);

      setUsername('');
      setPassword('');
    } catch (exception) {
      setMessage({ message: 'wrong username or password', type: 'error' });

      setTimeout(() => {
        setMessage(null);
      }, 3000);

      setUsername('');
      setPassword('');
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);

    setMessage({
      message: 'You are logged out. See you next time!',
      type: 'success',
    });
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const submitNewBlog = async (input) => {
    try {
      blogFormRef.current.toggleVisible();
      const newBlog = await blogService.create(input);
      setBlogs(blogs.concat(newBlog));

      setMessage({
        message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        type: 'success',
      });
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (exception) {
      setMessage({ message: 'wrong credentials', type: 'error' });

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const requestDeleteBlog = async (blogToDelete) => {
    try {
      const confirm = window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
      );
      if (confirm) {
        await blogService.deleteBlog(blogToDelete.id);
        setBlogs(
          blogs.filter((blog) => (blog.id !== blogToDelete.id ? true : false))
        );
        setMessage({
          message: `${blogToDelete.title} by ${blogToDelete.author} is deleted`,
          type: 'success',
        });
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    } catch (err) {
      setMessage({ message: 'Deletion failed', type: 'error' });
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const requestUpdateBlog = async (blogToUpdate, newContent) => {
    try {
      const newBlog = await blogService.updateBlog(blogToUpdate.id, newContent);
      const newBlogs = blogs.map((blog) => {
        return blog.id !== newBlog.id ? blog : newBlog;
      });
      setBlogs(blogUtils.sortBlogs(newBlogs));
      setMessage({
        message: 'Blog updated successfully!',
        type: 'success',
      });
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (err) {
      setMessage({ message: 'Update failed', type: 'error' });
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const loginForm = () => (
    <div className="loginForm">
      <h2>Log in to application</h2>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <div>
          username{' '}
          <input
            type="text"
            value={username}
            name="Username"
            id="username"
            onChange={({ target }) => {
              setUsername(target.value);
            }}
          ></input>
        </div>
        <div>
          password{' '}
          <input
            type="password"
            value={password}
            name="Password"
            id="password"
            onChange={({ target }) => {
              setPassword(target.value);
            }}
          ></input>
        </div>
        <button id="loginButton" type="submit">
          login
        </button>
      </form>
    </div>
  );

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>
        {user.username} logged in<button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <h2>create new</h2>
        <Blogform submitNewBlog={submitNewBlog} />
      </Togglable>
      <div className="blogsContainer">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            requestDeleteBlog={requestDeleteBlog}
            requestUpdateBlog={requestUpdateBlog}
            user={user}
          />
        ))}
      </div>
    </div>
  );

  return <div>{user === null ? loginForm() : blogList()}</div>;
};

export default App;
