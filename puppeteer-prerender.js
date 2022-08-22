const puppeteer = require('puppeteer');
const http = require('http-server');
const fs = require('fs-extra');
const path = require('path');
const output = path.resolve(__dirname, '../prerender.html'); //文件输出位置
const root = path.resolve(__dirname, './dist'); // 项目打包地址
const PORT = 3003; //端口号
http
  .createServer({
    root,
    cors: true,
  })
  .listen(PORT, async () => {
    console.log('server is running');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}`);
    const data = await page.evaluate(() => document.documentElement.innerHTML);
    await browser.close();
    console.log('render file fetched');
    try {
      await fs.outputFile(output, data);
      console.log('render file generated');
    } catch (e) {
      console.log('render file generated failed,please check  ', e.message);
    }
  });
