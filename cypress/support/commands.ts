/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to setup game with specific settings
 * @example cy.setupGame(8, 'Расширенный')
 */
Cypress.Commands.add("setupGame", (playerCount = 6, gameMode = "Классический") => {
  cy.visit("/settings");
  cy.get('input[type="number"]').clear().type(playerCount.toString());
  cy.contains(gameMode).click();
  cy.contains("Старт").click();
});

/**
 * Custom command to check if element is visible after animation
 * @example cy.get('.animated-element').isVisibleWithAnimation()
 */
Cypress.Commands.add("isVisibleWithAnimation", { prevSubject: true }, (subject) => {
  // Wait for animation to complete
  cy.wait(1000);
  cy.wrap(subject).should("be.visible");
});

// This is a workaround - we're using the reference directive to include the types
// without explicitly using namespace syntax in our code.
// The types still need to be declared somehow, so they're in the cypress.d.ts file instead.
