const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');

const { expect } = chai;

chai.use(chaiHttp);


describe('Test Employee Create Article', () => {
  const host = 'http://localhost:3333/api/v1/employee';
  const path = '/articles';

  it(`Employee create Article method should send parameters to : ${path} POST`, (done) => {
    chai
      .request(host)
      .post('/auth/signin')
      .set('content-type', 'application/json')
      .send({ email: 'mfatiu09@gmail.com', password: 'test123' })
      .end((err, response) => {
        if (err) {
          done(err);
        }
        chai
          .request(host)
          .post(path)
          .set('Authorization', `Bearer ${response.body.token}`)
          .set('content-type', 'application/json')
          .send({ title: 'testTitle1', article: 'test Article 1', employeeid: response.body.employeeId })
          .end((error, res) => {
            if (error) {
              done(error);
            } else {
              expect(res).to.be.a('object');
              expect(res.body).to.be.a('object');
              expect(res.status).to.equal(201);
              expect(res.body.articleId).to.be.a('number');
              expect(res.body).to.have.property('articleId');
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.be.a('string');
              expect(res.body).to.have.property('createdOn');
              expect(res.body.title).to.be.a('string');
              expect(res.body).to.have.property('title');
              done();
            }
          });
      });
  });
});

describe('Test Employee update Article', () => {
  const host = 'http://localhost:3333/api/v1/employee';
  const path = '/articles/';
  const articleId = 4;

  it(`Employee update Article method should send parameters to : ${path} PATCH`, (done) => {
    chai
      .request(host)
      .post('/auth/signin')
      .set('content-type', 'application/json')
      .send({ email: 'mfatiu09@gmail.com', password: 'test123' })
      .end((err, response) => {
        if (err) {
          done(err);
        }
        chai
          .request(host)
          .patch(path + articleId)
          .set('Authorization', `Bearer ${response.body.token}`)
          .set('content-type', 'application/json')
          .send({ title: 'testTitle1', article: 'test Article 1', id: 4 })
          .end((error, res) => {
            if (error) {
              done(error);
            } else {
              expect(res).to.be.a('object');
              expect(res.body).to.be.a('object');
              expect(res.status).to.equal(201);
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.be.a('string');
              expect(res.body).to.have.property('article');
              expect(res.body.article).to.be.a('string');
              done();
            }
          });
      });
  });
});
describe('Test Employee delete Article', () => {
  const host = 'http://localhost:3333/api/v1/employee';
  const path = '/articles/';
  const articleId = 41;

  it(`Employee delete Article method should send parameters to : ${path} Delete`, (done) => {
    chai
      .request(host)
      .post('/auth/signin')
      .set('content-type', 'application/json')
      .send({ email: 'mfatiu09@gmail.com', password: 'test123' })
      .end((err, response) => {
        if (err) {
          done(err);
        }
        chai
          .request(host)
          .delete(path + articleId)
          .set('Authorization', `Bearer ${response.body.token}`)
          .set('content-type', 'application/json')
          .end((error, res) => {
            if (error) {
              done(error);
            } else {
              expect(res).to.be.a('object');
              expect(res.body).to.be.a('object');
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.be.a('string');
              done();
            }
          });
      });
  });
});

describe('Test Employee GET Article', () => {
  const host = 'http://localhost:3333/api/v1/employee';
  const articleId = 5;
  const path = `/articles/${articleId}`;

  it(`Employee GET Article method should send parameters to : ${path} GET`, (done) => {
    chai
      .request(host)
      .post('/auth/signin')
      .set('content-type', 'application/json')
      .send({ email: 'mfatiu09@gmail.com', password: 'test123' })
      .end((err, response) => {
        if (err) {
          done(err);
        }
        chai
          .request(host)
          .get(path)
          .set('Authorization', `Bearer ${response.body.token}`)
          .set('content-type', 'application/json')
          .end((error, res) => {
            if (error) {
              done(error);
            } else {
              expect(res).to.be.a('object');
              expect(res.body).to.be.a('object');
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('id');
              expect(res.body.id).to.be.a('number');
              expect(res.body).to.have.property('createdOn');
              expect(res.body.createdOn).to.be.a('string');
              expect(res.body).to.have.property('title');
              expect(res.body.title).to.be.a('string');
              expect(res.body).to.have.property('article');
              expect(res.body.article).to.be.a('string');
              expect(res.body).to.have.property('comments');
              expect(res.body.comments).to.be.a('array');
              done();
            }
          });
      });
  });
});
