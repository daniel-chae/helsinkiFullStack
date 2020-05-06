import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  let component;
  let updateBlogHandler;

  const blog = {
    title: 'title1',
    author: 'author1',
    url: 'url1',
    likes: 1,
    user: { username: 'testuser' },
  };

  const user = { username: 'testuser' };

  beforeEach(() => {
    updateBlogHandler = jest.fn();

    component = render(
      <Blog blog={blog} user={user} requestUpdateBlog={updateBlogHandler} />
    );
  });

  test('blog list renders title and author but not url and likes in default', () => {
    const simple = component.container.querySelector('.simple');
    const detail = component.container.querySelector('.detail');
    expect(simple).toBeVisible();
    expect(simple).toHaveTextContent('title1 author1');
    expect(simple).not.toHaveTextContent('url1');
    expect(detail).not.toBeVisible();
  });

  test('blog list renders title, author, url, likes when view button is clicked', () => {
    const viewButton = component.getByText('view');
    fireEvent.click(viewButton);

    const simple = component.container.querySelector('.simple');
    const detail = component.container.querySelector('.detail');

    const like = component.getByTestId('like');
    expect(simple).not.toBeVisible();
    expect(detail).toBeVisible();
    expect(detail).toHaveTextContent('title1');
    expect(detail).toHaveTextContent('author1');
    expect(detail).toHaveTextContent('url1');
    expect(like).toHaveTextContent('1');
  });

  test('clicking like button fires event correctly', () => {
    const viewButton = component.getByText('view');
    fireEvent.click(viewButton);

    const likeButton = component.getByText('like');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(updateBlogHandler.mock.calls).toHaveLength(2);
  });
});
