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

  });
  //DONE
  context('Valdações Iniciais CPF ', function (){
    beforeEach(function (){
        cy.visit('/');
        cy.get('#botaoLogin').click()
    })

    it('Cadastro Menor de 16', function (){
      //CPF TST: 44784709878
      let CPF = '44784709878'

      cy.get('#username').type(CPF);
      cy.get('#kc-login').as('btnContinue').click();

      cy.get('.card-pf').should('be.visible');
      cy.get('#kc-error-message').should('be.visible').and("contain.text", "Você precisa ter pelo menos 18 anos para acessar.")
    })

    it('Cadastro PeP - CPF Bolsonaro', function (){
      let CPF = '45317828791'

      cy.get('#username').type(CPF);
      cy.get('#kc-login').as('btnContinue').click();

      cy.get('.card-pf').should('be.visible');
      cy.get('#kc-error-message').should('be.visible').and("contain.text", "Usuário bloqueado, procure um cartório para regularizar seu cadastro.")
    });

    it('Cadastro CPF inválido', function (){
      let CPF = '12345678998'

      cy.get('#username').type(CPF);
      cy.get('#kc-login').as('btnContinue').click();
      cy.get('#kc-content-wrapper > div > span').should('be.visible').and('contain.text', 'Nome de usuário inválido.')
  })

    it('CPF com registro de obito', function (){
      let CPF = '61582093849'

      cy.get('#username').type(CPF);
      cy.get('#kc-login').as('btnContinue').click();
      cy.get('.instruction').should('be.visible').and('contain.text', 'Seu acesso está bloqueado e, por conta disso, não pode usar sua Autenticação Eletrônica do Registro Civil – IdRC. Por favor, vá até um cartório de pessoas naturais para regularizar sua situação e liberar seu IdRC.')
    })

    it('Tentativa de Login em CPF Bloqueado', function (){
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

      //valida tentativa de cadastro enquanto bloqueado
      cy.visit('/');
      cy.get('#botaoLogin').click()
      cy.get('#username').type(CPF);
      cy.get('#kc-login').as('btnContinue').click();
      cy.get("#kc-error-message").should('contain.text', 'Usuário bloqueado')
    })
  });

  context('Validações Tipagem de Usuário', function (){
    context('Testes Login direto', function (){

      it('Login comum - Plataforma registrado - barramento', function (){
        let CPF = '47031984874'

        cy.visit('https://uniaoestavelh.registrocivil.org.br/');
        cy.get('#username').type(CPF);
        cy.get('#kc-login').as('btnContinue').click();
        cy.get('.instruction').should('be.visible').and('contain.text', 'É necessário ser um Registrador Civil para acessar essa aplicação.')

      })

      it('Login Registrador - Plataforma registrado - Login com Sucesso', function (){
        let CPF = '08936687611'
        let password = 'Codebit@123'

        cy.visit('https://uniaoestavelh.registrocivil.org.br/');
        cy.get('#username').type(CPF);
        cy.get('#kc-login').as('btnContinue').click();
        cy.get('#password').type(password);
        cy.get('@btnContinue').click();
        cy.get('#kc-attempted-username').should('be.visible').and("contain.text", 'Nubia')
      })
    })
    context('Navegação entre plataforma - Validação de Tipagem - Partindo Plataforma Acesso Comum', function (){
      // Usuário Registrador ( Plataforma R -> C) PERMITE
      // Usuário registrador: 08936687611
      // Usuário padrão: 47031984874
      // Plataformas Usudas no Teste
      // Registrador: UE  https://uniaoestavelh.registrocivil.org.br |  https://casamentoconectado.codebit.biz/cartorio
      // Comum: assinatura https://assinaturahmlg.registrocivil.org.br/
      let CPF
      let password

      beforeEach(function (){
        cy.visit('https://assinaturahmlg.registrocivil.org.br/');

      })

      it('Validação Tipagem - Usuáriuo Registrador (Plataforma C -> R) - Login', function (){
        CPF = '08936687611'
        password = 'Codebit@123'

        cy.get('#username').type(CPF);
        cy.get('#kc-login').as('btnContinue').click();
        cy.get('#password').type(password);
        cy.get('@btnContinue').click();
        cy.visit('https://uniaoestavelh.registrocivil.org.br')
        cy.get('.cpf').should('contain.text', '089.366.876-11');

      })

      it('Usuário Registrador de  (Plataforma C -> C) - Login', function (){
        CPF = '08936687611'
        password = 'Codebit@123'

        cy.get('#username').type(CPF);
        cy.get('#kc-login').as('btnContinue').click();
        cy.get('#password').type(password);
        cy.get('@btnContinue').click();
        cy.visit('https://casamentoconectado.codebit.biz')
        cy.get('.nav-item > .btn').click();
        cy.get('.infos-usuario').children('p').should('be.visible').and('contain.text', 'Nubia Kary Lopes Passos');

      })

      it('Usuário Comum de (Plataforma C -> R) - Trava', function (){
        CPF = '47031984874'
        password = 'Codebit@123'

        cy.get('#username').type(CPF);
        cy.get('#kc-login').as('btnContinue').click();
        cy.get('#password').type(password);
        cy.get('@btnContinue').click();
        cy.visit('https://casamentoconectado.codebit.biz/cartorio');
        cy.get(':nth-child(1) > .Vue-Toastification__toast-body').should('be.visible').and('contain.text', "O usuário não tem permissão para o acesso.")

      })

    })

  })

  context('Bloqueios QUIZ 01 E 02', function(){

    context('Validações - Primeiro Quiz', function (){

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

    context('Validações - Segundo Quiz', function (){

      beforeEach(function (){
        cy.on('uncaught:exception', (e) => {
          if(e.message.includes('style')){
            return false
          }
        })
          cy.visit('/')
          cy.get('#botaoLogin').click()
      })

      //TODO: CRIAR SCript na planilha
      it('Quiz 02 - 4/4 Correto - Sem solicitar de dados de empresa - Usuário Liberado', function (){
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

      });

      it('Quiz 02 - 2/4 Correto - Sem solicitar de dados de empresa - Usuário Liberado', function (){
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
            cy.get('#addressMain').should('be.visible').type("RUA INCORRETA");
            cy.get('#addressNumber').should('be.visible').type('000');
            cy.get('.pf-c-button').should('be.visible').click();
            //telefone
            cy.get('#phoneCode').should('be.visible').type('11')
            cy.get('#phoneNumber').should('be.visible').type('121212122')
            cy.get('.pf-c-button').should('be.visible').click();

            cy.get('#kc-page-title').should('be.visible').and('contain.text', 'Atualizar senha')

        })

      it('Quiz 02 - 1/4 Incorreto - Solicitação de Dados da Empresa - Dados Empresa Incorretos - Bloqueio do usuário', function (){
        // CPF 06263750880
        //Dados QUIZ 1: MARCOS ANTONIO ABBOUD /// DALVA TICLY ABBOUD /// 27/06/1967
        //Dados QUIZ 2: São Paulo /// Ribeirão Preto /// RUA CAIEIRAS 590 /// 16 37227268 /// Empresa: CLINICA PERFIL DE CIRURGIA PLASTICA LTDA | Dado de Incio: 2017 ///
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
        //QUIZ 1
        cy.get('#firstName').should('be.visible').type('MARCOS ANTONIO ABBOUD');
        cy.get('#motherName').should('be.visible').type('DALVA TICLY ABBOUD');
        cy.get('#birthDate').should('be.visible').type('27/06/1967');
        cy.get('#kc-form-buttons > input').should('be.visible').click();

        //QUIZ 2
        //Pergunta 1 - nasceu ou já morou
        cy.get('.step').should('be.visible');


        //estado//TODO: Tem que fazer selecionar uma errada
        cy.wait(3000)
        cy.get('.form-group').find('input[value!="são paulo"]').each($option => {
          cy.wrap($option).click()
        })
        cy.get('.pf-c-button').should('be.visible').click();

        //cidade
        cy.get('.form-group').find('input[value!="ribeirao preto"]').each($option => {
          cy.wrap($option).click()
        })
        cy.get('.pf-c-button').should('be.visible').click();

        //endereço
        cy.get('#addressMain').should('be.visible').type("RUA INCORRETA");
        cy.get('#addressNumber').should('be.visible').type('0000');
        cy.get('.pf-c-button').should('be.visible').click();

        //telefone
        cy.get('#phoneCode').should('be.visible').type('16')
        cy.get('#phoneNumber').should('be.visible').type('37227268')
        cy.get('.pf-c-button').should('be.visible').click();

        //Solicitação de dados da empresa
        cy.get('#companyName').should('be.visible').type("Empresa Incorreta")
        cy.get('#companyYear').should('be.visible').type('2000')
        cy.get('.pf-c-button').should('be.visible').click();

        //Valida Bloqueio
        cy.get('#kc-error-message > p.instruction').should('contain.text', 'Há divergência nos dados informados.').and('contain.text', 'Usuário bloqueado')
        //Valida que bloqueio não ocorre mais
        cy.wait(15000)
        cy.reload();
        cy.get('#kc-page-title').first().should('be.visible').and('contain.text', 'Registre-se');
      })
      //TODO: Validar funcionamento Quais as Chaves que são coferidas com os dados de Empresa
      it('Quiz 02 - 1/4 Incorreto - Solicita Dados da Empresa  - Dados da Empresa Corretos - Usuário liberado', function (){
        // CPF 06263750880
        //Dados QUIZ 1: MARCOS ANTONIO ABBOUD /// DALVA TICLY ABBOUD /// 27/06/1967
        //Dados QUIZ 2: São Paulo /// Ribeirão Preto /// RUA CAIEIRAS 590 /// 16 37227268 /// Empresa: CLINICA PERFIL DE CIRURGIA PLASTICA LTDA | Dado de Incio: 2017 ///
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

        //QUIZ 2
        //Pergunta 1 - nasceu ou já morou
        cy.get('.step').should('be.visible');

        //estado//TODO: Tem que fazer selecionar uma errada
        cy.wait(3000)
        cy.get('.form-group').find('input[value!="são paulo"]').each($option => {
          cy.wrap($option).click()
        })
        cy.get('.pf-c-button').should('be.visible').click();

        //cidade
        cy.get('.form-group').find('input[value!="ribeirao preto"]').each($option => {
          cy.wrap($option).click()
        })
        cy.get('.pf-c-button').should('be.visible').click();

        //endereço
        cy.get('#addressMain').should('be.visible').type("RUA INCORRETA");
        cy.get('#addressNumber').should('be.visible').type('0000');
        cy.get('.pf-c-button').should('be.visible').click();

        //telefone
        cy.get('#phoneCode').should('be.visible').type('16')
        cy.get('#phoneNumber').should('be.visible').type('37227268')
        cy.get('.pf-c-button').should('be.visible').click();

        //Solicitação de dados da empresa
        cy.get('#companyName').should('be.visible').type("MARCOS ANTONIO ABBOUD")
        cy.get('#companyYear').should('be.visible').type('2016')
        cy.get('.pf-c-button').should('be.visible').click();

        cy.get('#kc-page-title').should('be.visible').and('contain.text', 'Atualizar senha')

      })
    })
  });

   //TODO:Estrangeiro: Preciso de um CPF sem cadastro
  // context.skip('Estrangeiro', function (){
  //   it.skip('Quiz Estrangeiro', function (){})
  // })
})

describe('Validações Nível de Garantia LOA',{requestTimeout:10000, responseTimeout:10000}, function (){

  context('Sincronismos entre os Logins - LOA', function (){

    it('LOA - Baixo para Substancial - Trava', function (){
      cy.visit('https://assinaturahmlg.registrocivil.org.br/')
      cy.url().should('include', "Aloa%3Abaixo");
      let CPF = '47031984874'
      let password = 'Codebit@123'

      cy.get('#username').should('be.visible').type(CPF);
      cy.get('#kc-login').as('btnContinue').click();
      cy.get('#password').type(password);
      cy.get('#kc-login').as('btnContinue').click();

      cy.visit('https://www.homeh.registrocivil.org.br/');
      cy.get('#botaoLogin').should('be.visible').click();
      cy.url().should('include', 'Aloa%3Asubstancial');
      cy.get('#kc-page-title').should('contain.text', 'Entrar na sua conta').and('be.visible')
    })

    it('LOA - Baixo para Baixo - Sincroniza', function (){
      cy.visit('https://assinaturahmlg.registrocivil.org.br/')
      cy.url().should('include', "Aloa%3Abaixo");
      let CPF = '08936687611'
      let password = 'Codebit@123'

      cy.get('#username').should('be.visible').type(CPF);
      cy.get('#kc-login').as('btnContinue').click();
      cy.get('#password').type(password);
      cy.get('#kc-login').as('btnContinue').click();
      cy.wait(2000)
      cy.visit('https://casamentoconectado.codebit.biz/');
      cy.get('.nav-item > .btn').click();
      cy.get('.infos-usuario').children('p').should('be.visible').and('contain.text', 'Nubia Kary Lopes Passos');
    })

    it('LOA - Logout - Sincroniza', function (){
      let CPF = '08936687611'
      let password = 'Codebit@123'

      cy.visit('https://assinaturahmlg.registrocivil.org.br/')
      cy.url().should('include', "Aloa%3Abaixo");
      cy.get('#username').should('be.visible').type(CPF);
      cy.get('#kc-login').as('btnContinue').click();
      cy.get('#password').type(password);
      cy.get('#kc-login').as('btnContinue').click();
      cy.wait(2000)
      cy.visit('https://casamentoconectado.codebit.biz/');
      cy.get('.nav-item > .btn').click();
      cy.get('.infos-usuario').children('p').should('be.visible').and('contain.text', 'Nubia Kary Lopes Passos');
      cy.visit('https://assinaturahmlg.registrocivil.org.br/');
      //clicar em #opcoesUsuario;
      cy.get('#opcoesUsuario').click();
      //Clicar em sair
      cy.get('#menuSair').should('be.visible').click();
      //Valida msg
      cy.get('.instruction').should('contain.text', 'Você realmente deseja sair?')
      //Clica em sair novamente
      cy.get('#kc-logout').should('be.visible').click();
      //Entra no casamento
      cy.visit('https://casamentoconectado.codebit.biz/');
      // Valida requisição de login
      cy.get('#kc-page-title').should('be.visible').and('contain.text', 'Entrar na sua conta')
    })
  })

} )
