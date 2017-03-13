/* eslint-env node, mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { startup } = require('./index');

chai.use(chaiHttp);
chai.should();

const admin = {
  email: 'admin@reits.com',
  password: 'helloreits!'
};

describe('login', () => {
  before((done) => {
    this.server = startup();
    this.server.on('startup', (app) => {
      this.app = app;
      done();
    });
  });

  after((done) => {
    this.server.close(() => {
      done();
    });
  });

  it('should return token', (done) => {
    chai.request(this.app)
      .post('/auth')
      .set('Accept', 'application/json')
      .send(admin)
      .end((err, res) => {
        res.body.should.have.property('token');
        done();
      });
  });
});
