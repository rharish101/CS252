var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { cases: req.coll });
  req.coll.find({DISTRICT: 'AGRA'}).then((docs) => {
    console.log("yoyo")
  })
});

module.exports = router;
