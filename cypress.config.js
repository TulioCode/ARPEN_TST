const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://idrch.registrocivil.org.br/',
    viewportHeight: 1024,
    viewportWidth: 1280,
    chromeWebSecurity: false,
    uncaught:'exception'
  },
  projectId: "54y3nx",

  //npx cypress run --record --key cf4d6100-67b8-44f4-be0c-048338e0a07c
});


