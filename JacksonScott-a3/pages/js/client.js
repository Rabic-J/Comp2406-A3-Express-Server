let vendor ={};

//creates new vendor
function submitVendor(){
	let vendor = {name:document.getElementById("name").value, min_order: parseInt(document.getElementById("min").value),delivery_fee: parseInt(document.getElementById("fee").value)}
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() { 
		//console.log(this.readyState)
		//console.log(this.status)
		if(this.readyState==4 && this.status==200){
			alert("Vendor Saved");
			let contains = JSON.parse(this.responseText)
			let i= "http://localhost:3000/vendor/"+contains.vendor.id
			location.href = i;
		}
	}
	xhttp.open("POST", `http://localhost:3000/vendors`);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(vendor));
}

//gets current vendor if hasesnt already been gottten and updates page
function updatePage(){
	let id = document.getElementById("id").textContent;
	console.log(Object.keys(vendor).length)
	if(vendor.name!==undefined){
		alterText();
	}else{
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState==4 && this.status==200){
				vendor = JSON.parse(this.responseText).vendor
				console.log(vendor)
				alterText();
				
			}
		}
		xhttp.open("GET", 'http://localhost:3000/at/'+parseInt(id));
		xhttp.send();
	}

}
//updates vendor feilds part of page
function alterText(){
	console.log(document.getElementById("fee").value)
	let name = document.getElementById("name").value
	let fee = parseInt(document.getElementById("fee").value)
	let min= parseInt(document.getElementById("min").value)
	if(typeof(name)==="string"&& name.length!==0){
		vendor.name= name
		document.getElementById("name").placeholder = name
		document.getElementById("name").value=""
	} 
	if(!isNaN(fee)){
		vendor.delivery_fee=fee
		document.getElementById("fee").placeholder = fee
		document.getElementById("fee").value =""
	} 
	if(!isNaN(min)){
		vendor.min_order=min
		document.getElementById("min").placeholder = min
		document.getElementById("min").value =""
	} 
	addCategory();
}

//adds new catagory
function addCategory(){
	let category= document.getElementById("category").value
	if(category.length!==0&& !vendor.supplies.hasOwnProperty(category)){
		vendor.supplies[category]= {}
		document.getElementById("category").value=""
		document.getElementById("middle").innerHTML+= `<h4>${category}`
		document.getElementById("middle").innerHTML+= `<p id= "${category}">`
		document.getElementById("category-select").innerHTML+=`<option value="${category}">${category}</option>`
	}
	addItem()
	
}
//adds new item
function addItem(){
	let category= document.getElementById("category-select").value
	let name = document.getElementById("iname").value
	let price = parseInt(document.getElementById("iprice").value)
	let stock = parseInt(document.getElementById("istock").value)
	
	let id=0;
	Object.keys(vendor.supplies).forEach(category => {
		console.log(Object.keys(vendor.supplies[category]))
		id+=Object.keys(vendor.supplies[category]).length
	})
	
	if(name.length!==0){
		if(isNaN(price)) price = 15
		if(isNaN(stock)) stock = 10
		vendor.supplies[category][id]= {
			name: name,
			stock: stock,
			price: price
		}
		document.getElementById("name").value=""
		document.getElementById("iprice").value=""
		document.getElementById("istock").value=""
		document.getElementById(category).innerHTML+=`Item ID : ${id}, ${name}, Price: $${price}, Stock: ${stock}<br>`
		id++;
	}
}

//updates vendor data on server
function updateServer(){
	let id = parseInt(document.getElementById("id").textContent)
	let link = `http://localhost:3000/vendor/`+id
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() { 
		console.log(this.readyState)
		console.log(this.status)
		if(this.readyState==4 && this.status==200){
			alert("Vendor Updated");
		}
	}


	xhttp.open("PUT", link);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(vendor));
}
