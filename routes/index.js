var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  axios
	.all([
    axios.get('https://jsonplaceholder.typicode.com/posts')
  ])
	.then(axios.spread((res1)=>{
    // console.log(res1.data);
		res.render('index', { title: 'Express' ,articles:res1.data});
	}))
});
router.get('/list', function(req, res, next) {
  axios
	.all([
    axios.get('http://192.168.2.43:1337/articles?_start='+req.query.page*req.query.limit+'&_limit='+req.query.limit)
    // axios.get('http://192.168.2.43:1337/articles/count')
  ])
	.then(axios.spread((res1)=>{
		res.send({
      "code": 0,
      "msg": "",
      "count": 1000,
      "data": res1.data
    } );
	}))
});

module.exports = router;
