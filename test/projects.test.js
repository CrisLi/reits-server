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
  const chris = {
    username: 'admin@chris',
    password: 'admin123456'
  };
  const firstProject = {
    name: 'first project',
    type: 'Public',
    status: 'New',
    address: {
      street: 'Street NO.1',
      city: 'LOS A',
      state: 'CA',
      zipCode: '10100',
      zoning: '1200'
    }
  };

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
      this.db.createTenant(chrisTenant)
        .then(() => this.getToken())
        .then(token => (this.token = token))
    ));

    after(() => this.db.clean());

    it('can create project on any tenant', (done) => {
      chai.request(this.app)
        .post('/projects')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(Object.assign({}, firstProject, { tenantId: 'chris' }))
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.should.have.property('tenantId', 'chris');
          done();
        });
    });

    it("can't create project on a not existing tenant'", (done) => {
      chai.request(this.app)
        .post('/projects')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(Object.assign({}, firstProject, { name: 'dummy project', tenantId: 'kitty' }))
        .end((err, res) => {
          res.body.should.have.property('code', 404);
          done();
        });
    });
  });

  describe('provider admin', () => {
    const kittyTenant = {
      _id: 'kitty',
      name: 'kitty',
      type: 'Provider'
    };
    const kitty = {
      username: 'admin@kitty',
      password: 'admin123456'
    };

    before(() => (
      this.db.createTenant(chrisTenant)
        .then(() => this.db.createTenant(kittyTenant))
        .then(() => this.getToken(chris))
        .then(token => (this.token = token))
    ));

    after(() => this.db.clean());

    it('can create project on own tenant', (done) => {
      chai.request(this.app)
        .post('/projects')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(Object.assign({}, firstProject))
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.should.have.property('tenantId', 'chris');
          done();
        });
    });

    it('tenant id in the request body will be ignored', (done) => {
      chai.request(this.app)
        .post('/projects')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(Object.assign({}, firstProject, { name: 'second project', tenantId: 'kitty' }))
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.should.have.property('tenantId', 'chris');
          done();
        });
    });

    describe('another tenant admin', () => {
      before(() => (
        this.getToken(kitty).then(token => (this.token = token))
      ));

      it('can create project with same name in different tenants', (done) => {
        chai.request(this.app)
          .post('/projects')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '.concat(this.token))
          .send(Object.assign({}, firstProject))
          .end((err, res) => {
            res.body.should.have.property('_id');
            res.body.should.have.property('tenantId', 'kitty');
            done();
          });
      });

      it('only can query projects on own tenant', (done) => {
        chai.request(this.app)
          .get('/projects')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '.concat(this.token))
          .end((err, res) => {
            res.body.should.have.property('data');
            res.body.data.should.have.lengthOf(1);
            done();
          });
      });
    });
  });
});
