require('dotenv').config({ path: '.env.test' });
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const Product = require('../product');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

// Helper function to get auth token
const getAuthToken = () => {
  return jwt.sign(
    { userId: 'testuser' }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
};

describe('Product API Tests', () => {
  let authToken;

  before((done) => {
    // Get auth token before tests run
    authToken = getAuthToken();
    done();
  });

  it('should POST a valid product', (done) => {
    let product = {
      name: "Test Product",
      price: 100,
      quantity: 20
    };
    
    chai.request(server)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`) // Add auth header
      .send(product)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
});