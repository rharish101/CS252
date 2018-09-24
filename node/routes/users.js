var express = require('express');
var router = express.Router();
//var Batsmen = require('../models/Batsmen');
//var Cases = require('../models/Cases');

router.get('/', function(req,res){
	var db = req.db;
	var collection = db.get("cases");
        collection.aggregate([{$group:{_id: "$ZONE_NAME", "count": {$sum: 1}}},{$sort:{_id:1}}], function(e, total){
		collection.aggregate([{$match: {"Status": "Pending"}},{$group:{_id: "$ZONE_NAME", "count": {$sum: 1}}},{$sort:{_id:1}}], function(e, pending){
			var output = JSON.parse(JSON.stringify(total));
			for(i=0;i<total.length;i++){
			  output[i].count = 0.03;
			  for(j=0;j<pending.length;j++){
				if(total[i]._id == pending[j]._id){	
					output[i].count = (pending[j].count*1.0)/total[i].count;
				} 
			  }
			}
			res.json(output);
		});
    });
});

router.get('/:ZONE_NAME', function(req,res){
	var db = req.db;
	var collection = db.get("cases");
        collection.aggregate([{$match: {"ZONE_NAME": req.params['ZONE_NAME']}},{$group:{_id: "$RANGE_NAME", "count": {$sum: 1}}},{$sort:{_id:1}}], function(e, total){
		collection.aggregate([{$match: {"Status": "Pending"}},{$match: {"ZONE_NAME": req.params['ZONE_NAME']}},{$group:{_id: "$RANGE_NAME", "count": {$sum: 1}}},{$sort:{_id:1}}], function(e, pending){
			var output = JSON.parse(JSON.stringify(total));
			for(i=0;i<total.length;i++){
			  output[i].count = 0.03;
			  for(j=0;j<pending.length;j++){
				if(total[i]._id == pending[j]._id){	
					output[i].count = (pending[j].count*1.0)/total[i].count;
				} 
			  }
			}
			res.json(output);
		});
    });
});

router.get('/:ZONE_NAME/:RANGE_NAME', function(req,res){
	var db = req.db;
	var collection = db.get("cases");
        collection.aggregate([{$match: {"RANGE_NAME": req.params['RANGE_NAME']}},{$group:{_id: "$DISTRICT", "count": {$sum: 1}}},{$sort:{_id:1}}], function(e, total){
		collection.aggregate([{$match: {"Status": "Pending"}},{$match: {"RANGE_NAME": req.params['RANGE_NAME']}},{$group:{_id: "$DISTRICT", "count": {$sum: 1}}},{$sort:{_id:1}}], function(e, pending){
			var output = JSON.parse(JSON.stringify(total));
			for(i=0;i<total.length;i++){
			  output[i].count = 0.03;
			  for(j=0;j<pending.length;j++){
				if(total[i]._id == pending[j]._id){	
					output[i].count = (pending[j].count*1.0)/total[i].count;
				} 
			  }
			}
			res.json(output);
		});
    });
});

router.get('/:ZONE_NAME/:RANGE_NAME/:DISTRICT', function(req,res){
	var db = req.db;
	var collection = db.get("cases");
        collection.aggregate([{$match: {"DISTRICT": req.params['DISTRICT']}},{$group:{_id: "$PS", "count": {$sum: 1}}},{$sort:{_id:1}}], function(e, total){
		collection.aggregate([{$match: {"Status": "Pending"}},{$match: {"DISTRICT": req.params['DISTRICT']}},{$group:{_id: "$PS", "count": {$sum: 1}}},{$sort:{_id:1}}], function(e, pending){
			var output = JSON.parse(JSON.stringify(total));
			for(i=0;i<total.length;i++){
			  output[i].count = 0.03;
			  for(j=0;j<pending.length;j++){
				if(total[i]._id == pending[j]._id){	
					output[i].count = (pending[j].count*1.0)/total[i].count;
				} 
			  }
			}
			res.json(output);
		});
    });
});


module.exports = router;
