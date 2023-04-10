const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const port = 3000;

// Enter your mailchimp api key and list id
const apiKey = "68587fcac81d74dc9066d64afb422565-us20";
const apiServer = "us20";
const listID = "46318d74a7";

const app = express();
app.use(express.static("public"));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  console.log(req);
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;
  console.log(email);

  var data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };

  var jsonData = JSON.stringify(data);

  var url = `https://${apiServer}.api.mailchimp.com/3.0/lists/${listID}/members`;
  var options = {
    method: "POST",
    auth: `anystring:${apiKey}`,
  };

  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      console.log(JSON.parse(data));

      if(response.statusCode===200){
          res.sendFile(__dirname+ "/success.html");
        }else if (response.statusCode===400){
            res.sendFile(__dirname+ "/already.html");
        }else{res.sendFile(__dirname+ "/failure.html");
      }

    });
  });




  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/")
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});






//
//
// onst express=require("express");
// const app=express();
//
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
//
// //for static files
// app.use(express.static("public"));
//
// // get method
// app.get("/",function(req,res){
//   res.sendFile(__dirname + "/signup.html")
// });
//
// app.post("/",function(req,res){
// var firstName=req.body.fName;
// var lastName=req.body.lName;
// var email=req.body.email;
//
// console.log(firstName,lastName,email);
// });
//
// //setting the port
// app.listen(3000,function(){
//   console.log("Server is running on 3000 port");
// });
//
// //mailchimp api key
// //68587fcac81d74dc9066d64afb422565-us20
//
// //list id
// //46318d74a7
