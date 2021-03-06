#!/usr/bin/env node

const XCHANGE = 'debug_ax';
const QUEUE   = 'debug_ax_queue';

const Q      = require('q');
const Broker = require('amqplib');
const uuid   = require('node-uuid');

const WORKER_ID = uuid.v4();
const WORKER_SHORT_ID = WORKER_ID.substr(0, 4);

Q.spawn(function*() {
    let conn = yield Broker.connect('amqp://root:root@localhost');
    let chan = yield conn.createChannel();

    chan.bindQueue(QUEUE, XCHANGE, '');

    console.log(`[*] AX debug subscriber ${WORKER_ID} (${WORKER_SHORT_ID}) is online!`);

    chan.consume(QUEUE, (msg) =>
    {
        console.info(`[x](${WORKER_SHORT_ID}) Received AX pub "${msg.content.toString()}"`);
        chan.ack(msg);
    });
});
