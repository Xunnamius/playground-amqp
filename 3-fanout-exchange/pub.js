#!/usr/bin/env node

const XCHANGE = 'fanout-exchange';

const Q      = require('q');
const Broker = require('amqplib/callback_api');

Q.spawn(function*() {
    let conn = yield Q.nfcall(Broker.connect, 'amqp://root:root@localhost');
    let chan = yield Q.nbind(conn.createChannel, conn)();

    chan.assertExchange(XCHANGE, 'fanout', { durable: false });

    while(true) // Wow! Watch out, haha!
    {
        let output = (new Date()).toString();
        chan.publish(XCHANGE, '', Buffer.from(output));
        console.log(`[x] Published item "${output}" to <${XCHANGE}>`);
        
        yield Q.delay(500); // This yield shit is so cool!
    }
});
