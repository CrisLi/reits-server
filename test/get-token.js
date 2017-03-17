const chai = require('chai');

const admin = {
  username: 'admin@reits',
  password: 'helloreits!'
};

module.exports = app => (user = admin) => (
  new Promise((resolve, reject) => {
    chai.request(app)
      .post('/auth')
      .set('Accept', 'application/json')
      .send(user)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.body.token);
        }
      });
  })
);
