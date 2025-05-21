require('dotenv').config({ path: '.env.test' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

// Mock User model
const User = {
  findOneAndUpdate: sinon.stub().resolves({
    _id: 'testuserid',
    username: 'testuser',
    getSignedJwtToken: () => 'testtoken'
  })
};

// Now require server after mocking
const server = require('../server');
const Product = require('../product');

chai.use(chaiHttp);
const { expect } = chai;

describe('Product API Tests', () => {
  let authToken = 'testtoken';

  it('should POST a valid product', (done) => {
    const product = {
      name: "Test Product",
      price: 100,
      quantity: 20
    };
    
    chai.request(server)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send(product)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
});