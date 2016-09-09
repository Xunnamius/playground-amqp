#!/usr/bin/env node

const Q      = require('q');
const Broker = require('amqplib/callback_api');
const uuid   = require('node-uuid');
const Rx     = require('rx');

Rx.Node = require('rx-node');

const XCHANGE = 'fanout-exchange';
const WORKER_ID = uuid.v4();
const WORKER_SHORT_ID = WORKER_ID.substr(0, 4);

Q.spawn(function*() {
    let conn = yield Q.nfcall(Broker.connect, 'amqp://root:root@localhost');
    let chan = yield Q.nbind(conn.createChannel, conn)();

    chan.assertExchange(XCHANGE, 'fanout', { durable: false });

    let q = yield Q.nbind(chan.assertQueue, chan)('', { exclusive: true });
    
    chan.bindQueue(q.queue, XCHANGE, '');

    console.log(`[*] Subscriber ${WORKER_ID} (${WORKER_SHORT_ID}) is online!`);

    chan.consume(q.queue, (msg) =>
    {
        console.info(`[x](${WORKER_SHORT_ID}) Received pub "${msg.content.toString()}"`);
        chan.ack(msg);
    });
});

