//Varables to be used
let vendors ={};
let id = 0;

const { getDiffieHellman } = require('crypto');
//Server code
const express = require('express');
const fs = require("fs");
let app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set("view engine", "pug");
app.set("views","./pages");

loadVendors()
getId()

//Get requests
//home page
app.get("/", (req, res, next)=> { res.render("home"); });

// list of vendor page
app.get("/vendor", (req, res, next)=> { 
	res.format({
		'text/html': function () { res.render("vendor",{vendors:vendors}); },
		'application/json': function () {
			let key = Object.keys(vendors) 
			res.json({vendors:key}); 
		},
		default: function () { res.status(406).send('Not Acceptable'); }
		});
	});

//individual vendor pages
app.get("/vendor/:id", (req, res, next)=> { 
	let i = req.params.id;
	
	res.format({
		'text/html': function () { 
			if(vendors[i]!== undefined){
				res.render("vendorPage",{vendor:vendors[i]});
			}else{
				res.status(404).send("Unknown resource");
			}
		},
		'application/json': function () {
			if(vendors[i]!== undefined){
				res.json({"ID=": i});
			}else{
				res.status(404).send("Unknown resource");
			}
		},
		default: function () { res.json({"ID=": i}); }
		});
    
});

//add vendor page
app.get("/addVendor", (req, res, next)=> { res.render("addVendor"); });

//get vendor object
app.get("/at/:id", (req, res, next)=> { 
	let i = req.params.id;
	if(vendors[i]!== undefined){
		res.json({vendor: vendors[i]});
	}else{
		res.status(404).send("Unknown resource");
	} 	
});

//Post Request add new vendor
app.post("/vendors", (req, res, next)=> {  
	let item = req.body;
	let i = getId()
	//make sure feilds exits
	if(typeof(item.min_order)!=="number"){
		item.min_order= 15
	}
	if(typeof(item.delivery_fee)!=="number"){
		item.delivery_fee=15
	}
	item.supplies={};
	vendors[i.toString()] = item;
	vendors[i.toString()].id= i;
	//server responce
	res.json({vendor:vendors[i.toString()]});
	console.log(vendors[i.toString()].id)
	//res.render("vendorPage",{vendor:vendors[id]});

});

//Put Requests update existing vendors
app.put("/vendor/:id", (req, res, next)=> {
	let update = req.body;
	let id = update.id
	if(vendors[id]!== undefined){
		vendors[id]=update
		res.status(200).send("all good");
	}else{
		res.status(404).send("Unknown resource");
	} 	
	
})


//listen to requets
app.listen(3000);
console.log("Server listening at http://localhost:3000");

//load json vendor files
function loadVendors(){
    let files = fs.readdirSync(__dirname+`/vendors`);
    for (let file of files) {
        let contents = fs.readFileSync(__dirname+`/vendors/`+ file);
		//fills vendors with store names and stock with all vendor info
        vendors[JSON.parse(contents).id]=JSON.parse(contents)
	}
}
//gets unused ids fo new vendors
function getId(){
	while(vendors.hasOwnProperty(id.toString())){
		id++
	}
	return id;
}