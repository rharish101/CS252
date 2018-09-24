var db = require('../dbconnection');

var Batsmen = {
  getAllBatsmen: function(callback){
	return db.query("SELECT * FROM batsmen", callback);
  }
};
console.log(Batsmen);
module.exports = Batsmen;
