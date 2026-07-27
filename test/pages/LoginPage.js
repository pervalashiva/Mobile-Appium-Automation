class LoginPage {
  get usernameField() {
    return $('id:com.saucelabs.mydemoapp.android:id/nameET');
  }

  get passwordField() {
    return $('id:com.saucelabs.mydemoapp.android:id/passwordET');
  }

  get loginButton() {
    return $('id:com.saucelabs.mydemoapp.android:id/loginBtn');
  }

  get errorMessage() {
    return $('id:com.saucelabs.mydemoapp.android:id/passwordErrorTV');
  }

  get usernameError() {
    return $('id:com.saucelabs.mydemoapp.android:id/nameErrorTV');
  }

  async waitForLoaded() {
    await this.usernameField.waitForDisplayed({ timeout: 20000 });
  }

  async login(username, password) {
    await this.waitForLoaded();
    await this.usernameField.clearValue();
    await this.usernameField.setValue(username);
    await this.passwordField.clearValue();
    await this.passwordField.setValue(password);
    await this.loginButton.click();
  }

  async getPasswordError() {
    await this.errorMessage.waitForDisplayed({ timeout: 10000 });
    return this.errorMessage.getText();
  }

  async getUsernameError() {
    await this.usernameError.waitForDisplayed({ timeout: 10000 });
    return this.usernameError.getText();
  }
}

export default new LoginPage();
