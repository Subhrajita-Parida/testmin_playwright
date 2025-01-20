const {expect} = require('@playwright/test');
require('dotenv').config();
const data = require('../data/data.json');
const { assertWithAllureStep } = require('../utils/helper');

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

    async navigateToURL(){
        await this.page.goto(process.env.testimUrl);
    }

    async validateHeaderComponents(){
        await assertWithAllureStep('Validation of page Url',async()=>{
            await expect(this.page).toHaveURL(process.env.testimUrl);
            const menuCount = await this.menuItems.count();
        for (let i = 0; i < menuCount; i++) {
            const menu = this.menuItems.nth(i);
            await menu.hover();
            const dropdown = menu.locator("div.drop");
            await dropdown.isVisible();
    }
        })
        
    }

    async validateCompanySection(){
        await this.companyText.click();
        await assertWithAllureStep('Validation of about text',async()=>{
            await expect(this.aboutText).toContainText(data.companySection.text);
            expect(this.customers).toBeVisible()
        })
        await assertWithAllureStep('Careers text is not hidden',async()=>{
            await expect(this.careers).not.toBeHidden();
        })
        await assertWithAllureStep('Testim Partners is visible',async()=>{
            const isVisible= await this.testimPartners.isVisible();
            expect(isVisible).toBeTruthy();
        })
        
       
    }

    async validatecustomerSection(){
       await assertWithAllureStep('Validating the customer page url', async()=>{
        await this.customers.click();
        await expect(this.page).toHaveURL(process.env.customerUrl);
        await this.review.click();
       })
       await assertWithAllureStep('validating custumer name is having text',async()=>{
        await expect(this.customerName).toHaveText(data.customerSection.name);
       })
       await assertWithAllureStep('Retreive and review customer name and content from data', async()=>{
        const reviewDetails = {
            customerName: await this.customerName.textContent(),
            reviewContent: await this.reviewContent.textContent(),
            };
            const displayedName = await this.customerName.textContent();
        expect(displayedName).toBe(reviewDetails.customerName,'Comparing the retreived name with actual name');
        const displayedContent = await this.reviewContent.textContent();
        expect(displayedContent).toBe(reviewDetails.reviewContent,'Comparing the review content with actual name');
       })
    }
    

    async validateFooter(){
      await assertWithAllureStep('Checking the footer visibilty',async()=>{
        await this.footer.scrollIntoViewIfNeeded();
        const isVisible = await this.footer.isVisible();
        expect(isVisible).toBeTruthy();
        })
      await assertWithAllureStep('Validating the privacy content text',async()=>{
          const privacyHref = await this.privacyLinks.getAttribute(data.footerSection.attribute);
            expect(privacyHref).toContain(data.footerSection.link);
        })
    }
}