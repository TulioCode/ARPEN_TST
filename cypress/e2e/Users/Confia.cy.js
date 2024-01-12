describe.skip('Confia', function (){
    context('Fluxos Cancelamento', function (){
        it('Scan de etapas', function (){
            let CPF = '06263750880'

            cy.get('#username').type(CPF);
            cy.get('#kc-login').as('btnContinue').click();

            //TO NO CONFIA
            cy.origin('https://app.hml.confia.net.br/', function (){
                cy.wait(3000)
                //clica no x do confia (Cancelamento de biometria)
                cy.get('.btn-sm > img').should('be.visible').click()
            })
        })
    })
})
