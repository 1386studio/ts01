var express = require('express');
var router = express.Router();
var axios = require('axios');
/* GET users listing. */
router.get('/', function(req, res, next) {
  axios
	.all([
    axios.get('http://192.168.2.43:1337/articles?_id='+req.query._id)
  ])
	.then(axios.spread((res1)=>{
    res.render('viewer', { title: 'Express', article: res1.data[0] });
	}))
});

module.exports = router;
