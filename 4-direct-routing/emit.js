#!/usr/bin/env node

const XCHANGE = 'direct-exchange';

const Q      = require('q');
const Broker = require('amqplib/callback_api');

Q.spawn(function*() {
    let conn = yield Q.nfcall(Broker.connect, 'amqp://root:root@localhost');
    let chan = yield Q.nbind(conn.createChannel, conn)();

    chan.assertExchange(XCHANGE, 'direct', { durable: false });

    for(let count=0;; count=++count%3) // Wow! Watch out, haha!
    {
        let output = (new Date()).toString();
        chan.publish(XCHANGE, count.toString(), Buffer.from(output));
        console.log(`[x] Published item "${output}" to <${XCHANGE}:${count}>`);
        
        yield Q.delay(500); // This yield shit is so cool!
    }
});
