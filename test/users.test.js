/* eslint-env node, mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const getToken = require('./get-token');
const cleanDb = require('./clean-db');

chai.use(chaiHttp);
chai.should();

describe('[users api]', () => {
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
    const pmInReits = {
      email: 'chris@reits.com',
      password: '12345678',
      roles: ['PM'],
      tenantId: 'reits'
    };
    const chrisTenant = {
      _id: 'chris',
      name: 'chris',
      type: 'Provider'
    };
    const pmInChris = {
      email: 'pm@chris.com',
      password: '12345678',
      roles: ['PM'],
      tenantId: 'chris'
    };

    before(() => {
      const tenantService = this.app.service('/tenants');
      return tenantService.create(chrisTenant)
        .then(() => getToken(this.app))
        .then(token => (this.token = token));
    });

    after(() => cleanDb(this.app));

    it('can create user on [reits] tenant', (done) => {
      chai.request(this.app)
        .post('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(pmInReits)
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.should.have.property('email', 'chris@reits.com');
          done();
        });
    });

    it('can create user on any tenants', (done) => {
      chai.request(this.app)
        .post('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(pmInChris)
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.should.have.property('email', 'pm@chris.com');
          done();
        });
    });

    it("can't create tenant user without token", (done) => {
      chai.request(this.app)
        .post('/users')
        .send(pmInReits)
        .end((err, res) => {
          res.body.should.have.property('code', 401);
          done();
        });
    });
  });

  describe('provider admin', () => {
    const chrisTenant = {
      _id: 'chris',
      name: 'chris',
      type: 'Provider'
    };
    const kittyTenant = {
      _id: 'kitty',
      name: 'kitty',
      type: 'Provider'
    };
    const chris = {
      email: 'admin@chris.com',
      password: '12345678',
      roles: ['Admin'],
      tenantId: 'chris'
    };

    const pmInChris = {
      email: 'pm@chris.com',
      password: '12345678',
      roles: ['PM'],
      tenantId: 'chris'
    };
    const pmInKitty = {
      email: 'pm@kitty.com',
      password: '12345678',
      roles: ['PM'],
      tenantId: 'kitty'
    };

    before(() => {
      const tenantService = this.app.service('/tenants');
      const userService = this.app.service('/users');
      return tenantService.create(chrisTenant)
        .then(() => tenantService.create(kittyTenant))
        .then(() => userService.create(chris))
        .then(() => getToken(this.app, chris))
        .then(token => (this.token = token));
    });

    after(() => cleanDb(this.app));

    it('can create tenant user', (done) => {
      chai.request(this.app)
        .post('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(pmInChris)
        .end((err, res) => {
          res.body.should.have.property('_id');
          done();
        });
    });

    it("can't create tenant user without token", (done) => {
      chai.request(this.app)
        .post('/users')
        .send(pmInChris)
        .end((err, res) => {
          res.body.should.have.property('code', 401);
          done();
        });
    });

    it("can't create tenant user in other tenant", (done) => {
      chai.request(this.app)
        .post('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(pmInKitty)
        .end((err, res) => {
          res.body.should.have.property('code', 403);
          done();
        });
    });
  });

  describe('client user', () => {
    const kitty = {
      email: 'kitty@self.com',
      password: '12345678',
      roles: ['Client'],
      tenantId: 'client'
    };

    after(() => cleanDb(this.app));

    it('can register', (done) => {
      chai.request(this.app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(kitty)
        .end((err, res) => {
          res.body.should.have.property('_id');
          done();
        });
    });
  });
});
