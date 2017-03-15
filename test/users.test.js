/* eslint-env node, mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const getToken = require('./get-token');
const cleanDb = require('./clean-db');

chai.use(chaiHttp);
chai.should();

const chris = {
  email: 'chris@reits.com',
  password: '12345678',
  roles: ['PM'],
  tenantId: 'reits'
};

const kitty = {
  email: 'kitty@self.com',
  password: '12345678',
  roles: ['Client'],
  tenantId: 'client'
};

describe('users api', () => {
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

    it('can create user on [reits] tenant', (done) => {
      chai.request(this.app)
        .post('/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(this.token))
        .send(chris)
        .end((err, res) => {
          res.body.should.have.property('_id');
          res.body.should.have.property('email', 'chris@reits.com');
          done();
        });
    });

    it("can't create tenant user without token", (done) => {
      chai.request(this.app)
        .post('/users')
        .send(chris)
        .end((err, res) => {
          res.body.should.have.property('code', 401);
          done();
        });
    });
  });

  describe('client', () => {
    after(() => cleanDb(this.app));

    it('client user can register', (done) => {
      chai.request(this.app)
        .post('/users')
        .send(kitty)
        .end((err, res) => {
          res.body.should.have.property('_id');
          done();
        });
    });
  });
});
