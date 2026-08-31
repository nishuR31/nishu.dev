import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  let hydrationError = null;

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Hydration') || text.includes('Minified React error')) {
      hydrationError = text;
      console.log('HYDRATION ERROR:', text);
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  if (!hydrationError) {
    console.log('No hydration errors found.');
  }

  await browser.close();
})();
