import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  try {
    await page.goto('http://localhost:5175', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('Page loaded successfully without crashing.');
  } catch (err) {
    console.log('Navigation error:', err.message);
  }
  
  await browser.close();
})();
