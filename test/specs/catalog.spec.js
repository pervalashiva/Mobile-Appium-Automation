import CatalogPage from '../pages/CatalogPage.js';
import ProductPage from '../pages/ProductPage.js';
import { products } from '../data/users.js';

const APP_PACKAGE = 'com.saucelabs.mydemoapp.android';

describe('My Demo App — Catalog', () => {
  beforeEach(async () => {
    await driver.terminateApp(APP_PACKAGE);
    await driver.activateApp(APP_PACKAGE);
    await CatalogPage.waitForLoaded();
  });

  it('should display products on the catalog screen', async () => {
    const names = await CatalogPage.getVisibleProductNames();
    await expect(names.length).toBeGreaterThan(0);
    await expect(names).toContain(products.backpack);
  });

  it('should open a product detail screen', async () => {
    await CatalogPage.openProduct(products.backpack);
    const title = await ProductPage.getTitle();
    await expect(title).toBe(products.backpack);
  });
});
