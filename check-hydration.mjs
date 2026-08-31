import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('CONSOLE [', msg.type(), ']:', msg.text());
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  
  page.on('error', error => {
    console.log('ERROR:', error.message);
  });

  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  
  await page.screenshot({ path: 'preview.png', fullPage: true });
  console.log('Screenshot saved to preview.png');

  await browser.close();
})();
