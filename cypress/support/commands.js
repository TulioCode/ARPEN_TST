import {faker} from "@faker-js/faker";

Cypress.Commands.add('completeRegistrationFields', (firstName, lastName, email, CPF, password, passwordConfirm) => {
    cy.get('#firstName').clear().should('have.attr', 'name', 'firstName').type(firstName? firstName:`${faker.name.firstName()}`)
    cy.get('#lastName').clear().should('have.attr', 'name', 'lastName').type(lastName? lastName:`${faker.name.lastName()}`)
    cy.get('#email').clear().should('have.attr', 'name', 'email').type(email? email:`${faker.internet.email()}`)
    cy.get('#username').clear().should('have.attr', 'name', 'username').type(CPF ? CPF :`${faker.random.numeric(11)}`)
    cy.get('#password').clear().should('have.attr', 'name', 'password').type(password ? password : 'Codebit@123')
    cy.get('#password-confirm').clear().should('have.attr', 'name', 'password-confirm').type(passwordConfirm ? passwordConfirm :'Codebit@123')

    cy.get('.rc-button-secondary').should('have.attr', 'value', 'Continuar').click()

})
