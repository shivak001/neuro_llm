const express = require('express');
const app = express();
const allroutes = require('./allroutes');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");
const { usersModel } = require("../backend/allschemas");

dotenv.config();
app.use(express.json());

let corspolicy = {
    origin: "http://localhost:3000"
};
app.use(cors(corspolicy));

app.use((req, res, next) => {
    console.log("Request received at " + (new Date())); 
    next();
});

let db = async () => { 
    try { 
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database");
    } catch (err) {
        console.log('Error connecting to the database:', err);
    }
};
db();

let userSchema = new mongoose.Schema({
    "username": {
        "type": "String",
        "required": true
    },
    "password": {
        "type": "String",
        "required": true
    },
    "email": {
        "type": "String",
        "required": true,
        "unique": true
    },
});
mongoose.model("usersModel", userSchema);

app.use('/', allroutes);

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
    console.log(`Backend server listening at port ${PORT}`);
});