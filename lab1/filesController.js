const fs = require('fs');

module.exports.deleteFile = function(path, filename){
        fs.unlink(path + '/uploads/' + filename, (err) =>{
            if (err) throw err;
                console.log( path + '/uploads/' + filename + ' was deleted');
        });  
};