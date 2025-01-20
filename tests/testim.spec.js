import { test } from "@playwright/test";
const index = require("../utils/index.page");

test.describe("Testim Application Tests", () => {
  let navigateTestim;

  test.beforeEach("Initialize and Navigation of Testim Application Page", async ({ page }) => {
    navigateTestim = new index.NavigateTestim(page);
    await navigateTestim.navigateToURL();
  });

  test("Validating Header Components and Sections", async () => {
    await navigateTestim.validateHeaderComponents();
    await navigateTestim.validateCompanySection();
    await navigateTestim.validatecustomerSection();
    await navigateTestim.validateFooter();
  });
});
