const puppeteer = require('puppeteer');
const fs = require('fs');
const util = require('util');
fs.readFileAsync = util.promisify(fs.readFile);
fs.writeFileAsync = util.promisify(fs.writeFile);

async function setAPIToken() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/tokens/new',
  	{waitUntil: ['load', 'domcontentloaded']});
  await page.type('input[name="username"]', 'admin@refocus.admin');
  await page.type('input[name="password"]', 'devPassword');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  const d = new Date();
  const tokenName = 'test_' + d.getTime().toString();
  await page.type('input', tokenName);
  await page.click('button');
  await page.waitFor(500);
  const element = await page.$("#tokenInfo");
  const text = await (await element.getProperty('textContent')).jsonValue();
  const apiToken = text.split('Token value: ')[1];
  process.env.API_TOKEN = apiToken;
  // const stringData = JSON.stringify(apiToken);
  return fs.readFileAsync('.env', 'utf-8').then((data) => {
  	data += `\n\nAPI_TOKEN=${apiToken}`;
  	return data;
  })
  .then((data) => {
  	return fs.writeFileAsync('.env', data, 'utf-8')
  });
};

setAPIToken()
	.then(() => process.exit());
