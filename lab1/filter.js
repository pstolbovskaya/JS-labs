module.exports.filterTasks = (req, res) => {
    if (req.body.status == "All"){
        res.redirect('/');
    }else{
        const tasks = dbController.getAllFromDB();
        let filterTasks = [];
        tasks.forEach((task) => {
        
        if (task.status == req.body.status){
        filterTasks.push(task);
        }
        });
        res.render('pages/alltasks', {datafiles: filterTasks});
    }
}


