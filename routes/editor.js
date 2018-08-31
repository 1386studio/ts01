var express = require('express');
const puppeteer = require('puppeteer');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('editor', { title: 'Express' });
});
router.get('/print', function(req, res, next) {
  (async () => {
    const browser = await puppeteer.launch({
      executablePath: './bin/chrome-win32/chrome.exe',
      headless: true
    });
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:3000/viewer', {waitUntil: 'networkidle2'});
    const pagepdf = await page.pdf({path: 'public/幅度萨芬.pdf', format: 'A4',margin:{
        top: '20mm',
        left: '15mm',
        right: '15mm',
        bottom: '20mm'
    }});
    await browser.close();
    res.send({url:"/幅度萨芬.pdf",name:"幅度萨芬.pdf"});
    res.end();
  })();
});
module.exports = router;
