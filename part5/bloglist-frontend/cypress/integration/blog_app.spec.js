describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.createUser({ username: 'testuser1', password: 'testpass' });
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.get('.loginForm');
  });

  it('User can login with correct credentials', function () {
    cy.get('#username').type('testuser1');
    cy.get('#password').type('testpass');
    cy.get('#loginButton').click();
    cy.contains('testuser1 logged in');
  });

  it('User cannot login with wrong credentials', function () {
    cy.get('#username').type('testuser1');
    cy.get('#password').type('wrongpass');
    cy.get('#loginButton').click();
    cy.get('.error').contains('wrong username or password');
    cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)');
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testuser1', password: 'testpass' });
    });

    it('User can create a new blog', function () {
      cy.contains('New Blog').click();
      cy.contains('title:').find('input').type('newTitle1');
      cy.contains('author:').find('input').type('newAuthor1');
      cy.contains('url:').find('input').type('newUrl1');
      cy.get('form').contains('create').click();

      cy.get('.blogItem').contains('newTitle');
      cy.get('.blogItem').contains('newAuthor1');
    });

    describe('When a note exists', function () {
      beforeEach(function () {
        cy.newBlog({
          title: 'generatedTitle',
          author: 'generatedAuthor',
          url: 'generatedUrl',
        });
      });

      it('User can like a blog', function () {
        cy.get('.simple').contains('view').click();
        cy.get('.detail').contains('like').click();
        cy.get('.like').contains(1);
      });

      it('User who created the blog can delete it', function () {
        cy.get('.simple').contains('view').click();
        cy.get('.detail').contains('remove').click();
        cy.get('.blogsContainer').should('not.contain', 'genereatedTitle');
      });

      it('User who did not created the blog cannot delete it', function () {
        cy.createUser({ username: 'testuser2', password: 'testpass' });
        cy.login({ username: 'testuser2', password: 'testpass' });
        cy.get('.simple').contains('view').click();
        cy.get('.detail').should('not.contain', 'remove');
      });
    });
  });
});
