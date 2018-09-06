var express = require('express');
const puppeteer = require('puppeteer');
var router = express.Router();
var axios = require('axios');
var querystring = require('querystring');
var config = require('../common');

/* GET users listing. */
router.get('/', function(req, res, next) {
  axios
	.all([
    axios.get(`${config.api_server}/articles?_id=${req.query._id}`)
  ])
	.then(axios.spread((res1)=>{
    console.log(decodeURI(res1.data[0].content));
    res1.data[0].content = decodeURI(res1.data[0].content);
    res1.data[0].content = res1.data[0].content.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    // res1.data[0].content = res1.data[0].content.replace(/ /ig,'');//去掉 
    // res1.data[0].content = res1.data[0].content.replace(/^[\s　]+|[\s　]+$/g, "");//去掉全角半角空格
    res1.data[0].content = res1.data[0].content.replace(/[\r\n]/g,"");//去掉回车换行
		res.render('editor', { title: 'Express' ,article:res1.data[0]});
	}))
});
router.post('/save', function(req, res, next) {
  axios
	.all([
    axios.put(`${config.api_server}/articles/${req.query._id}`, querystring.stringify(req.body), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
  ])
	.then(axios.spread((res1)=>{
		res.end();
	}))
});
router.get('/print', function(req, res, next) {
  (async () => {
    const browser = await puppeteer.launch({
      executablePath: './bin/chrome-win32/chrome.exe',
      headless: true
    });
    const page = await browser.newPage();
    await page.emulateMedia('print');
    await page.goto(`${config.puppeteer_server}/viewer?_id=${req.query._id}`, {waitUntil: 'networkidle2'});
    const pagepdf = await page.pdf({path: 'public/'+req.query._id+'.pdf', format: 'A4',margin:{
        top: '33.5mm',
        left: '28mm',
        right: '26mm',
        bottom: '30mm'
    }});
    await browser.close();
    res.send({url:"/"+req.query._id+".pdf",name:"XXX.pdf"});
    res.end();
  })();
});
module.exports = router;
