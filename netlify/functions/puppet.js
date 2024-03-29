import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

const url = 'https://lite.cnn.com/'

chromium.setHeadlessMode = true
chromium.setGraphicsMode = false

export async function handler(event, context) {
  try {

    const rawBody = String(event.body);
    const params = new URLSearchParams(rawBody);

    // Create an object to store the parsed data
    const parsedBody = {};

    // Iterate through the parameters and set them in the object
    params.forEach((value, key) => {
      parsedBody[key] = value;
    });

    const pageToScreenshot = 'https://ajakuy.com';

    if (!pageToScreenshot) return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Page URL not defined' }),
      
    }


    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath('/var/task/node_modules/@sparticuz/chromium/bin')),
    })

    const page = await browser.newPage()
    await page.goto(pageToScreenshot, { waitUntil: 'networkidle2' });

    const screenshot = await page.screenshot({ encoding: 'binary' });

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Complete screenshot of ${pageToScreenshot}`,
        buffer: screenshot,
      })
    }

  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    }
  }
}
