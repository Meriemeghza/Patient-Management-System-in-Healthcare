describe('RegisterForm Acceptance Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/patients/6780485e00205734e7d5/register'); // Navigate to the RegisterForm page
  });

  it('renders all form elements correctly', () => {
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="phone"]').should('be.visible');
    cy.get('button').contains('Submit and Continue').should('be.visible');
  });

  it('displays validation errors for missing required fields', () => {
    cy.get('button').contains('Submit and Continue').click();

    cy.contains('Full name is required').should('be.visible');
    cy.contains('Email address is required').should('be.visible');
    cy.contains('Phone number is required').should('be.visible');
  });

  it('submits the form and redirects to the New Appointment page on success', () => {
    // Mock the API response
    cy.intercept('POST', '/api/register', {
      statusCode: 201,
      body: { success: true, userId: '123' },
    }).as('registerUser');

    // Fill out the form
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="phone"]').type('5551234567');

    cy.get('button').contains('Submit and Continue').click();

    cy.wait('@registerUser');
    cy.url().should('include', '/patients/123/new-appointment');
  });
});
