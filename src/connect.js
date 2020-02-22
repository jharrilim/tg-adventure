const mongoose = require('mongoose');
module.exports = async () => {
  const {
    MONGO_URL = 'localhost:27017',
    MONGO_DBNAME = 'tgadventure',
    MONGO_USERNAME,
    MONGO_PASSWORD,
  } = process.env;


  console.log('Connecting to database...');
  const conn = await mongoose.connect(
    `mongodb://${MONGO_URL}`,
    {
      auth: {
        user: MONGO_USERNAME,
        password: MONGO_PASSWORD,
      },
      dbName: MONGO_DBNAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  console.log('Connected to mongo: ' + MONGO_URL);
  return conn;
};
