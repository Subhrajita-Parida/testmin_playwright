import { test } from "@playwright/test";
const index = require("../utils/index.page");

test.describe("Booking Application Tests", () => {
  let bookingApplication;

  test.beforeEach("Initialize Booking Application Page", async ({ page }) => {
    bookingApplication = new index.BookingApplication(page);
  });

  test("Validating the Booking application's all fields", async () => {
    await bookingApplication.navigateToURL();
    await bookingApplication.handlingPopups();
    await bookingApplication.validatePage();
    await bookingApplication.validateSearchContent();
    await bookingApplication.filteringSearchContent();
  });
});
