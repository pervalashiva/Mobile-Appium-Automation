class CatalogPage {
  get menuButton() {
    return $('~View menu');
  }

  get cartButton() {
    return $('~View cart');
  }

  get catalogTitle() {
    return $('//*[@resource-id="com.saucelabs.mydemoapp.android:id/productTV" and @text="Products"]');
  }

  get productItems() {
    return $$('id:com.saucelabs.mydemoapp.android:id/titleTV');
  }

  productByName(name) {
    return $(`//*[@resource-id="com.saucelabs.mydemoapp.android:id/titleTV" and @text="${name}"]`);
  }

  async waitForLoaded() {
    await this.catalogTitle.waitForDisplayed({ timeout: 30000 });
  }

  async openMenu() {
    await this.menuButton.waitForDisplayed({ timeout: 15000 });
    await this.menuButton.click();
  }

  async openProduct(name) {
    const product = this.productByName(name);
    if (!(await product.isDisplayed().catch(() => false))) {
      await $(
        `android=new UiScrollable(new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productRV")).scrollIntoView(new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/titleTV").text("${name}"))`
      );
    }
    await product.waitForDisplayed({ timeout: 15000 });

    // Only the product image is clickable in the catalog grid
    const image = $(
      `//*[@resource-id="com.saucelabs.mydemoapp.android:id/titleTV" and @text="${name}"]/preceding-sibling::android.widget.ImageView[@content-desc="Product Image"]`
    );
    await image.waitForDisplayed({ timeout: 10000 });
    await image.click();

    // Confirm navigation to product detail (catalog header also uses productTV)
    await $(
      `//*[@resource-id="com.saucelabs.mydemoapp.android:id/productTV" and @text="${name}"]`
    ).waitForDisplayed({ timeout: 15000 });
  }

  async openCart() {
    await this.cartButton.waitForDisplayed({ timeout: 15000 });
    await this.cartButton.click();
  }

  async getVisibleProductNames() {
    await this.waitForLoaded();
    const items = await this.productItems;
    const names = [];
    for (const item of items) {
      names.push(await item.getText());
    }
    return names;
  }
}

export default new CatalogPage();
