import {faker} from "@faker-js/faker";

describe('Recuperação de senha', () => {
    beforeEach (() =>{
        cy.visit('https://idp2.assinador.codebit.biz/realms/IDRC/login-actions/reset-credentials')
    })

    context('Request password recovery', ()=> {

        let cpf = faker.random.numeric(11)
        let cpfFormated = cpf.substring(0, 3) + '.' + cpf.substring(3,6) + '.' + cpf.substring(6, 9) + '-' + cpf.substring(9, 11);


        it('Validation of success message in sending the email if it exists\n', ()=>{
            cy.get('#username').type(cpf)
            cy.get('.rc-button-secondary').click()
            cy.get('.alert-success').should('be.visible')
            cy.get('#username').should('have.value', cpfFormated)
        })
    })
})
