describe("Game Flow Tests", () => {
  it("should set up a new game with default settings", () => {
    cy.visit("/welcome");
    cy.contains("Settings").click();
    cy.url().should("include", "/settings");

    // Default settings should be preset
    cy.get('input[name="players"]').should("have.value", "6");

    // Start the game setup
    cy.visit("/welcome");
    cy.contains("Start game").click();
    cy.url().should("include", "/setup");
  });

  it("should change game settings", () => {
    cy.visit("/settings");

    // Change player count
    cy.get('input[name="players"]').clear().type("8");

    // Change game mode to Extended
    cy.contains("Choose mode").click();
    cy.contains("Extended").click();

    // Start the game setup
    cy.contains("Save changes").click();
    cy.url().should("include", "/welcome");
  });
});
