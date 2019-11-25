const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');

const { expect } = chai;

chai.use(chaiHttp);


describe('Test Employee get feed', () => {
  const host = 'http://localhost:3333/api/v1/employee';
  const path = '/feed';

  it(`Employee Get Feed method should send parameters to : ${path} GET`, (done) => {
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
              expect(res.body.result.rows).to.be.a('array');
              expect(res.body.result.rows[0]).to.have.property('id');
              expect(res.body.result.rows[0].id).to.be.a('number');
              expect(res.body.result.rows[0]).to.have.property('createdOn');
              expect(res.body.result.rows[0]).to.have.property('title');
              expect(res.body.result.rows[0].title).to.be.a('string');
              expect(res.body.result.rows[0]).to.have.property('article/url');
              expect(res.body.result.rows[0]['article/url']).to.be.a('string');
              expect(res.body.result.rows[0]).to.have.property('authorId');
              expect(res.body.result.rows[0].authorId).to.be.a('number');
              done();
            }
          });
      });
  });
});
