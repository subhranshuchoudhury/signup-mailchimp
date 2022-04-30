const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const request = require("request");
const https = require("https");
//***********
app.use(express.static("public")); // for css to fetch like local folder.
app.use(bodyParser.urlencoded({extended: true}));
app.get("/",function(req,res){
	res.sendFile(__dirname+"/index.html");
});
//***********
app.post("/",function(req,res){

	const firstName = req.body.fname;
	const lastName = req.body.lname;
	const email = req.body.email;

	// console.log(firstName, lastName, email);

	const data = {
		members: [{
			email_address: email,
			status: "subscribed",
			merge_fields: {
				FNAME: firstName,
				LNAME: lastName
			}
		}]
	};

	const jsonData = JSON.stringify(data);
	const url = "https://us11.api.mailchimp.com/3.0/lists/af2e150326"
	const options = {
		method: "POST",
		auth: "subhranshu1:adeb748c003bb677a1a8ee7e21f22a4f-us11"

	}
	const request = https.request(url,options,function(response){
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		}else {
			res.sendFile(__dirname + "/failure.html");
		}
		response.on("data",function(data){
			console.log(JSON.parse(data));
		})
	})
	request.write(jsonData);
	request.end();
})

app.post("/failure",function(req,res){
	res.redirect("/");
})

//**** Server.

app.listen(process.env.PORT || 3000,function(){ //process.evn.PORT is for heroku decide its own port.
	console.log("Server Started! [Port: 3000]");
})

// mailchimp api key: adeb748c003bb677a1a8ee7e21f22a4f-us11
// list id: af2e150326
// url : https://usx.api.mailchimp.com/3.0/lists

// Deploying on Heroku

/*

Procfile --> web: node app.js
git init {may use sudo}
git add .
sudo git commit -m "first commit"
git config user.email "subhransuchoudhury00@gmail.com"
heroku create
git push heroku master
*/