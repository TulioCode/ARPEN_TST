describe('Login/Cadastros', {requestTimeout:10000, responseTimeout:10000},function () {
  context( 'Autenticações Sucesso',()=> {
    it('Realiza Login - Success', {pageLoadTimeout: 10000},() => {

      //Before começo
      //cpf do gutim cai no Confia
      let CPF = '47031984874'
      let password = 'Codebit@123'
      cy.on('uncaught:exception', (e) => {
        if(e.message.includes('style')){
          return false
        }
      })
      cy.visit('/');
      cy.get('#botaoLogin').click()
      cy.get('#username').type(CPF);
      cy.get('#kc-login').as('btnContinue').click();
      cy.get('#password').type(password);
      cy.get('@btnContinue').click();
    })
  })
  //DONE
  context('Menor de 16 anos', function (){
    it('Cadastro Menor de 16', function (){
      //CPF TST: 44784709878
      let CPF = '44784709878'

      cy.on('uncaught:exception', (e) => {
        if(e.message.includes('style')){
          return false
        }
      })
      cy.visit('/');
      cy.get('#botaoLogin').click()
      cy.get('#username').type(CPF);
      cy.get('#kc-login').as('btnContinue').click();

      cy.get('.card-pf').should('be.visible');
      cy.get('#kc-error-message').should('be.visible').and("contain.text", "Você precisa ter pelo menos 18 anos para acessar.")
    })
  })
  //TODO:Estrangeiro: Preciso de um CPF sem cadastro
  context.skip('Estrangeiro', function (){

    it.skip('Quiz Estrangeiro', function (){})

  })

  context('Bloqueios', function(){

    context('Validações Acertos - Primeiro Quiz', function (){

      beforeEach(function (){
        cy.on('uncaught:exception', (e) => {
          if(e.message.includes('style')){
            return false
          }
        })
        cy.visit('/')
        cy.get('#botaoLogin').click()
      })

      it('Erros Quiz 01 - Data Aniversário',function (){
        // CPF 06263750880
        //Dados: MARCOS ANTONIO ABBOUD /// DALVA TICLY ABBOUD /// 27/06/1967
        let CPF = '06263750880'

        cy.get('#username').type(CPF);
        cy.get('#kc-login').as('btnContinue').click();

        //TO NO CONFIA
        cy.origin('https://app.hml.confia.net.br/', function (){
          cy.wait(3000)
          //clica no x do confia (Cancelamento de biometria)
          cy.get('.btn-sm > img').should('be.visible').click()
        })

        //valida msg no idrc
        cy.get('#kc-page-title').first().should('be.visible')
        cy.get('#kc-content-wrapper > div > span').should('be.visible').and('contain.text', 'AUTENTICACAO CANCELADA PELO USUARIO').and('contain.text', 'Não foi possível verificar sua identidade através da biometria facial...')
        //Formulario
        cy.get('.step').should('be.visible')
        //valida campo de cpf do formulario
        cy.get('#username').should('have.attr', 'value', "06263750880")
        //Campo de nome
        cy.get('#firstName').should('be.visible').type('MARCOS ANTONIO ABBOUD');
        cy.get('#motherName').should('be.visible').type('DALVA TICLY ABBOUD');
        cy.get('#birthDate').should('be.visible').type('11/11/2000');
        cy.get('#kc-form-buttons > input').should('be.visible').click()
        //Bloqueio
        cy.get('#kc-error-message > p.instruction').should('contain.text', 'Há divergência nos dados informados.').and('contain.text', 'Usuário bloqueado')
        //Valida que bloqueio não ocorre mais
        cy.wait(15000)
        cy.reload();
        cy.get('#kc-page-title').first().should('be.visible').and('contain.text', 'Registre-se');
      })
      it('Erros Quiz 01 - Nome da Mãe', function (){
        // CPF 06263750880
        //Dados: MARCOS ANTONIO ABBOUD /// DALVA TICLY ABBOUD /// 27/06/1967
        let CPF = '06263750880'

        cy.get('#username').type(CPF);
        cy.get('#kc-login').as('btnContinue').click();

        //TO NO CONFIA
        cy.origin('https://app.hml.confia.net.br/', function (){
          cy.wait(3000)
          //clica no x do confia (Cancelamento de biometria)
          cy.get('.btn-sm > img').should('be.visible').click()
        })

        //valida msg no idrc
        cy.get('#kc-page-title').first().should('be.visible')
        cy.get('#kc-content-wrapper > div > span').should('be.visible').and('contain.text', 'AUTENTICACAO CANCELADA PELO USUARIO').and('contain.text', 'Não foi possível verificar sua identidade através da biometria facial...')
        //Formulario
        cy.get('.step').should('be.visible')
        //valida campo de cpf do formulario
        cy.get('#username').should('have.attr', 'value', "06263750880")
        //Campo de nome
        cy.get('#firstName').should('be.visible').type('MARCOS ANTONIO ABBOUD');
        cy.get('#motherName').should('be.visible').type('NOME INCORRETO ABBOUD');
        cy.get('#birthDate').should('be.visible').type('27/06/1967');
        cy.get('#kc-form-buttons > input').should('be.visible').click()

        //Bloqueio
        cy.get('#kc-error-message > p.instruction').should('contain.text', 'Há divergência nos dados informados.').and('contain.text', 'Usuário bloqueado')
        //Valida que bloqueio não ocorre mais
        cy.wait(15000)
        cy.reload();
        cy.get('#kc-page-title').first().should('be.visible').and('contain.text', 'Registre-se');
      })
      it('Erros Quiz 01 - Nome Completo', function (){
        // CPF 06263750880
        //Dados: MARCOS ANTONIO ABBOUD /// DALVA TICLY ABBOUD /// 27/06/1967
        let CPF = '06263750880'

        cy.get('#username').type(CPF);
        cy.get('#kc-login').as('btnContinue').click();

        //TO NO CONFIA
        cy.origin('https://app.hml.confia.net.br/', function (){
          cy.wait(3000)
          //clica no x do confia (Cancelamento de biometria)
          cy.get('.btn-sm > img').should('be.visible').click()
        })

        //valida msg no idrc
        cy.get('#kc-page-title').first().should('be.visible')
        cy.get('#kc-content-wrapper > div > span').should('be.visible').and('contain.text', 'AUTENTICACAO CANCELADA PELO USUARIO').and('contain.text', 'Não foi possível verificar sua identidade através da biometria facial...')
        //Formulario
        cy.get('.step').should('be.visible')
        //valida campo de cpf do formulario
        cy.get('#username').should('have.attr', 'value', "06263750880")
        //Campo de nome
        cy.get('#firstName').should('be.visible').type('MARCOS ANTONIO INCORRETO');
        cy.get('#motherName').should('be.visible').type('DALVA TICLY ABBOUD');
        cy.get('#birthDate').should('be.visible').type('11/11/2000');
        cy.get('#kc-form-buttons > input').should('be.visible').click()
        //Bloqueio
        cy.get('#kc-error-message > p.instruction').should('contain.text', 'Há divergência nos dados informados.').and('contain.text', 'Usuário bloqueado')
        //Valida que bloqueio não ocorre mais
        cy.wait(15000)
        cy.reload();
        cy.get('#kc-page-title').first().should('be.visible').and('contain.text', 'Registre-se');
      })
    })

    context('Validações Acertos - Segundo Quiz', function (){

      beforeEach(function (){
        cy.on('uncaught:exception', (e) => {
          if(e.message.includes('style')){
            return false
          }
        })
        cy.visit('/')
        cy.get('#botaoLogin').click()
      })

      it('Erros Quiz 02 - Acerto em todas as questões para definição de senha', function (){
        // CPF 06263750880
        //Dados: MARCOS ANTONIO ABBOUD /// DALVA TICLY ABBOUD /// 27/06/1967
        let CPF = "06263750880";

        cy.get("#username").type(CPF);
        cy.get('#kc-login').as('btnContinue').click();

        //TO NO CONFIA
        cy.origin('https://app.hml.confia.net.br/', function (){
          cy.wait(3000);
          //clica no x do confia (Cancelamento de biometria)
          cy.get('.btn-sm > img').should('be.visible').click();
        })

        //valida msg no idrc
        cy.get('#kc-page-title').first().should('be.visible');
        cy.get('#kc-content-wrapper > div > span').should('be.visible').and('contain.text', 'AUTENTICACAO CANCELADA PELO USUARIO').and('contain.text', 'Não foi possível verificar sua identidade através da biometria facial...');
        //Formulario
        cy.get('.step').should('be.visible');
        //valida campo de cpf do formulario
        cy.get('#username').should('have.attr', 'value', "06263750880");
        //Campo de nome
        cy.get('#firstName').should('be.visible').type('MARCOS ANTONIO ABBOUD');
        cy.get('#motherName').should('be.visible').type('DALVA TICLY ABBOUD');
        cy.get('#birthDate').should('be.visible').type('27/06/1967');
        cy.get('#kc-form-buttons > input').should('be.visible').click();



        //QUIZ 2 - Até definição de senha
        //Pergunta 1 - nasceu ou já morou
        cy.get('.step').should('be.visible');
        //estado
        cy.wait(3000)
        cy.get('.form-group').find('input[value="são paulo"]').each($option => {
          cy.wrap($option).click()
        })
        cy.get('.pf-c-button').should('be.visible').click();
        //cidade
        cy.get('.form-group').find('input[value="ribeirao preto"]').each($option => {
          cy.wrap($option).click()
        })
        cy.get('.pf-c-button').should('be.visible').click();
        //endereço
        cy.get('#addressMain').should('be.visible').type("RUA CAIEIRAS");
        cy.get('#addressNumber').should('be.visible').type('590');
        cy.get('.pf-c-button').should('be.visible').click();
        //telefone
        cy.get('#phoneCode').should('be.visible').type('16')
        cy.get('#phoneNumber').should('be.visible').type('37227268')
        cy.get('.pf-c-button').should('be.visible').click();

        cy.get('#kc-page-title').should('be.visible').and('contain.text', 'Atualizar senha')

      })

      it('Erros Quiz 02 - Erro Três Perguntas - Com dados de Empresa incorretos', function (){
        // CPF 06263750880
        //Dados: MARCOS ANTONIO ABBOUD /// DALVA TICLY ABBOUD /// 27/06/1967
        let CPF = "06263750880";

        cy.get("#username").type(CPF);
        cy.get('#kc-login').as('btnContinue').click();

        //TO NO CONFIA
        cy.origin('https://app.hml.confia.net.br/', function (){
          cy.wait(3000);
          //clica no x do confia (Cancelamento de biometria)
          cy.get('.btn-sm > img').should('be.visible').click();
        })

        //valida msg no idrc
        cy.get('#kc-page-title').first().should('be.visible');
        cy.get('#kc-content-wrapper > div > span').should('be.visible').and('contain.text', 'AUTENTICACAO CANCELADA PELO USUARIO').and('contain.text', 'Não foi possível verificar sua identidade através da biometria facial...');
        //Formulario
        cy.get('.step').should('be.visible');
        //valida campo de cpf do formulario
        cy.get('#username').should('have.attr', 'value', "06263750880");
        //Campo de nome
        cy.get('#firstName').should('be.visible').type('MARCOS ANTONIO ABBOUD');
        cy.get('#motherName').should('be.visible').type('DALVA TICLY ABBOUD');
        cy.get('#birthDate').should('be.visible').type('27/06/1967');
        cy.get('#kc-form-buttons > input').should('be.visible').click();



        //QUIZ 2 - Até definição de senha
        //Pergunta 1 - nasceu ou já morou
        cy.get('.step').should('be.visible');
        //estado
        cy.get('.form-group').find('input[value="são paulo"]').each($option => {
          cy.wrap($option).click()
        })
        cy.get('.pf-c-button').should('be.visible').click();
        //cidade ERRA ESSA
        cy.get('.form-group').find('input[value!="ribeirao preto"]').each($option => {
          cy.wrap($option).click()
        })
        cy.get('.pf-c-button').should('be.visible').click();
        //endereço ERRA ESSA
        cy.get('#addressMain').should('be.visible').type("RUA ERRADA");
        cy.get('#addressNumber').should('be.visible').type('100');
        cy.get('.pf-c-button').should('be.visible').click();
        //telefone ERRA ESSA
        cy.get('#phoneCode').should('be.visible').type('11')
        cy.get('#phoneNumber').should('be.visible').type('37227244')
        cy.get('.pf-c-button').should('be.visible').click();

        //PERGUNTA EXTRA sobre empresa ERRAR
        cy.get('#companyName').should('be.visible').type('Nome errado teste')
        cy.get('#companyYear').should('be.visible').type('1955')
        cy.get('.pf-c-button').should('be.visible').click();

        //valida o bloqueio do usuário
        cy.get('.instruction').should('contain.text', 'Usuário bloqueado')
        //wait para passar o bloqueio para os outros testes
        cy.wait(10000)
      })

      //TODO Erros Quiz 02 - Erro Três Perguntas - Sem dados de Empresa
      it.skip('Erros Quiz 02 - Erro Três Perguntas - Sem dados de Empresa', function (){})

    })

  })
})
