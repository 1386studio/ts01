var express = require('express');
var router = express.Router();
var axios = require('axios');
var config = require('../common');
/* GET users listing. */
router.get('/', function(req, res, next) {
  axios
	.all([
    axios.get(`${config.api_server}/articles/${req.query._id}`)
  ])
	.then(axios.spread((res1)=>{
    res.render('viewer', { title: 'Express', article: res1.data });
	}))
});

module.exports = router;
