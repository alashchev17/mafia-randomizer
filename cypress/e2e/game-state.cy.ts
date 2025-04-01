describe('Game State Management', () => {
  // We need to intercept the router state to properly test state-dependent pages
  // as Cypress can't directly manage React Router state

  beforeEach(() => {
    // Navigate to settings page to set up a game
    cy.visit('/settings')
  })

  it('should display appropriate error when accessing session page directly', () => {
    cy.visit('/session')

    cy.url().should('include', '/welcome')

    cy.contains('The game field is only accessible after game initialization!').should('be.visible')
  })

  it('should validate player count when starting a game', () => {
    // Try with too few players (5)
    cy.get('input[name="players"]').clear().type('5')
    cy.contains('Save changes').should('be.disabled')

    // Should stay on the settings page
    cy.url().should('include', '/settings')

    // Try with too many players (13)
    cy.get('input[name="players"]').clear().type('13')
    cy.contains('Save changes').should('be.disabled')

    // Should stay on the settings page
    cy.url().should('include', '/settings')
  })

  it('should allow changing game mode', () => {
    cy.contains('Choose mode').click()
    cy.contains('Extended').click()

    cy.contains('Save changes').click()
  })

  // A more complex test that would require mocking router state
  // This is illustrative and would need additional setup to run
  it.skip('should track game state through day/night cycles', () => {
    // This would require using a router wrapper or intercepting router state
    // to configure the necessary state for SessionPage

    // Intercept the route with mock state (conceptual)
    cy.intercept('/session', (req) => {
      req.reply({
        body: '<html>...</html>',
        routerState: {
          players: [{ role: 'Мирный житель', roleSrc: '/cards/innocent.svg' }],
          innocentPlayers: 4,
          mafiaPlayers: 2,
        },
      })
    })

    cy.visit('/session')

    // Verify initial state is night
    cy.contains('Night').should('be.visible')
    cy.contains('0').should('be.visible')

    // Advance to day
    cy.contains('Next day').click()
    cy.contains('Day').should('be.visible')
    cy.contains('1').should('be.visible')
  })
})
