const mongoose = require('mongoose');

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSlectionTimeoutMS: 30000,
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/theDailyDB');

module.exports = mongoose.connection;
