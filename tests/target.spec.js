import {test} from '@playwright/test';
const index = require('../utils/index.page') 

test.describe('Target Application Tests',async()=>{
    let targetApplication;

    test.beforeEach('Initialize and Navigation of Testim Application Page', async({page})=>{
        targetApplication = new index.TargetApplication(page);
    })

    test("Validating Page url and header components",async()=>{
        await targetApplication.navigateToURL();
        await targetApplication.validateSearchBox();
        await targetApplication.validateDiscountCalculation();
    });

    // test("Validating search box", async()=>{
    //     await targetApplication.validateSearchBox();
    // })

})