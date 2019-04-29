const puppeteer = require('puppeteer');
const fs = require('fs');
const util = require('util');
const TIME_DELAY_MS = 500;
const SECOND_ARRAY_EL = 1;

fs.readFileAsync = util.promisify(fs.readFile);
fs.writeFileAsync = util.promisify(fs.writeFile);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/tokens/new',
    { waitUntil: ['load', 'domcontentloaded'] });
  await page.type('input[name="username"]', 'admin@refocus.admin');
  await page.type('input[name="password"]', 'devPassword');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  const d = new Date();
  const tokenName = 'test_' + d.getTime().toString();
  await page.type('input', tokenName);
  await page.click('button');
  await page.waitFor(TIME_DELAY_MS);
  const element = await page.$('#tokenInfo');
  const text = await (await element.getProperty('textContent')).jsonValue();
  const apiToken = text.split('Token value: ')[SECOND_ARRAY_EL];
  let data = await fs.readFileAsync('.env', 'utf-8');
  data += `\n\nAPI_TOKEN=${apiToken}`;
  await fs.writeFileAsync('.env', data, 'utf-8');
  await browser.close();
})();
