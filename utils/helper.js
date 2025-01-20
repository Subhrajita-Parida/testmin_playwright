const { allure } = require('allure-playwright');
const fs = require('fs')


function getCurrentDate() {
    const now = new Date();
    const day = now.getUTCDate(); 
    const month = now.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
    const year = now.getUTCFullYear(); 
    return `${day} ${month} ${year}`;
}

function getNewDate(daysToAdd = 7) {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() + daysToAdd); 
    const day = now.getUTCDate();
    const month = now.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
    const year = now.getUTCFullYear();
    return `${day} ${month} ${year}`;
}

async function assertWithAllureStep(stepName, fn) {
    await allure.step(stepName, async () => {
        await fn();
    });
}

function logToFile(message) {
    const logFilePath = 'testLogs.txt'; 
    fs.writeFileSync(logFilePath, '', 'utf8');
    fs.appendFileSync(logFilePath, message + '\n', 'utf8');
    console.log(message);
}

module.exports = {
     getCurrentDate,
     getNewDate ,
     assertWithAllureStep,
     logToFile
    };
