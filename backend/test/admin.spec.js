const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');

const { expect } = chai;

chai.use(chaiHttp);

describe('Test Admin login', () => {
  const host = 'http://localhost:3333/api/v1/admin';
  const path = '/auth/signin';

  it(`Admin sign in method should send parameters to : ${path} POST`, (done) => {
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
          expect(res.body.adminId).to.be.a('number');
          expect(res.body).to.have.property('adminId');
          expect(res.body.token).to.be.a('string');
          expect(res.body).to.have.property('token');
          done();
        }
      });
  });
});

describe('Test Admin Create employee', () => {
  const host = 'http://localhost:3333/api/v1/admin';
  const path = '/auth/create-user';

  it(`Admin create user method should send parameters to : ${path} POST`, (done) => {
    chai
      .request(host)
      .post('/auth/signin')
      .set('content-type', 'application/json')
      .send({ email: 'mfatiu09@gmail.com', password: 'test123' })
      .end((err, response) => {
        if (err) {
          done(err);
        }
        return chai
          .request(host)
          .post(path)
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${response.body.token}`)
          .send({
            firstname: 'darren',
            lastname: 'williams',
            email: 'mfatiu09@gmail.com',
            password: 'test123',
            gender: 'male',
            jobrole: 'Quality Assurance engineer',
            department: 'QA',
            address: 'Ozumba',
          })
          .end((error, res) => {
            if (error) {
              done(error);
            } else {
              expect(res).to.be.a('object');
              expect(res.body).to.be.a('object');
              expect(res.status).to.equal(500 || 200);
              expect(response.body.adminId).to.be.a('number');
              expect(response.body).to.have.property('adminId');
              expect(response.body.token).to.be.a('string');
              expect(response.body).to.have.property('token');
              done();
            }
          });
      });
  });
});
