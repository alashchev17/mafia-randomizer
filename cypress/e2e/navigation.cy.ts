describe('Navigation Tests', () => {
  it('should navigate to the main page', () => {
    cy.visit('/')
    // Should be redirected to welcome page
    cy.url().should('include', '/welcome')
    cy.contains('Mafia (roles randomizer)').should('be.visible')
  })

  it('should navigate to the roles info page', () => {
    cy.visit('/information')
    cy.contains('Information').click()
    cy.url().should('include', '/information')
  })

  it('should navigate to the settings page', () => {
    cy.visit('/settings')
    cy.contains('Settings').click()
    cy.url().should('include', '/settings')
  })
})
