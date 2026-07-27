class CartPage {
  get screenTitle() {
    return $('//*[@resource-id="com.saucelabs.mydemoapp.android:id/productTV" and @text="My Cart"]');
  }

  get productName() {
    return $('id:com.saucelabs.mydemoapp.android:id/titleTV');
  }

  get productQuantity() {
    return $('id:com.saucelabs.mydemoapp.android:id/noTV');
  }

  get proceedToCheckoutButton() {
    return $('~Confirms products for checkout');
  }

  get removeButton() {
    return $('~Removes product from cart');
  }

  get emptyCartMessage() {
    return $('//*[@text="No Items"]');
  }

  get goShoppingButton() {
    return $('//*[@text="Go Shopping"]');
  }

  async waitForLoaded() {
    await this.screenTitle.waitForDisplayed({ timeout: 20000 });
  }

  async getProductName() {
    await this.productName.waitForDisplayed({ timeout: 15000 });
    return this.productName.getText();
  }

  async getQuantity() {
    await this.productQuantity.waitForDisplayed({ timeout: 10000 });
    return this.productQuantity.getText();
  }

  async removeItem() {
    await this.removeButton.waitForDisplayed({ timeout: 10000 });
    await this.removeButton.click();
  }

  async isEmpty() {
    // Empty cart may show "No Items" and/or "Go Shopping"
    const noItems = await this.emptyCartMessage.isDisplayed().catch(() => false);
    const goShopping = await this.goShoppingButton.isDisplayed().catch(() => false);
    return noItems || goShopping;
  }
}

export default new CartPage();
