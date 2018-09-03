var express = require('express');
const puppeteer = require('puppeteer');
var router = express.Router();
var axios = require('axios');

/* GET users listing. */
router.get('/', function(req, res, next) {
  axios
	.all([
    axios.get('http://192.168.2.43:1337/articles?_id='+req.query._id)
  ])
	.then(axios.spread((res1)=>{
    res1.data[0].content = res1.data[0].content.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    res1.data[0].content = res1.data[0].content.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    res1.data[0].content = res1.data[0].content.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    res1.data[0].content = res1.data[0].content.replace(/ /ig,'');//去掉 
    res1.data[0].content = res1.data[0].content.replace(/^[\s　]+|[\s　]+$/g, "");//去掉全角半角空格
    res1.data[0].content = res1.data[0].content.replace(/[\r\n]/g,"");//去掉回车换行
		res.render('editor', { title: 'Express' ,article:res1.data[0]});
	}))
});
router.post('/save', function(req, res, next) {
  axios
	.all([
    axios.put('http://192.168.2.43:1337/articles?_id='+req.query._id, req.body)
  ])
	.then(axios.spread((res1)=>{
    console.log(res1.data);
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
    await page.goto('/viewer?_id='+req.query._id, {waitUntil: 'networkidle2'});
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
