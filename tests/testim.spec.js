import {test} from '@playwright/test'
import { NavigateTestim } from '../pageObject/testim.page'

test.describe('Testim Navigation', ()=>{
    let navigateTestim ;

test.beforeEach('Navigate', async({page})=>{
    navigateTestim = new NavigateTestim(page);
    await navigateTestim.checkUrl();
})
 

test('Checking Url and headers', async()=>{
    await navigateTestim.headerComponents();
    await navigateTestim.companySection();
    await navigateTestim.customerSection();
    await navigateTestim.validateFooter();
})
})