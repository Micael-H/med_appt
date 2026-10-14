const mongoose = require('mongoose');
module.exports = function connectToMongo() {
  return mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'stayhealthybeta1', serverSelectionTimeoutMS: 10000,
  });
};
