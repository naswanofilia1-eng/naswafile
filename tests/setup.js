require("dotenv").config({ path: ".env.test" });
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Dijalankan sekali sebelum semua test dimulai: nyalakan MongoDB versi memori
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Dijalankan setelah setiap test selesai: bersihkan semua collection
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Dijalankan sekali setelah semua test selesai: matikan koneksi & server memori
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});