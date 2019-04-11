const express = require('express');
const bodyParser = require('body-parser');
const dbController = require('./dbController');
const multer = require('multer');

let storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, __dirname+ '/uploads')
	},
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	}
});

let upload = multer({storage: storage});
var urlencodedParser =  bodyParser.urlencoded({extended : false});


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true}));
app.use(express.static(__dirname + '/public'));

//const files = get(req, "body.data.files");

//const attachments = files.map((file)=>{
//  return { filename: file.name, path: file.url };
//});

let tasks = dbController.getFromDB();
//app.set('views','./views'); 
app.set('view engine','ejs');


app.post('/', upload.single('myFile'), function(req, res){
	const task = {
		id: Date.now(),
		title: req.body.title,
		date: req.body.date,
		description: req.body.description,
		filename: req.file.filename
	}
	tasks.push(task);
	dbController.addTask(tasks);
	res.redirect('/')
} );


function findTask(tasks, id){
	const task = tasks.find(function(task){
		return id == task.id;
	})
	return task;
}

function deleteTask(tasks, task){
	const index = tasks.IndexOf(task);
	tasks.splice(index, 1);
	return index;
}



app.get('/', function (req, res) {
	res.render('pages/alltasks', {filedata : tasks});
});

app.get('/newtask',  function(req, res) {
	res.render('pages/newtask')
});

app.get('/download/:id', function(req, res){
	const task = findTask(tasks, req.params.id);
	res.download(__dirname + '/uploads/' + task.filename);
})

app.get('/task/:id', function(req, res){
	const task = findTask(tasks, req.params.id);
	res.render('pages/task', filedata:task);
});

app.listen(3000, function(){
	console.log("API started on localhost:3000");
});