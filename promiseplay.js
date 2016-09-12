#!/usr/bin/env node

const broker = require('amqplib');
const uuid = require('node-uuid');
const Rx = require('rx');
const Q = require('q');

var p1 = new Promise(function(resolve, reject) {
  resolve('Success');
});

Q(p1.then(function(value) {
  console.log(value); // "Success!"
  throw 'oh, no!';
})).catch(function(e) {
  console.log(e); // "oh, no!"
}).then(function(){
  console.log('after a catch the chain is restored');
  throw 'bad shit';
}, function () {
  console.log('Not fired due to the catch');
}).done();
