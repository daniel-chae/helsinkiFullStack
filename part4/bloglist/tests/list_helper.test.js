const listHelper = require('../utils/list_helper');

const listWithOneBlog = [
  {
    _id: '1',
    title: 'title1',
    author: 'author1',
    url: 'url1',
    likes: 1,
    __v: 1,
  },
];

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

const challengeBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 17,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

test('Dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('Total likes', () => {
  test('When a list has a single blog, the total likes equals to the likes of that blog', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(1);
  });

  test('When a list has more than one blog, the total likes is the sum of likes from all blog', () => {
    const result = listHelper.totalLikes(blogs);

    expect(result).toBe(36);
  });
});

describe('Favorite blog', () => {
  test('When a list has a single blog, the favorite blog is that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual({
      _id: '1',
      title: 'title1',
      author: 'author1',
      url: 'url1',
      likes: 1,
      __v: 1,
    });
  });

  test('When a list has more than one blog, the blog with most likes is the favorite blog', () => {
    const result = listHelper.favoriteBlog(blogs);

    expect(result).toEqual({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    });
  });
});

describe('Most blogs', () => {
  test('When a list has a single blog, its author is the one with most blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    expect(result).toEqual({
      author: 'author1',
      blogs: 1,
    });
  });

  test('When a list has more than one blog, the author with most blogs is the one', () => {
    const result = listHelper.mostBlogs(blogs);

    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });

  test('When more than two authors with the same blog count, any one of them is the one', () => {
    const result = listHelper.mostBlogs(challengeBlogs);

    expect([
      {
        author: 'Edsger W. Dijkstra',
        blogs: 2,
      },
      {
        author: 'Robert C. Martin',
        blogs: 2,
      },
    ]).toContainEqual(result);
  });
});

describe('Most liked Author', () => {
  test('When a list has more than one blog, author with most likes in total is the most liked author', () => {
    const result = listHelper.mostLikes(blogs);

    expect({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });

  test('When there are more than one author with most likes, any one of them is the most liked author', () => {
    const result = listHelper.mostLikes(challengeBlogs);

    expect([
      {
        author: 'Edsger W. Dijkstra',
        likes: 17,
      },
      {
        author: 'Michael Chan',
        likes: 17,
      },
    ]).toContainEqual(result);
  });
});
