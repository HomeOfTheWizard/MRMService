"use strict";

const request = require('supertest');
const assert = require('assert');
var fs = require('fs');
const app = require('../../lib/app');

let reserveJsonTestReq;
let reserveJsonTestRes;
let cancelJsonTestReq;
let cancelJsonTestRes;

before(function(){
  let reserveTestReq = fs.readFileSync('test/postRequestTestReserve.json');
  reserveJsonTestReq = JSON.parse(reserveTestReq);
  let reservetestPostRes = fs.readFileSync('test/end-to-end/postResponseTestReserve.json');
  reserveJsonTestRes = JSON.parse(reservetestPostRes);

  let cancelTestReq = fs.readFileSync('test/postRequestTestCancel.json');
  cancelJsonTestReq = JSON.parse(cancelTestReq);
  let canceltestPostRes = fs.readFileSync('test/end-to-end/posteResponseTestCancel.json');
  cancelJsonTestRes = JSON.parse(canceltestPostRes);
});

describe('POST /meetingroommanager/', function(){
  this.timeout(120000);

  it('reserves a room', function(done){
    request(app).post('/meetingroommanager/ReserveRoom')
      .send(reserveJsonTestReq)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end( function(err, res) {
          if (err) return done(err);
          assert.deepEqual(res.body, reserveJsonTestRes);
          done();
      });
  });

  it('cancel a reservation', function(done){
    request(app).post('/meetingroommanager/CancelReservation')
      .send(cancelJsonTestReq)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end( function(err, res) {
          if (err) return done(err);
          assert.deepEqual(res.body, cancelJsonTestRes);
          done();
      });
  });
});
