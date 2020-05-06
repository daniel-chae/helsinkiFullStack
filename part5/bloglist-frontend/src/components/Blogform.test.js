import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Blogform from './Blogform';

describe('<Blogform/>', () => {
  let component;
  let mockSubmitNewBlog;

  beforeEach(() => {
    mockSubmitNewBlog = jest.fn();
    component = render(<Blogform submitNewBlog={mockSubmitNewBlog} />);
  });

  test('A new blog can be submitted with right details', () => {
    const authorField = component.getByLabelText('author:');
    const urlField = component.getByLabelText('url:');
    const titleField = component.getByLabelText('title:');
    const form = component.container.querySelector('form');

    fireEvent.change(authorField, {
      target: { value: 'authorTest' },
    });
    fireEvent.change(urlField, {
      target: { value: 'urlTest' },
    });
    fireEvent.change(titleField, {
      target: { value: 'titleTest' },
    });
    fireEvent.submit(form);

    expect(mockSubmitNewBlog.mock.calls).toHaveLength(1);
    expect(mockSubmitNewBlog.mock.calls[0][0]).toEqual({
      author: 'authorTest',
      url: 'urlTest',
      title: 'titleTest',
    });
  });
});
