const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');

const { expect } = chai;

chai.use(chaiHttp);


describe('Test Employee Create gif', () => {
  const host = 'http://localhost:3333/api/v1/employee';
  const path = '/gifs';
  const imagePath = '/Users/fatiuisiaka/Desktop/DevC/Capstone Project/gifs/giphys.gif';

  it(`Employee create Gif method should send parameters to : ${path} POST`, (done) => {
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
          .field('Content-Type', 'multipart/form-data')
          .field('title', 'imageGif')
          .attach('gif', imagePath)
          .end((error, res) => {
            if (error) {
              done(error);
            } else {
              expect(res).to.be.a('object');
              expect(res.body).to.be.a('object');
              expect(res.status).to.equal(201);
              expect(res.body.gifId).to.be.a('number');
              expect(res.body).to.have.property('gifId');
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.be.a('string');
              expect(res.body).to.have.property('createdOn');
              expect(res.body.title).to.be.a('string');
              expect(res.body).to.have.property('title');
              expect(res.body.imageUrl).to.be.a('string');
              expect(res.body).to.have.property('message');
              done();
            }
          });
      });
  }).timeout(50000);
});

describe('Test Employee delete Gif', () => {
  const host = 'http://localhost:3333/api/v1/employee';
  const path = '/gifs/';
  const gifId = 22;

  it(`Employee delete Gif method should send parameters to : ${path} Delete`, (done) => {
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
          .delete(path + gifId)
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
  }).timeout(50000);
});

describe('Test Employee GET Gif', () => {
  const host = 'http://localhost:3333/api/v1/employee';
  const articleId = 6;
  const path = `/gifs/${articleId}`;

  it(`Employee GET Gif method should send parameters to : ${path} GET`, (done) => {
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
              expect(res.body).to.have.property('url');
              expect(res.body.url).to.be.a('string');
              expect(res.body).to.have.property('comments');
              expect(res.body.comments).to.be.a('array');
              done();
            }
          });
      });
  });
});
