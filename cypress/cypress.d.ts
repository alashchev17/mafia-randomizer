// This file contains type definitions for Cypress custom commands
// It uses declaration merging to add the types to the Cypress global namespace

// We have no choice but to use declaration merging here, as this is how Cypress 
// expects custom commands to be typed. Even though we're avoiding namespaces in our code,
// we need to use them here for type definitions only.

declare namespace Cypress {
  interface Chainable {
    /**
     * Set up game with specific player count and game mode
     * @param playerCount - Number of players (default: 6)
     * @param gameMode - Game mode to select (default: 'Классический')
     * @example cy.setupGame(8, 'Расширенный')
     */
    setupGame(playerCount?: number, gameMode?: string): Chainable<void>
    
    /**
     * Wait for animations to complete and check if element is visible
     * @example cy.get('.animated-element').isVisibleWithAnimation()
     */
    isVisibleWithAnimation(): Chainable<Element>
  }
}
