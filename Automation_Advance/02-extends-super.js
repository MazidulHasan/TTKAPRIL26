class BasePage {
  constructor(pageName) {
    // console.log("BasPage constructor is called");
    this.pageName = pageName;
  }

  open() {
    return `Opening the ${this.pageName} page`;
  }
}






// EXTENDS
// "extends" makes LoginPage a child of BasePage.
// LoginPage can now reuse properties and methods from BasePage.
class LoginPage extends BasePage {
  constructor(pageName, loginButtonText) {
    // console.log('Login Page constructor is called');
    
    // SUPER
    // "super" calls the parent constructor and sets this.pageName.
    // In a child constructor, call super() before using "this".
    super(pageName);
    // console.log('Parent constructor done');
    this.loginButtonText = loginButtonText;
    // console.log('Done with login Construcotr');
    
  }

  clickLoginButton() {
    return `Clicking the ${this.loginButtonText} button`;
  }
}


class CartPage extends BasePage {
  constructor(pageName, loginButtonText) {
    // console.log('Login Page constructor is called');
    
    // SUPER
    // "super" calls the parent constructor and sets this.pageName.
    // In a child constructor, call super() before using "this".
    super(pageName);
    // console.log('Parent constructor done');
    this.loginButtonText = loginButtonText;
    // console.log('Done with login Construcotr');
    
  }

  clickLoginButton() {
    return `Clicking the ${this.loginButtonText} button`;
  }
}



const loginPage = new LoginPage('Login', 'Sign in');
const cartpage = new CartPage('cart', 'Sign in forcart');

// open() is inherited from BasePage.
console.log(loginPage.open());



// clickLoginButton() belongs to LoginPage.
console.log(loginPage.clickLoginButton());