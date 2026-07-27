import CatalogPage from '../pages/CatalogPage.js';
import MenuPage from '../pages/MenuPage.js';
import LoginPage from '../pages/LoginPage.js';
import { users } from '../data/users.js';

const APP_PACKAGE = 'com.saucelabs.mydemoapp.android';

describe('My Demo App — Login', () => {
  beforeEach(async () => {
    await driver.terminateApp(APP_PACKAGE);
    await driver.activateApp(APP_PACKAGE);
    await CatalogPage.waitForLoaded();
    await CatalogPage.openMenu();
    await MenuPage.goToLogin();
    await LoginPage.waitForLoaded();
  });

  it('should login with valid credentials', async () => {
    await LoginPage.login(users.valid.username, users.valid.password);
    await CatalogPage.waitForLoaded();
    await expect(CatalogPage.catalogTitle).toBeDisplayed();
  });

  it('should show error for locked-out user', async () => {
    await LoginPage.login(users.locked.username, users.locked.password);
    const message = await LoginPage.getPasswordError();
    await expect(message).toContain('Sorry this user has been locked out');
  });

  it('should show validation when username is empty', async () => {
    await LoginPage.login('', users.valid.password);
    const message = await LoginPage.getUsernameError();
    await expect(message).toContain('Username is required');
  });
});
