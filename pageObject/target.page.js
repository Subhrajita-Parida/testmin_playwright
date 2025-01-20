const { expect } = require("@playwright/test");
require("dotenv").config();
const data = require("../data/data.json");
const { logToFile } = require("../utils/helper");

exports.TargetApplication = class TargetApplication {
  constructor(page) {
    this.page = page;
    this.mainMenu = page.locator("//a[@aria-label='Main menu']")
    this.headerComponent = (component)=> page.locator(`(//a[@aria-label='${component}'])[1]`)
    this.searchBox = page.locator("//input[@id='search']")
    this.watch = page.locator("//div[text()='Cubitt Jr Smart Watch Fitness Tracker for Kids']");
    this.watchDetailsPage = page.locator("//h1[@id='pdp-product-title-id']")
    this.sale = (data) => page.locator(`//span[@data-test='${data}']`);
    this.originalPrice = page.locator("//span[@data-test='product-regular-price']//span")
    this.discountPrice = page.locator("//span[@data-test='product-price']")
    this.savingAmount = page.locator("//span[@data-test='product-savings-amount']");
  }
  async navigateToURL() {
    await this.page.goto(`${process.env.targetUrl}`,{timeout:parseInt(process.env.maximumTimeout)});
    logToFile("Target Application: ")
    await expect(this.page).toHaveURL(process.env.targetUrl);
    await expect(await this.mainMenu).toBeHidden();
    for(const element of data.headerComponents){
      const components = await this.headerComponent(element)
      logToFile("Element: ", element);
      logToFile("Component: ",components);
      await expect(components).toBeVisible();

    }
  }

  async validateSearchBox(){
    await this.searchBox.click();
    await this.searchBox.fill(data.targetApp.input);
    await this.searchBox.press('Enter');
    await expect(this.searchBox).toHaveValue(data.targetApp.input);
    await this.page.waitForLoadState();
    await expect(this.watch).not.toBeHidden();
    await this.watch.click();
    for(const locator of data.locators){
      const locatorData = await this.sale(locator);
      await expect(locatorData).toBeVisible();
    }
    await expect(this.watchDetailsPage).toBeVisible();

  }

  async validateDiscountCalculation(){
    const txtOriginalPrice = await this.originalPrice.textContent();
    const txtDiscountPrice = await this.discountPrice.textContent();
    const price = Number(txtOriginalPrice.substring(1));
    const newPrice = Number(txtDiscountPrice.substring(1));
    const discount = price - newPrice ;
    expect(this.savingAmount).toEqual(discount)
    logToFile("Type of difference is: ",typeof difference);
    logToFile("Type of original price is: ",typeof txtOriginalPrice);
    logToFile("Type of number format of original price is: ",typeof price);
    logToFile("Price is: ", price);
    const percentageDiscount = (discount/price)* 100;
    logToFile("Discount is in % ",percentageDiscount);
    
  }
};
