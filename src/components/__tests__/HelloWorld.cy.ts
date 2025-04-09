/// <reference types="cypress" />
import HelloWorld from '../HelloWorld.vue'
import { mount } from 'cypress/vue'

describe('HelloWorld', () => {
  it('playground', () => {
    mount(HelloWorld, { props: { msg: 'Hello Cypress' } })
  })

  it('renders properly', () => {
    mount(HelloWorld, { props: { msg: 'Hello Cypress' } })
    cy.get('h1').should('contain', 'Hello Cypress')
  })
})
