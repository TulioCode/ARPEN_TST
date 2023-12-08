import {faker} from "@faker-js/faker";

Cypress.on('uncaught:exception', (e,run) => {
    if(e.message.includes('style')){
        return false
    }
    if(e.message.includes("Cannot read properties of null")){
        return false
    }
})
