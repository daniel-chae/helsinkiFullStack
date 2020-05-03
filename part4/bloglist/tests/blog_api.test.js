// Import external modules
const mongoose = require('mongoose');
const supertest = require('supertest');

// Import internal modules
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

// Create an supertest api
const api = supertest(app);

// Create user
describe('Create user', () => {
  beforeAll(async () => {
    await helper.setCreateUserBlock();
  });

  test('User_Create1 - A new user can be created', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'danielchae',
      name: 'hyun chae',
      password: 'test',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('User_Create2 - If username already exists, user creation fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });

  test('User_Create3 - If password is shorter than 3 characters long, user creation fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'shortPassword',
      password: '12',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });

  test('User_Create4 - If username is shorter than 3 characters long, user creation fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: '12',
      password: 'shortUsername',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });

  test('User_Create5 - If username is not provided, user creation fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      password: 'password',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });

  test('User_Create6 - If password is not provided, user creation fails', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'username',
    };

    await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });
});

// Login a user
describe('Login a user', () => {
  beforeAll(async () => {
    await helper.setLoginUserBlock(api);
  });

  test('User_Login1 - A user can login', async () => {
    const loginInfo = {
      username: 'root',
      password: 'sekret',
    };

    const response = await api
      .post('/login')
      .send(loginInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.token).toBeDefined();
  });

  test('User_Login2 - A user cannot login if password is wrong', async () => {
    const loginInfo = {
      username: 'root',
      password: 'wrongPass',
    };

    const response = await api.post('/login').send(loginInfo).expect(401);
    expect(response.body.token).not.toBeDefined();
  });

  test('User_Login3 - A user cannot login if username is wrong', async () => {
    const loginInfo = {
      username: 'wrongUserName',
      password: 'sekret',
    };

    const response = await api.post('/login').send(loginInfo).expect(401);
    expect(response.body.token).not.toBeDefined();
  });
});

// Create blog
describe('Create blog', () => {
  beforeAll(async () => {
    await helper.setCreateBlogBlock(api);
  });

  test('Blog_Create1 - Blog can be created successfully', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const loginInfo = {
      username: 'root',
      password: 'sekret',
    };
    const response = await api.post('/login').send(loginInfo);
    const token = response.body.token;

    const newBlog = {
      title: 'newBlog',
      author: 'newAuthor',
      url: 'newURL',
    };

    await api
      .post('/api/blogs/')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(blogsAtStart.length + 1);
    expect(blogsAtEnd[blogsAtStart.length]).toMatchObject(newBlog);
    expect(blogsAtEnd[blogsAtStart.length].likes).toBe(0);
  });

  test('Blog_Create2 - Blog cannot be created without token header', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      title: 'newBlog',
      author: 'newAuthor',
      url: 'newURL',
      likes: 7,
    };

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(blogsAtStart.length);
  });

  test('Blog_Create3 - Blog cannot be created with wrong token', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      title: 'newBlog',
      author: 'newAuthor',
      url: 'newURL',
      likes: 7,
    };

    const wrongToken = '1231231209123';

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(blogsAtStart.length);
  });

  test('Blog_Create4 - Blog cannot be crated without title', async () => {
    const loginInfo = {
      username: 'root',
      password: 'sekret',
    };
    const response = await api.post('/login').send(loginInfo);
    const token = response.body.token;

    const newBlog = {
      author: 'newAuthor',
      like: 12,
      url: 'newUrl',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test('Blog_Create5 - Blog cannot be crated without title', async () => {
    const loginInfo = {
      username: 'root',
      password: 'sekret',
    };
    const response = await api.post('/login').send(loginInfo);
    const token = response.body.token;

    const newBlog = {
      title: 'newTitle',
      author: 'newAuthor',
      like: 12,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });
});

// Reading blogs and blog
describe('Reading multiple blogs and single blog', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    await helper.setReadDeleteBlogBlock(api);
  });

  test('Blogs_Read1 - Notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('Blogs_Read2 - Correct amount of blogs are returned', async () => {
    const blogsInDb = await helper.blogsInDb();
    console.log(blogsInDb);
    const response = await api.get('/api/blogs');
    expect(response.body.length).toBe(blogsInDb.length);
  });

  test('Blogs_Read3 - Correct identifier(id) is defined as a property of blogs', async () => {
    const response = await api.get('/api/blogs/');
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });

  test('Blogs_Read4 - User field is populated', async () => {
    const response = await api.get('/api/blogs/');
    response.body.forEach((blog) => {
      expect(blog.user).toMatchObject({
        username: 'root',
      });
    });
  });

  test('Blog_Read1 - A Note is returned as json', async () => {
    const blogsInDb = await helper.blogsInDb();
    const blogToRead = await blogsInDb[0];

    await api
      .get(`/api/blogs/${blogToRead.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('Blog_Read2 - Correct identifier(id) is defined as a property of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToRead = blogsAtStart[0];
    const response = await api.get(`/api/blogs/${blogToRead.id}`);

    expect(response.body.id).toBeDefined();
  });

  test('Blog_Read3 - User field is populated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToRead = blogsAtStart[0];

    const response = await api.get(`/api/blogs/${blogToRead.id}`);

    expect(response.body.user).toMatchObject({
      username: 'root',
    });
  });
});

describe('Update a blog', () => {
  test('Blog_Update1 - Blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const newBlogBody = {
      title: 'updated',
      author: 'updated Author',
      url: 'updated Url',
    };
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlogBody)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0]).toMatchObject(newBlogBody);
  });
});

describe('Delete blog', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    await helper.setReadDeleteBlogBlock(api);
  });

  test('Blog_Delete1 - An existing blog can be delete', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const loginInfo = {
      username: 'root',
      password: 'sekret',
    };
    const response = await api.post('/login').send(loginInfo);
    const token = response.body.token;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1);
  });

  test('Blog_Delete2 - Deletion fails with invalid id', async () => {
    const wrongUrl = '12312fdsfaf';

    const loginInfo = {
      username: 'root',
      password: 'sekret',
    };
    const response = await api.post('/login').send(loginInfo);
    const token = response.body.token;

    await api
      .delete(`/api/blogs/${wrongUrl}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  test('Blog_Delete3 - Deletion fails with non-existing id', async () => {
    const nonExistingId = await helper.nonExistingId();

    const loginInfo = {
      username: 'root',
      password: 'sekret',
    };
    const response = await api.post('/login').send(loginInfo);
    const token = response.body.token;

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  test('Blog_Delete4 - Deletion fails without token', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
