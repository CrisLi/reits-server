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

describe('[tenants api]', () => {
  before((done) => {
    this.server = server.startup();
    this.server.on('startup', (app) => {
      init(app, done);
    });
  });

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

    it('can create tenant', (done) => {
      chai.request(this.app)
        .post('/tenants')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send({
          name: 'chris'
        })
        .end((err, res) => {
          res.body.should.have.property('_id', 'chris');
          done();
        });
    });
  });

  describe('tenant admin', () => {
    const chris = {
      username: 'admin@chris',
      password: 'admin123456'
    };

    before(() => (
      this.db.createTenant({ name: 'chris', type: 'Provider' })
        .then(() => this.getToken(chris))
        .then(token => (this.token = token))
    ));

    after(() => this.db.clean());

    it("can't create tenant", (done) => {
      chai.request(this.app)
        .post('/tenants')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send({
          name: 'kitty'
        })
        .end((err, res) => {
          res.body.should.have.property('code', 403);
          done();
        });
    });

    it("can't find tenant", (done) => {
      chai.request(this.app)
        .get('/tenants')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .end((err, res) => {
          res.body.should.have.property('code', 403);
          done();
        });
    });
  });
});
