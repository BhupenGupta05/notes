describe('Note app', function() {
  beforeEach(function() {    
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)    
    const user = {
      name: 'Superuser',
      username: 'root',
      password: 'Jelly05fi$h'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)    
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
  })

  it('user can login', function () {
    cy.contains('login').click()
    cy.get('#username').type('root')
    cy.get('#password').type('Jelly05fi$h')
    cy.get('#login-button').click()

    cy.contains('Superuser logged in')
  })

  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('root')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('Wrong credentials')
    cy.contains('Superuser logged in').should('not.exist')
  })

  describe('when logged in', function() {    
    beforeEach(function() {    
      cy.login({ username: 'root', password: 'Jelly05fi$h' })   
    })

    it('a new note can be created', function() {      
      cy.contains('new note').click()      
      cy.get('input').type('a note created by cypress')      
      cy.contains('Save').click()      
      cy.contains('a note created by cypress')    
    })  
  })

  describe('and a note exists', function () {
    beforeEach(function () {
      cy.createNote({ content: 'first note', important: false })
      cy.createNote({ content: 'second note', important: false })
      cy.createNote({ content: 'third note', important: false })
    })

    it.only('one of those can be made important', function () {
      cy.contains('second note').parent().find('button').as('theButton')
      cy.get('@theButton').click()
      cy.get('@theButton').should('contain', 'make not important')
    })
  })
})