const { expect } = require('@playwright/test');
require('dotenv').config();
const data = require("../data/data.json");
const { getCurrentDate, getNewDate, assertWithAllureStep, logToFile } = require('../utils/helper'); 

exports.BookingApplication = class BookingApplication {
    constructor(page) {
        this.page = page;
        this.place = page.locator("//input[@placeholder='Where are you going?']");
        this.placeText = page.locator("//div[@id='group-0-heading']");
        this.mainCalendar = page.locator("//div[@data-testid='searchbox-datepicker-calendar']");
        this.calendar = page.locator("//div[@data-testid='searchbox-dates-container']");
        this.getCheckInDate = (date) => page.locator(`//span[@aria-label='${date}']`);
        this.getCheckOutDate = (formattedDate) => page.locator(`//span[@aria-label='${formattedDate}']`);
        this.occupancy = page.locator("//button[@data-testid='occupancy-config']");
        this.reduceMember = page.locator("(//div[@data-testid='occupancy-popup']//div//div//div//following-sibling::div//button)[1]");
        this.done = page.locator("//span[text()='Done']");
        this.search = page.locator("//button[@type='submit']");
        this.propertyType = page.locator("//legend[text()='Property Type']");
        this.checkbox = page.locator("//input[@type='checkbox']");
        this.listView = page.locator("//div[@role='list']");
        this.popUps = page.locator("//button[@aria-label='Dismiss sign-in info.']");
        this.hotel = page.locator("(//div[text()='Hotels'])[1]");
        this.hotelProperty = page.locator("//div[@data-filters-group='ht_id']//input[@id=':r1i:']//following-sibling::label");
        this.facilitiesLocators = (facilitiesText) => page.locator(`(//div[text()='${facilitiesText}'])[1]`);
    }

    async navigateToURL() {
        await assertWithAllureStep('Navigating to URL', async () => {
            await this.page.goto(process.env.bookingAppUrl);
            logToFile("Booking Application: ")
        });
    }

    async handlingPopups() {
        await assertWithAllureStep('Handling popups', async () => {
            if (this.popUps.isVisible()) {
                await this.popUps.click();
            } else {
                await this.page.reload();
            }
        });
    }

    async validatePage() {
        await assertWithAllureStep('Validating page URL', async () => {
            await expect(this.page).toHaveURL(process.env.bookingAppUrl);
        });
        await assertWithAllureStep('Validating the page title', async () => {
            await expect(this.page).toHaveTitle(data.bookingApp.applicationTitle);
        });
        const pageTitle = await this.page.title();
        logToFile(`Page Title is: ${pageTitle}`)
        await assertWithAllureStep('Checking the page title text content', async () => {
            expect(pageTitle).toContain(data.bookingApp.appLogo);
        });
    }

    async validateSearchContent() {
        await assertWithAllureStep('Validating the destination input and calendar visibility', async () => {
            await this.place.click(); 
            await this.place.fill(data.bookingApp.destination); 
            await this.calendar.click();
            const isVisible = await this.mainCalendar.isVisible();
        });
        const currentDate = getCurrentDate();
        const checkInDate = this.getCheckInDate(currentDate);
        logToFile(`Check in Date: ${checkInDate}`);
        await assertWithAllureStep(`Selecting the check-in date: ${currentDate}`, async () => {
            await checkInDate.click(); 
        });
        const newDate = getNewDate(7);
        const checkoutDate = this.getCheckOutDate(newDate);
        logToFile(`Check out Date: ${checkoutDate}`);
        await assertWithAllureStep(`Selecting the check-out date: ${newDate}`, async () => {
            await checkoutDate.click(); 
        });
        await assertWithAllureStep('Configuring occupancy', async () => {
            await this.occupancy.click(); 
            await this.reduceMember.click(); 
            await this.done.click(); 
        });
        await assertWithAllureStep('Initiating the search', async () => {
            await this.search.click(); 
        });
    }


    async filteringSearchContent() {
        await assertWithAllureStep('Checking the filter content visibility', async () => {
            await expect(this.listView).not.toBeHidden();
        });
        const text = await this.propertyType.textContent();
        logToFile(`Property text: ${text}`)
        await assertWithAllureStep('Validating the properties text', async () => {
            expect(text).toContain(data.bookingApp.txtProperty);
        });
        await assertWithAllureStep('Validating hotel checkbox is not checked', async () => {
            await expect(this.hotel).not.toBeChecked();
        });
        await assertWithAllureStep('Clicking the hotel checkbox', async () => {
            await this.hotel.click();
            await this.page.waitForTimeout(parseInt(process.env.timeout));
        });
        for (const facility of data.facilitiesToCheck) {
            const facilityLabel = this.facilitiesLocators(facility.text);
            logToFile(`All the facilities: ${facility.text}`)
            await assertWithAllureStep(`Validating the checkbox for the facility: ${facility.text}`, async () => {
                await facilityLabel.click();
                const isChecked = await facilityLabel.isChecked();
                expect(isChecked).toBe(true);
            });
        }
    }
};
