const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');

const { expect } = chai;

chai.use(chaiHttp);

describe('Test Employee add comment to Article', () => {
  const articleId = 20;
  const host = 'http://localhost:3333/api/v1/employee';
  const path = `/articles/${articleId}/comment`;


  it(`Employee create comment on article method should send parameters to : ${path} POST`, (done) => {
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
          .send({ comment: 'Test Comment' })
          .end((error, res) => {
            if (error) {
              done(error);
            } else {
              expect(res).to.be.a('object');
              expect(res.body).to.be.a('object');
              expect(res.status).to.equal(201);
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.be.a('string');
              expect(res.body).to.have.property('createdOn');
              expect(res.body).to.have.property('articleTitle');
              expect(res.body.articleTitle).to.be.a('string');
              expect(res.body).to.have.property('article');
              expect(res.body.article).to.be.a('string');
              expect(res.body).to.have.property('comment');
              expect(res.body.comment).to.be.a('string');
              done();
            }
          });
      });
  });
});

describe('Test Employee add comment to Gifs', () => {
  const gifId = 18;
  const host = 'http://localhost:3333/api/v1/employee';
  const path = `/gifs/${gifId}/comment`;


  it(`Employee create comment on gifs method should send parameters to : ${path} POST`, (done) => {
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
          .send({ comment: 'Test Gif Comment' })
          .end((error, res) => {
            if (error) {
              done(error);
            } else {
              expect(res).to.be.a('object');
              expect(res.body).to.be.a('object');
              expect(res.status).to.equal(201);
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.be.a('string');
              expect(res.body).to.have.property('createdOn');
              expect(res.body).to.have.property('gifTitle');
              expect(res.body.gifTitle).to.be.a('string');
              expect(res.body).to.have.property('comment');
              expect(res.body.comment).to.be.a('string');
              done();
            }
          });
      });
  });
});
