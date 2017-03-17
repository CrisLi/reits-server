/* eslint-env node, mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const getToken = require('./get-token');
const db = require('./db');

chai.use(chaiHttp);
chai.should();

const init = (app, done) => {
  this.app = app;
  this.db = db(app);
  this.getToken = getToken(app);
  done();
};

describe('[projects api]', () => {
  const chrisTenant = { name: 'chris', type: 'Provider' };
  // const chris = {
  //   username: 'admin@chris',
  //   password: 'admin123456'
  // };

  before((done) => {
    this.server = server.startup();
    this.server.on('startup', (app) => {
      init(app, done);
    });
  });

  before(() => (
    this.db.createTenant(chrisTenant)
  ));

  after((done) => {
    this.server.close(() => {
      done();
    });
  });

  describe('super admin', () => {
    before(() => (
      this.getToken().then(token => (this.token = token))
    ));

    after(() => this.db.clean());

    it('can create project on any tenant', (done) => {
      chai.request(this.app)
        .post('/projects')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send({
          name: 'chris'
        })
        .end((err, res) => {
          res.body.should.have.property('_id');
          done();
        });
    });
  });
});
