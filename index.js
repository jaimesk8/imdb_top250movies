const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const fs = require('fs');
const cors = require('cors');
app.use(cors());
app.use(express.json());

(async () => { 
  let browser = null;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://www.imdb.com/chart/top/?ref_=nv_mv_250');
    await page.waitForSelector('.icb-btn');
    await page.click('.icb-btn');
    
    const maps_data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".sc-b189961a-0")).map((el) => {
        const name = el.querySelector(".ipc-title__text").innerText.trim();
        const rating = el.querySelector(".ipc-rating-star--rating").innerText.trim();
        const info = el.querySelector(".sc-b189961a-7").innerText.trim();
        return { name, rating, info };
      });
    });

    // Save the data to a JSON file in the project folder
    fs.writeFileSync('data.json', JSON.stringify(maps_data, null, 2), 'utf-8');
    console.log('Data saved to data.json');
    
    console.log("Final data", maps_data);
    await browser.close();

  } catch (error) {
    console.log(error);
  }
})();
