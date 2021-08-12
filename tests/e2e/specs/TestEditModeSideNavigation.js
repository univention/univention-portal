import 'cypress-file-upload';

beforeEach(() => {
  cy.setCookie('UMCLang', 'de_DE');
  cy.intercept('GET', 'portal.json', { fixture: 'portal_logged_in.json' });
  cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
  cy.intercept('GET', 'de.json', { fixture: 'de.json' });
  cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
  cy.visit('/');
  cy.get('main.cookie-banner + footer button.primary').click();
});

describe('Test Editmode Side navigation', () => {
  it('Open Editmode sidenavigation and edit general portal data.', () => {

    openEditmode();

    // Assert: No Image in .image-upload__canvas
    cy.get('[data-test=imageUploadCanvas--Portal-Logo] img').should('not.exist');
    cy.get('[data-test=imageUploadButton--Portal-Logo]').click();
        
    // programmatically upload the logo
    const fileName = 'images/logo.svg';

    cy.fixture(fileName).then(fileContent => {
      cy.get('[data-test=imageUploadFileInput--Portal-Logo]').attachFile(
        { fileContent, fileName, mimeType: 'image/svg+xml' },
      );
    });

    // Assert: Image in .image-upload__canvas should exist
    cy.get('[data-test=imageUploadCanvas--Portal-Logo] img').should('exist');

    // Assert: click on remove: Image in .image-upload__canvas should not exist anymore
    cy.get('[data-test=imageRemoveButton--Portal-Logo]').click();
    cy.get('[data-test=imageUploadCanvas--Portal-Logo] img').should('not.exist');
  });

  it('Test Local Input and required fields', () => {
    openEditmode();

    cy.get('[data-test="localeInput--Name"]').clear();
    cy.get('[data-test="notification--error"]').should('not.exist');
    cy.get('[data-test="editModeSideNavigation--Save"]').click();
    
    // assert Error Notification due to empty input
    cy.get('[data-test="notification--error"]').should('exist');
    
    cy.get('[data-test="closeNotification--error"]').click();
  
    // Enter Text and Save then. 
    cy.get('[data-test="localeInput--Name"]').type('Univention Portal');
    cy.get('[data-test="editModeSideNavigation--Save"]').click();

    // TODO: Check if Changes are seen in new portal.json
  });
});

const openEditmode = () => {
    // Open Editmode
    cy.get('[data-test="navigationbutton"]').click();
    cy.get('[data-test="openEditmodeButton"]').click();
    cy.get('.edit-mode-side-navigation__form').should('be.visible');
}
