import CatalogPage from '../pages/CatalogPage.js';
import ProductPage from '../pages/ProductPage.js';
import CartPage from '../pages/CartPage.js';
import { products } from '../data/users.js';

const APP_PACKAGE = 'com.saucelabs.mydemoapp.android';

describe('My Demo App — Cart', () => {
  beforeEach(async () => {
    await driver.terminateApp(APP_PACKAGE);
    await driver.activateApp(APP_PACKAGE);
    await CatalogPage.waitForLoaded();
  });

  it('should add a product to the cart', async () => {
    await CatalogPage.openProduct(products.backpack);
    await ProductPage.addToCart(1);

    const cartCount = await ProductPage.getCartCount();
    await expect(cartCount).toBe('1');

    await ProductPage.openCart();
    await CartPage.waitForLoaded();
    const name = await CartPage.getProductName();
    await expect(name).toBe(products.backpack);
  });

  it('should remove a product from the cart', async () => {
    await CatalogPage.openProduct(products.backpack);
    await ProductPage.addToCart(1);
    await ProductPage.openCart();
    await CartPage.waitForLoaded();
    await CartPage.removeItem();
    await expect(await CartPage.isEmpty()).toBe(true);
  });
});
