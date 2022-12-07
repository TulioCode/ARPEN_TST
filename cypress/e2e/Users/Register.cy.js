import {faker} from "@faker-js/faker";

describe('Register Area', () => {
    let CPF = '470.319.848-74'
    let password = 'Codebit@123'

    beforeEach(()=> {
        cy.intercept(
            'GET',
            'projetos',
        ).as('waitLoginLoad')

        cy.visit('/')
        cy.get('.btn').click()
        cy.get('#kc-registration > div > input[value = "Cadastre-se"]').click()
        cy.get('.rc-card').should('be.visible')
    })

    context.skip('api', ()=>{
        it('', () => {
            cy.intercept(
                'POST',
                `registration?session_code=\*execution=\*&client_id=login-cidadao-client&tab_id=\*`,
                {fixture: 'registerData'}
            ).as('registerapi')
            cy.wait('@registerapi')

        })
    })
    context('Success', ()=>{
        it('API verification', () => {
            cy.intercept(
                'POST',
                `registration?session_code=\*execution=\*&client_id=login-cidadao-client&tab_id=\*`
            ).as('loginSucesso')

            cy.intercept(
                'GET',
                `required-action?execution=VERIFY_EMAIL&client_id=login-cidadao-client&tab_id=\*`
            ).as('verificationMail');

            cy.completeRegistrationFields();
            cy.wait('@loginSucesso')
            cy.wait('@verificationMail')
            cy.get('.alert-warning > :nth-child(2)').should('be.visible')
        });
    })
    context('Validation Name Required', ()=>{
        it('Name', ()=> {
            cy.completeRegistrationFields(' ')
            cy.get('#input-error-firstname').should('be.visible')
        })
    })
    context('Validation Last Name Required', ()=>{
        it('Last Name', ()=> {
            cy.completeRegistrationFields('', ' ')
            cy.get('#input-error-lastname').should('be.visible')
        })
    })
    context('Validation Email Required', ()=>{
        it('Email', ()=> {
            cy.completeRegistrationFields('', '', ' ')
            cy.get('#input-error-email').should('be.visible')
        })
    })
    context('Validation Username(CPF) Required', ()=>{
        it('Username(CPF)', ()=> {
            cy.completeRegistrationFields('', '', '', ' ')
            cy.get('#input-error-username').should('be.visible')
        })
    })
    context('Validation password Required', ()=>{
        it('password', ()=> {
            cy.completeRegistrationFields('', '', '', '', ' ')
            cy.get('#input-error-password').should('be.visible')
        })
    })
    context('Validation Confirm password Required', ()=>{
        it('Confirm password', ()=> {
            cy.completeRegistrationFields('', '', '', '', '', ' ')
            cy.get('#input-error-password-confirm').should('be.visible')
        })
    })
})
