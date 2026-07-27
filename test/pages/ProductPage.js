class ProductPage {
  get productTitle() {
    return $(
      '//*[@resource-id="com.saucelabs.mydemoapp.android:id/productTV" and not(@text="Products") and not(@text="My Cart")]'
    );
  }

  get addToCartButton() {
    return $('id:com.saucelabs.mydemoapp.android:id/cartBt');
  }

  get increaseQuantity() {
    return $('~Increase item quantity');
  }

  get cartBadge() {
    return $('id:com.saucelabs.mydemoapp.android:id/cartTV');
  }

  get cartButton() {
    return $('~View cart');
  }

  async waitForLoaded() {
    await this.productTitle.waitForDisplayed({ timeout: 20000 });
  }

  async getTitle() {
    await this.waitForLoaded();
    return this.productTitle.getText();
  }

  async addToCart(quantity = 1) {
    await this.waitForLoaded();
    for (let i = 1; i < quantity; i += 1) {
      await this.increaseQuantity.click();
    }

    // Button sits below the fold on smaller emulator screens
    if (!(await this.addToCartButton.isDisplayed().catch(() => false))) {
      await $(
        'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cartBt"))'
      );
    }

    await this.addToCartButton.waitForDisplayed({ timeout: 10000 });
    await this.addToCartButton.click();
  }

  async getCartCount() {
    await this.cartBadge.waitForDisplayed({ timeout: 10000 });
    return this.cartBadge.getText();
  }

  async openCart() {
    await this.cartButton.click();
  }
}

export default new ProductPage();
