const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const Customer = require("./model/customer");
//require("dotenv").config();

const app = express();
app.use(express.json());

const port = 3900;
const uri =
	"mongodb://user1:onvNaxlQJYFA8zze@ac-mmngdwh-shard-00-00.tfgrh6q.mongodb.net:27017,ac-mmngdwh-shard-00-01.tfgrh6q.mongodb.net:27017,ac-mmngdwh-shard-00-02.tfgrh6q.mongodb.net:27017/customerdb?ssl=true&replicaSet=atlas-jtnu8f-shard-0&authSource=admin&retryWrites=true&w=majority";
//"mongodb+srv://user1:onvNaxlQJYFA8zze@cluster0.tfgrh6q.mongodb.net/customerdb?retryWrites=true&w=majority";
//console.log(uri);
//"mongodb+srv://user1:onvNaxlQJYFA8zze@cluster0.tfgrh6q.mongodb.net/customerdb?retryWrites=true&w=majority";
//"mongodb+srv://user1:onvNaxlQJYFA8zze@cluster0.tfgrh6q.mongodb.net/hd?retryWrites=true&w=majority";

//onvNaxlQJYFA8zze

mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
	console.log("MongoDB database connection established successfully.");
});

app.post("/customer", async (req, res) => {
	try {
		const customer = new Customer({
			email: "adsdf",
			password: "sdfsdf",
			imageURL: "sdfdsfdsfdssdfs",
		});
		await Customer.create(customer);
		response.send("Customer Added");
	} catch (error) {
		console.log(error);
	}
});

app.get("/userlist2", async (req, res) => {
	await Customer.find({}, (err, result) => {
		console.log("customer from db: ", result);
		res.send(result);
	});
});

app.post("/customer", async (req, res) => {
	try {
		console.log("req.body: ", req.body);

		const newCustomer = new Customer({
			customerFirstName: req.body.customerFirstName,
			customerLastName: req.body.customerLastName,
		});

		await Customer.create(newCustomer);
		res.send("Customer added");
	} catch (err) {
		console.log("error: ", err);
	}
});

app.listen(port, () => {
	console.log(`App is listening at http://locahost:${port}`);
});
