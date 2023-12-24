describe('Note app', function() {
  beforeEach(function() {    
    cy.visit('http://localhost:5173')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

  it('user can login', function () {
    cy.contains('login').click()
    cy.get('#username').type('root')
    cy.get('#password').type('Jelly05fi$h')
    cy.get('#login-button').click()

    cy.contains('Superuser logged in')
  })

  it.only('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('root')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('Wrong credentials')
    cy.contains('Superuser logged in').should('not.exist')
  })

  describe('when logged in', function() {    
    beforeEach(function() {      
      cy.contains('login').click()      
      cy.get('input:first').type('root')      
      cy.get('input:last').type('Jelly05fi$h')      
      cy.get('#login-button').click()    
    })

    it('a new note can be created', function() {      
      cy.contains('new note').click()      
      cy.get('input').type('a note created by cypress')      
      cy.contains('Save').click()      
      cy.contains('a note created by cypress')    
    })  
  })
})