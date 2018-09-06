var express = require('express');
var router = express.Router();
var axios = require('axios');
var config = require('../common');

router.get('/', function(req, res, next) {
  axios
	.all([
    axios.get(`${config.api_server}/unittype`)
  ])
	.then(axios.spread((res1)=>{
		res.render('index', { title: 'Express' ,units:res1.data});
	}))
});
router.get('/list', function(req, res, next) {
  let all = (req.query.q == '全部' || !req.query.q) ? '' : '&_q='+encodeURI(req.query.q);
  axios
	.all([
    axios.get(`${config.api_server}/articles?_start=${(req.query.page-1)*req.query.limit}&_limit=${req.query.limit}${all}`),
    axios.get(`${config.api_server}/articles/count`)
  ])
	.then(axios.spread((res1,res2)=>{
		res.send({
      "code": 0,
      "msg": "",
      "count": parseInt(res2.data),
      "data": res1.data
    } );
	}))
});

module.exports = router;
