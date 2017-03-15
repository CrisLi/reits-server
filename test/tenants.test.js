/* eslint-env node, mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const getToken = require('./get-token');
const cleanDb = require('./clean-db');

chai.use(chaiHttp);
chai.should();

const chris = {
  email: 'admin@chris.com',
  password: '12345678',
  tenantId: 'chris',
  roles: ['Admin']
};

describe('[tenants api]', () => {
  before((done) => {
    this.server = server.startup();
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

  describe('super admin', () => {
    before(() => (
      getToken(this.app)
        .then((token) => {
          this.token = token;
        })
    ));

    after(() => cleanDb(this.app));

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
    before(() => {
      const tenantService = this.app.service('/tenants');
      const userSerivce = this.app.service('/users');
      return tenantService.create({ name: 'chris', type: 'Provider' })
        .then(() => userSerivce.create(chris))
        .then(() => getToken(this.app, chris))
        .then(token => (this.token = token));
    });

    after(() => cleanDb(this.app));

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
        .send({
          name: 'kitty'
        })
        .end((err, res) => {
          res.body.should.have.property('code', 403);
          done();
        });
    });
  });
});
