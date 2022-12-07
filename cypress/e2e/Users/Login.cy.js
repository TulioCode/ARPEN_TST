import {faker} from "@faker-js/faker";

describe('Login', () => {

  context( 'Cases Login',()=> {
    let CPF = '470.319.848-74'
    let password = 'Codebit@123'

    beforeEach(()=> {
      cy.intercept(
          'GET',
          'projetos',
      ).as('waitLoginLoad')

      cy.visit('/')
      cy.get('.btn').click()
    })

    it('Cadastra e realiza Login - Success', () => {
      let firstName = faker.name.firstName()
      let lastName = faker.name.lastName()
      let email = faker.internet.email()
      let CPF = faker.random.numeric(11)
      let password = 'Codebit@123'
      let passwordConfirm = 'Codebit@123'

      cy.get('#kc-registration > div > input[value = "Cadastre-se"]').click()
      cy.get('.rc-card').should('be.visible')

      cy.completeRegistrationFields(
          firstName = firstName,
          lastName = lastName,
          email = email,
          CPF = CPF,
          password = password,
          passwordConfirm = passwordConfirm
      );

      cy.visit('/')
      cy.get('.btn').click()

      cy.get('#username').type(CPF)
      cy.get('#password').type(password)
      cy.get('#kc-login').click()

      cy.get('.alert-warning').should('be.visible')
    })

    it('Fake Login - UserName - Unsuccess', () => {
      cy.get('#username').type(faker.random.numeric(11))
      cy.get('#password').type(password)
      cy.get('#kc-login').click()

      cy.get('#input-error').should('be.visible')
    })

    it('Fake Login - Password - Unsuccess', () => {
      cy.get('#username').type(CPF)
      cy.get('#password').type('Senha Incorreta @123')
      cy.get('#kc-login').click()

      cy.get('#input-error').should('be.visible')
    })
  })

})
