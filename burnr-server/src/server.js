const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
app.use(cors());
app.use(express.json());
dotenv.config();
module.exports = app;

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI).then(()=> {
    console.log('mongodb connected successfully');
    app.listen(PORT , () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err)=> {
    console.log(err);
});



