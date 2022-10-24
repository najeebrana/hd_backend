const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const User = require("./model/user");

const config = require("./config/default.json");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
const corsOptions = {
	origin: "*",
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

const fileFilter = (request, file, callBk) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
		callBk(null, true);
	else callBk(null, false);
};

const fileExtLimiter = (request, response, next) => {
	if (
		request.file.mimetype === "image/jpeg" ||
		request.file.mimetype === "image/jpg" ||
		request.file.mimetype === "image/png"
	) {
		next();
	} else response.status(400).json({ status: "Invalid file type" }).send();
};

const storage = multer.diskStorage({
	destination: function (request, file, callBk) {
		callBk(null, "uploads/");
	},
	filename: function (req, file, callBk) {
		callBk(null, new Date().getTime().toString() + file.originalname);
	},
});

/////////////////////////////
// mongoose
// 	//.connect("mongodb://localhost/db_abc")
// 	.connect(config.dbURL)
// 	.then(() => console.log("Connected to db_abc"))
// 	.catch((error) => console.log(`Db not connected`, error));
const uri =
	"mongodb://user1:onvNaxlQJYFA8zze@ac-mmngdwh-shard-00-00.tfgrh6q.mongodb.net:27017,ac-mmngdwh-shard-00-01.tfgrh6q.mongodb.net:27017,ac-mmngdwh-shard-00-02.tfgrh6q.mongodb.net:27017/?ssl=true&replicaSet=atlas-jtnu8f-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(config.dbURL);

const connection = mongoose.connection;
connection.once("open", () => {
	console.log("MongoDB database connection established successfully.");
});

async function createUser(obj) {
	const user = new User({
		email: obj.email,
		password: obj.password,
		imageURL: obj.imageURL,
		// email: "najeeb3@company.com",
		// password: "password3",
		// imageURL: "http://localhost/uploads/1665713208643IMG_0842.jpg",
	});

	const result = await user.save();
	//console.log("result::::" + result);
	return result;
}
////////////////////////////

//const upload = multer({ dest: "uploads/" });
const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads"));

app.post(
	"/user",
	upload.single("file"),
	fileExtLimiter,
	(request, response) => {
		//console.log("\n\n\nPath" + request.file.path);
		console.log(request.file);
		const user = createUser({
			email: request.body.email,
			password: request.body.password,
			imageURL: request.file.path,
			//imageURL: config.appURL + request.file.path,
		})
			.then((user) => response.send(user))
			.catch((error) => response.status(400).send(error));

		//console.log("line64: " + user);
		//response.send(user);
		//response.send(config.appURL + request.file.path);
		//request.on("data", (data) => {
		//	console.log(data.toString());
		//});
		//response.send(request.body);
		//console.log(request);
	}
);

app.get("/user", (request, response) => {
	response.send({ email: "na@live.ca", password: "pass" });
});

app.get("/userList", async (request, response) => {
	await User.find({}, (error, result) => {
		response.send(result);
	}).catch((error) => {
		console.log(error);
	});
});

app.get("/user/:email", (request, response) => {
	User.find({
		email: request.params.email,
		password: request.params.password,
		//email: "rana1@yahoo.com",
		//password: "password1",
	})
		.then((user) => {
			response.send(user);
		})
		.catch((error) => {
			console.log(error);
		});
});

// app.post("/user/login", (req, res) => {
// 	const aa = req.body;
// 	console.log(aa);
// 	return res.status(200).send("message");
// });

app.post("/user/login", upload.none(), (request, response) => {
	console.log(request.body);
	User.findOne({
		email: request.body.email,
		password: request.body.password,
	})
		.select({ email: 1, imageURL: 1 })
		.then((user) => {
			if (!user)
				return response.status(401).json({
					message: "Invalid User",
				});
			console.log(user);
			response.send(user);
		})
		.catch((error) => {
			response.send(error);
		});
});

app.listen(3900, () => console.log("Server is listening on port 3900..."));
