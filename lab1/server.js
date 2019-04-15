const express = require('express');
const bodyParser = require('body-parser');
const dbController = require('./dbController');
const multer = require('multer');
const filesController = require('./filesController');
const filter = require('./filter')
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
	console.log(req.file);
	const task = {
		id: Date.now(),
		title: req.body.title,
		status: req.body.status,
		date: req.body.firstDate,
		description: req.body.description,
		filename: req.file?req.file.filename:undefined,
		userFilename: req.file?req.file.originalname:undefined,
		deadline: 0
	}
	tasks.push(task);
	dbController.writeTasks(tasks);
	res.redirect('/')
} );

function findTask(tasks, id){
	const task = tasks.find(function(task){
		return id == task.id;
	})
	return task;
} 

function deleteTask(tasks, task){
	const index = tasks.indexOf(task);
	tasks.splice(index, 1);
	return index;
}

app.get('/', function (req, res) {
	if (tasks.length != 0) {
		for(let i = 0; i < tasks.length; i++){
			let time = Math.ceil((Date.parse(tasks[i].date) - Date.now())/(1000*3600*24));
			if (time < 0){
				time = "Time is out";
			}
			tasks[i].deadline = time;
		};	
	};
	res.render('pages/alltasks', {filedata : tasks});
});

app.get('/newtask',  function(req, res) {
	res.render('pages/newtask');
});

app.get('/download/:id', function(req, res){
	const task = findTask(tasks, req.params.id);
	res.download(__dirname + '/uploads/' + task.filename, task.userFilename);
})

app.get('/task/:id', function(req, res){
	const task = findTask(tasks, req.params.id);
	res.render('pages/task', {filedata:task} );
});

app.post('/edit/:id', upload.single("myFile"), function(req,res){ 
	const taskIndex = tasks.indexOf(findTask(tasks, req.body.id));
	task = tasks[taskIndex];
	task.id = Number(req.body.id);
	task.title = req.body.title;
	//task.date = differentDays;
	task.date = req.body.date;
	task.description = req.body.description;
	if(req.file){
		if(task.filename){
			filesController.deleteFile(__dirname, task.filename)
		}
		task.filename = req.file.filename; 
		task.userFilename = req.file.originalname;
	}
	dbController.writeTasks(tasks);
    res.redirect('/');
});

app.post('/task/delete/:id', function(req,res){
	const task = findTask(tasks, req.body.id);
	if(task.filename){
		filesController.deleteFile(__dirname, task.filename);
	}
    deleteTask(tasks, task);
    dbController.writeTasks(tasks);
    res.redirect('/');
});
app.post('/task/deleteFile', function(req, res){
	console.log("DELETING");
	const task = findTask(tasks, req.params.id);
	filesController.deleteFile(__dirname, task.filename);
	res.redirect('/');
});
app.listen(3000, function(){
	console.log("API started on localhost:3000");
});

app.post('/filter', filter.filterTasks);
