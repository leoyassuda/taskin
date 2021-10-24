require('dotenv').config();

const grpc = require('@grpc/grpc-js');
const { MongoClient } = require('mongodb');
const services = require('./proto/user_grpc_pb');
const API = require('./api');

// Mongo connection
const dbClient = new MongoClient(process.env.DB_URI, {
  useUnifiedTopology: true,
});

let api = null;

async function connectDB() {
  try {
    await dbClient.connect();
    let db = dbClient.db(process.env.DB_NAME);
    db.command({ ping: 1 });
    console.log('MongoDB connected!');

    await db.collection('users').createIndex({ email: 1 });

    // Init API
    api = new API(db, grpc);
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  await connectDB().catch(console.dir);

  let server = new grpc.Server();
  server.addService(services.UserSvcService, {
    register: api.register,
    login: api.login,
    verify: api.verify,
    getUser: api.getUser,
  });

  let address = process.env.HOST + ':' + process.env.PORT;
  server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`Server running at ${address}`);
  });
}

main();
