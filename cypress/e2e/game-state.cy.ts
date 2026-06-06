describe("Game State Management", () => {
  // We need to intercept the router state to properly test state-dependent pages
  // as Cypress can't directly manage React Router state

  beforeEach(() => {
    // Navigate to settings page to set up a game
    cy.visit("/settings");
  });

  it("should display appropriate error when accessing session page directly", () => {
    cy.visit("/session");

    cy.url().should("include", "/welcome");

    cy.contains("The game field is only accessible after game initialization!").should("be.visible");
  });

  it("should clamp the player count within the allowed range", () => {
    const decrease = '[aria-label="Amount of players: decrease"]';
    const increase = '[aria-label="Amount of players: increase"]';

    // Step down from the default of 6 to the minimum of 4
    cy.get(decrease).click();
    cy.get(decrease).click();
    cy.get('input[name="players"]').should("have.value", "4");
    cy.get(decrease).should("be.disabled");

    // Step up to the maximum of 12
    for (let i = 0; i < 8; i += 1) cy.get(increase).click();
    cy.get('input[name="players"]').should("have.value", "12");
    cy.get(increase).should("be.disabled");
  });

  it("should allow changing game mode", () => {
    cy.contains("Extended").click();

    cy.contains("Save changes").click();
    cy.url().should("include", "/welcome");
  });

  // A more complex test that would require mocking router state
  // This is illustrative and would need additional setup to run
  it.skip("should track game state through day/night cycles", () => {
    // This would require using a router wrapper or intercepting router state
    // to configure the necessary state for SessionPage

    // Intercept the route with mock state (conceptual)
    cy.intercept("/session", (req) => {
      req.reply({
        body: "<html>...</html>",
        routerState: {
          players: [{ role: "Мирный житель", roleSrc: "/cards/innocent.svg" }],
          innocentPlayers: 4,
          mafiaPlayers: 2,
        },
      });
    });

    cy.visit("/session");

    // Verify initial state is night
    cy.contains("Night").should("be.visible");
    cy.contains("0").should("be.visible");

    // Advance to day
    cy.contains("Next day").click();
    cy.contains("Day").should("be.visible");
    cy.contains("1").should("be.visible");
  });
});
