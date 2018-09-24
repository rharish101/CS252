var db = require('../mongoconnection.js');

var Cases = {
	  getOneCase: function(callback){
		return db.collection("cases").findOne({}, function(err, result){
		  if (err) throw err;
	    });
	  }
	};
  
module.exports = Cases;
