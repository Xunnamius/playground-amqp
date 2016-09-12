#!/usr/bin/env node

const Q      = require('q');
const Broker = require('amqplib');
const uuid   = require('node-uuid');
const Rx     = require('rx');

Rx.Node = require('rx-node');

const XCHANGE = 'direct-exchange';
const WORKER_ID = uuid.v4();
const WORKER_SHORT_ID = WORKER_ID.substr(0, 4);

Q.spawn(function*() {
    let conn = yield Broker.connect('amqp://root:root@localhost');
    let chan = yield conn.createChannel();

    chan.assertExchange(XCHANGE, 'direct', { durable: false });

    let q = yield chan.assertQueue('', { exclusive: true });
    
    process.argv.slice(2).forEach((val) =>
    {
        chan.bindQueue(q.queue, XCHANGE, val);
        console.info('[*] Binding to ' + val);
    });

    console.log(`[*] Subscriber ${WORKER_ID} (${WORKER_SHORT_ID}) is online!`);

    chan.consume(q.queue, (msg) =>
    {
        console.info(`[x](${WORKER_SHORT_ID}) Received pub "${msg.content.toString()}"`);
        chan.ack(msg);
    });
});

