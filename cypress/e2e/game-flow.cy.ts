describe("Game Flow Tests", () => {
  it("should expose default settings on the settings page", () => {
    cy.visit("/settings");

    // Default player count is preset to 6
    cy.get('input[name="players"]').should("have.value", "6");
  });

  it("should start a new game setup from the main page", () => {
    cy.visit("/welcome");
    cy.contains("Start game").click();
    cy.url().should("include", "/setup");
  });

  it("should change game settings", () => {
    cy.visit("/settings");

    // Player count is a stepper, not a free-text input; bump it up by one
    cy.contains("Save changes").should("be.enabled");
    cy.get('[aria-label="Amount of players: increase"]').click();
    cy.get('input[name="players"]').should("have.value", "7");

    // Switch the game mode to Extended via its radio card
    cy.contains("Extended").click();

    // Save and return to the main page
    cy.contains("Save changes").click();
    cy.url().should("include", "/welcome");
  });
});
