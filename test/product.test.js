require('dotenv').config({ path: '.env.test' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User'); // Assuming you have a User model

chai.use(chaiHttp);
const { expect } = chai;

describe('Product API Tests', () => {
  let authToken;
  let testUser;

  before(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create test user if not exists
    testUser = await User.findOneAndUpdate(
      { username: process.env.TEST_USER },
      { 
        username: process.env.TEST_USER,
        password: process.env.TEST_PASSWORD 
      },
      { upsert: true, new: true }
    );

    // Login to get token
    const res = await chai.request(server)
      .post('/api/auth/login')
      .send({
        username: process.env.TEST_USER,
        password: process.env.TEST_PASSWORD
      });
    
    authToken = res.body.token;
  });

  after(async () => {
    // Clean up test database
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should POST a valid product', async () => {
    const product = {
      name: "Test Product",
      price: 100,
      quantity: 20
    };
    
    const res = await chai.request(server)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send(product);
    
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('name', product.name);
  });
});