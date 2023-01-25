const express = require("express")
const multer = require("multer")	//image upload
const path = require('path')		//serve the static html
// const bodyparser = require("body-parser")

const port = 3000;
const app = express()
// app.use(bodyparser.json())

const Storage = multer.diskStorage({
	destination: (req, file, callback)=>{
		callback(null, './upload');
	},
	filename : (req, file, callback)=>{
		const name = Date.now() + "_" + file.originalname;
		callback(null, name);
	}
})

const Upload =  multer({
	storage : Storage
})

const upload = multer({
	storage: Storage
}).array('photos', 5)


//server the static html form
app.get("/", (req, res)=>{
	// console.log(Storage.destination)
	res.sendFile(path.join(__dirname, "/static/index.html"))
})

//handle the image upload
// app.post('/upload', function(req, res){
// 	Upload(req, res, function(err){
// 		if(err){
// 			console.log('something went wrong')
// 			return res.end('something went wrong')
// 		}
// 		else{
// 			console.log('image is uploaded to the server successfully')
// 			return res.end('image is uploaded to the server successfully')
// 		}
// 	});
// });

//handle image upload
app.post('/upload', Upload.single('avatar'), (req, res, next)=>{
		const file = req.file;
		if(!file){
			const error = new Error('please upload the file')
			error.httpStatusCode = 400;
			return next(err);
		}
		return res.send(file);
})

//handle multiple image uploads
app.post('/files', function(req, res){
	upload(req,res, function(err){
		if(err){
			console.log(err)
			return res.end('something went wrong')
		}
		else{
			console.log('image is uploaded to the server successfully')
			return res.end('image is uploaded to the server successfully')
		}
	});

});


//start the server
app.listen(port, e=>{
	console.log("your app started at port", port);
})