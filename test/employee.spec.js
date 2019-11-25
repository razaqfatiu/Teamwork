const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');

const { expect } = chai;

chai.use(chaiHttp);


describe('Test employee login', () => {
  const host = 'http://localhost:3333/api/v1/employee';
  const path = '/auth/signin';

  it(`Employee sign in method should send parameters to : ${path} POST`, (done) => {
    chai
      .request(host)
      .post(path)
      .set('content-type', 'application/json')
      .send({ email: 'mfatiu09@gmail.com', password: 'test123' })
      .end((error, res) => {
        if (error) {
          done(error);
        } else {
          expect(res).to.be.a('object');
          expect(res.body).to.be.a('object');
          expect(res.status).to.equal(200);
          expect(res.body.employeeId).to.be.a('number');
          expect(res.body).to.have.property('employeeId');
          expect(res.body.token).to.be.a('string');
          expect(res.body).to.have.property('token');
          done();
        }
      });
  });
});
