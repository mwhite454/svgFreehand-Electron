var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');

document.getElementById('select-file').addEventListener('click',function(){
    dialog.showOpenDialog(function (fileNames) {
        if(fileNames === undefined){
            console.log("No file selected");
        }else{
            document.getElementById("actual-file").value = fileNames[0];
            readFile(fileNames[0]);
        }
    });
},false);


document.getElementById('save-changes').addEventListener('click',function(){
    var actualFilePath = document.getElementById("actual-file").value;

    if(actualFilePath!='fileName'||actualFilePath!=''){
        saveChanges(actualFilePath, globals.desk.innerHTML);
    }else{
      var content = globals.desk.innerHTML;

      dialog.showSaveDialog(function (fileName) {
          if (fileName === undefined){
              console.log("You didn't save the file");
              return;
          }

          fs.writeFile(fileName, content, function (err) {
              if(err){
                  alert("An error ocurred creating the file "+ err.message)
              }

              alert("The file has been succesfully saved");
              document.getElementById("actual-file").value = fileName;
          });
      });
    }
},false);

/*document.getElementById('delete-file').addEventListener('click',function(){
    var actualFilePath = document.getElementById("actual-file").value;

    if(actualFilePath){
        deleteFile(actualFilePath);
        document.getElementById("actual-file").value = "";
        document.getElementById("content-editor").value = "";
    }else{
        alert("Please select a file first");
    }
},false);*/

/*document.getElementById('create-new-file').addEventListener('click',function(){
    var content = globals.desk.innerHTML;

    dialog.showSaveDialog(function (fileName) {
        if (fileName === undefined){
            console.log("You didn't save the file");
            return;
        }

        fs.writeFile(fileName, content, function (err) {
            if(err){
                alert("An error ocurred creating the file "+ err.message)
            }

            alert("The file has been succesfully saved");
        });
    });
},false);*/

function readFile(filepath) {
  console.log('this is happening!');
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        //console.log(data);
        globals.desk.innerHTML = data;
        prepPort();
        //var newElement = document.createElementNS(data);

    });
}

/*function deleteFile(filepath){
    fs.exists(filepath, function(exists) {
        if(exists) {
            // File exists deletings
            fs.unlink(filepath,function(err){
                if(err){
                    alert("An error ocurred updating the file"+ err.message);
                    console.log(err);
                    return;
                }
            });
        } else {
            alert("This file doesn't exist, cannot delete");
        }
    });
}*/

function saveChanges(filepath,content){
    fs.writeFile(filepath, content, function (err) {
        if(err){
            alert("An error ocurred updating the file"+ err.message);
            console.log(err);
            return;
        }

        alert("The file has been succesfully saved");
    });
}
