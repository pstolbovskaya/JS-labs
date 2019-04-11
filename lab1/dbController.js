const fs = require('fs');

module.exports.getFromDB = function(){
	let filedata = "";
	let tasks = [];

	try{
		filedata = fs.readFileSync('database.json', 'utf8');
	}
	catch(error) {
		console.error(error);
	}
	

	try{
		tasks = JSON.parse(filedata);
	}
	catch(error){
		console.error(error);
		fs.writeFileSync('database.json', '[]');
		tasks = [];
	}
	return tasks;
}
module.exports.addTask = function(tasks){
	let datatofile = JSON.stringify(tasks);
	fs.writeFileSync('database.json', datatofile);
}