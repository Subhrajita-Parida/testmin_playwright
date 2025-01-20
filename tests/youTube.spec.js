import {test} from '@playwright/test'
const index = require('../utils/index.page')

test.describe('Youtube Application Tests', ()=>{
let youtubeApplication;
test.beforeEach('Initialize Youtube Application Page', async({page})=>{
youtubeApplication = new index.YoutubeApplication(page);
})

test('Validating The Whole Flow of Youtube Application ',async()=>{
    await youtubeApplication.navigateToURL();
    await youtubeApplication.validatePageTitle();
    await youtubeApplication.validateVideoResults();
    await youtubeApplication.validateVideoLoading();
})
})