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

describe('[users api]', () => {
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
    const pmReits = {
      username: 'pm-reits',
      password: '12345678',
      roles: ['PM'],
      tenantId: 'reits'
    };
    const chrisTenant = {
      _id: 'chris',
      name: 'chris',
      type: 'Provider'
    };
    const pmChris = {
      username: 'pm-chris',
      password: '12345678',
      roles: ['PM'],
      tenantId: 'chris'
    };

    before(() => {
      const tenantService = this.app.service('/tenants');
      return tenantService.create(chrisTenant)
        .then(() => this.getToken())
        .then(token => (this.token = token));
    });

    after(() => this.db.clean());

    it('can create user on [reits] tenant', (done) => {
      chai.request(this.app)
        .post('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(pmReits)
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.should.have.property('username', 'pm-reits@reits');
          res.body.should.have.property('tenantId', 'reits');
          done();
        });
    });

    it('can create user on any tenants', (done) => {
      chai.request(this.app)
        .post('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(pmChris)
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.should.have.property('username', 'pm-chris@chris');
          res.body.should.have.property('tenantId', 'chris');
          this.userId = res.body['_id'];
          done();
        });
    });

    it('can update user', (done) => {
      chai.request(this.app)
        .put(`/users/${this.userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(Object.assign({}, pmChris, { username: 'dummy', roles: ['FA'], displayName: 'Chris Li' }))
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.should.have.property('username', 'pm-chris@chris');
          res.body.should.have.property('displayName', 'Chris Li');
          res.body.roles.should.have.members(['FA']);
          delete this.userId;
          done();
        });
    });

    it('can get all users', (done) => {
      chai.request(this.app)
        .get('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .end((err, res) => {
          res.body.should.have.property('data');
          res.body.data.should.have.lengthOf(4);
          done();
        });
    });

    it("can't create user without token", (done) => {
      chai.request(this.app)
        .post('/users')
        .send(pmReits)
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
    const pmChris = {
      username: 'pm-chris',
      password: '12345678',
      roles: ['PM']
    };
    const pmKitty = {
      username: 'pm-kitty',
      password: '12345678',
      roles: ['PM'],
      tenantId: 'kitty'
    };
    const chris = {
      username: 'admin@chris',
      password: 'admin123456'
    };

    before(() => (
      this.db.createTenant(chrisTenant)
        .then(() => this.db.createTenant(kittyTenant))
        .then(() => this.getToken(chris))
        .then(token => (this.token = token))
    ));

    after(() => this.db.clean());

    it('can create tenant user', (done) => {
      chai.request(this.app)
        .post('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(pmChris)
        .end((err, res) => {
          res.body.should.have.property('_id');
          done();
        });
    });

    it("can't create tenant user without token", (done) => {
      chai.request(this.app)
        .post('/users')
        .send(pmChris)
        .end((err, res) => {
          res.body.should.have.property('code', 401);
          done();
        });
    });

    it('tenant id in the request body will be ignore', (done) => {
      chai.request(this.app)
        .post('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(pmKitty)
        .end((err, res) => {
          res.body.should.have.property('tenantId', 'chris');
          done();
        });
    });

    it('only can get the users in owen tenant', (done) => {
      chai.request(this.app)
        .get('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .end((err, res) => {
          res.body.should.have.property('data');
          res.body.data.should.have.lengthOf(3);
          done();
        });
    });
  });

  describe('client user', () => {
    const kitty = {
      username: 'kitty',
      password: '12345678',
      tenantId: 'client'
    };

    after(() => this.db.clean());

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
