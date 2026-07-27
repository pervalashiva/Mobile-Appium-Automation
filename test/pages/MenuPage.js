class MenuPage {
  get loginMenuItem() {
    return $('//*[@text="Log In"]');
  }

  get logoutMenuItem() {
    return $('//*[@text="Log Out"]');
  }

  get catalogMenuItem() {
    return $('//*[@text="Catalog"]');
  }

  get confirmLogoutButton() {
    return $('//*[@text="LOG OUT"]');
  }

  async goToLogin() {
    await this.loginMenuItem.waitForDisplayed({ timeout: 15000 });
    await this.loginMenuItem.click();
  }

  async goToCatalog() {
    await this.catalogMenuItem.waitForDisplayed({ timeout: 15000 });
    await this.catalogMenuItem.click();
  }

  async logout() {
    await this.logoutMenuItem.waitForDisplayed({ timeout: 15000 });
    await this.logoutMenuItem.click();
    await this.confirmLogoutButton.waitForDisplayed({ timeout: 10000 });
    await this.confirmLogoutButton.click();
  }
}

export default new MenuPage();
