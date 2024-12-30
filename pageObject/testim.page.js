const {expect} = require('@playwright/test');
require('dotenv').config();
const data = require('../data/data.json')

exports.NavigateTestim = class NavigateTestim{
    constructor(page){
        this.page = page;
        this.logo = page.locator("//img[@alt='Tricentis Testim Logo']");
        this.companyText = page.locator("//a[text()='Company']");
        this.aboutText = page.locator("//span[contains(text(),'About')]");
        this.customers = page.locator("//span[text()='Customers']")
        this.careers = page.locator("//span[text()='Careers']")
        this.testimPartners = page.locator("//span[text()='Testim Partners']");
        this.review = page.locator("(//div[@class='item-body']//p)[3]");
        this.customerName = page.locator("//div[text()='Micah L']");
        this.reviewContent = page.locator("//div[contains(text(),'Co-Founder')]")
        this.menuItems = page.locator(".h-nav > li.has-drop"); 
        this.footer = page.locator("//div[@class='p-footer-frame']");
        this.dynamicHeader = (text) =>page.locator(`//a[text()='${text}']`)
        this.privacyLinks =  page.locator("//a[text()='Privacy Policy']");

    }

    async checkUrl(){
        await this.page.goto(process.env.testimUrl);
    }

    async headerComponents(){
        await expect(this.page).toHaveURL(process.env.testimUrl);
        const menuCount = await this.menuItems.count();
        for (let i = 0; i < menuCount; i++) {
            const menu = this.menuItems.nth(i);
            await menu.hover();
            const dropdown = menu.locator("div.drop");
            await dropdown.isVisible();
        
    }

    }

    async companySection(){
        await this.companyText.click();
        await expect(this.aboutText).toContainText(data.companySection.text);
        expect(this.customers).toBeVisible()
        await expect(this.careers).not.toBeHidden();
        const isVisible= await this.testimPartners.isVisible();
        expect(isVisible).toBeTruthy();
       
    }

    async customerSection(){
       await this.customers.click();
       await expect(this.page).toHaveURL(process.env.customerUrl);
       await this.review.click();
       await expect(this.customerName).toHaveText(data.customerSection.name);
       const reviewDetails = {
       customerName: await this.customerName.textContent(),
       reviewContent: await this.reviewContent.textContent(),
       };
       const displayedName = await this.customerName.textContent();
       const displayedContent = await this.reviewContent.textContent();
       expect(displayedName).toBe(reviewDetails.customerName);
       expect(displayedContent).toBe(reviewDetails.reviewContent);
    }
    

    async validateFooter(){
        await this.footer.scrollIntoViewIfNeeded();
        const isVisible = await this.footer.isVisible();
        expect(isVisible).toBeTruthy();
        const privacyHref = await this.privacyLinks.getAttribute(data.footerSection.attribute);
        expect(privacyHref).toContain(data.footerSection.link);
    }
}