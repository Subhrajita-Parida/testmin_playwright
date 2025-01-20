const {expect} = require('@playwright/test')
require('dotenv').config();
const data = require('../data/data.json');
const { assertWithAllureStep } = require('../utils/helper');

exports.YoutubeApplication = class YoutubeApplication{
    constructor(page){
        this.page = page;
        this.txtDescription = page.locator("//meta[@name='description']")
        this.txtViewport = page.locator("//meta[@name='viewport']")
        this.searchBar = page.locator('.ytSearchboxComponentInputBox input');
        this.searchButton = page.locator('.ytSearchboxComponentSearchButton');
        this.videoResults = page.locator("//h3[contains(@class,'title')]")
        // this.skipAdButton = page.locator('#skip-button:i')
        this.firstVideo = page.locator("(//yt-lockup-view-model[contains(@class,'section-renderer lockup')])[1]");
        this.playPauseButton = page.locator('button.ytp-play-button');
        this.videoProgress = page.locator('.ytp-time-current');
        this.settingsButton = page.locator('.ytp-settings-button'); 

    }

    async navigateToURL(){
        await this.page.goto(process.env.youtubeUrl);
    }

    async validatePageTitle(){
        await assertWithAllureStep('Validating the page url',async()=>{
            await expect(this.page).toHaveURL(process.env.youtubeUrl);
        })
        await assertWithAllureStep('Validating the page url',async()=>{
            await expect(this.page,'Page Title').toHaveTitle(data.youtubeApp.appTitle)
        })
        await assertWithAllureStep('Validating the page url',async()=>{
            await expect(this.txtDescription,'Description text is hidden').toBeHidden();
        })
        await assertWithAllureStep('Validating the page url',async()=>{
            await expect(this.txtViewport,'Viewport is not visible').not.toBeVisible();

        })

    }
    async searchingYoutubeQuery(){
        await this.searchBar.fill(data.youtubeApp.query);
        await this.searchButton.click();
        const videos = 'ytd-video-renderer'
        await this.page.waitForSelector(videos, { timeout: parseInt(process.env.samllTimeout) });
    }
    async validateVideoResults() {
        await assertWithAllureStep('Video count should be greater than 5',async()=>{
            await this.searchingYoutubeQuery()
            for(let i=0;i<5;i++){
            const videoCount = await this.videoResults.count();
            if(videoCount>=5)
            {
               expect(videoCount).toBeGreaterThanOrEqual(5);
            }
            else{
                await this.page.reload();
                await this.searchingYoutubeQuery()
    
            }
         }
        })
       
    }
    
    async validateVideoLoading() {
        await assertWithAllureStep('Play and Pause button is visible',async()=>{
            await this.firstVideo.click(); 
            await this.page.waitForSelector('video', { timeout: parseInt(process.env.samllTimeout)});
            await expect(this.playPauseButton).toBeVisible();
        })
        await assertWithAllureStep('Progress before video starts',async()=>{
            const progressBefore = await this.videoProgress.textContent();
            await this.page.waitForTimeout(parseInt(process.env.mediumTimeout));
            const progressAfter = await this.videoProgress.textContent();
            expect(progressBefore).not.toEqual(progressAfter,'Video progress after video starts');
            await this.settingsButton.click();
        })
        
    }
    
    
}