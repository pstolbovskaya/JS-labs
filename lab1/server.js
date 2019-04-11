var express = require('express');
var bodyParser = require('body-parser');
 
var urlencodedParser =  bodyParser.urlencoded({extended : false});


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true}));
app.use(express.static(__dirname + '/public'));

//const files = get(req, "body.data.files");

//const attachments = files.map((file)=>{
//  return { filename: file.name, path: file.url };
//});

let mass = [{
		id : 1,
		title : "Title",
		date : "today" },
	{
		id : 2,
		title: "NoTitle",
		date : "yesterday"},
	{
		id : 3,
		title: "YesTitle",
		date : "tomorrow"
}]
//app.set('views','./views'); 
app.set('view engine','ejs');


app.post("/new", function(req, res){
	mass.push(req.body);
	console.log(req.body);
} )

app.get('/', function (req, res) {
	res.render('pages/alltasks', {data : mass});
});

app.get('/newtask',  function(req, res) {
	res.render('pages/newtask')
});

app.listen(3000);