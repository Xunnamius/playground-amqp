#!/usr/bin/env node

const XCHANGE = 'topic-exchange';

const Q      = require('q');
const Broker = require('amqplib');

let scope = 'anonymous';

process.on('uncaughtException', (exception) => {
    console.error(`"::ERROR:: Uncaught exception ${exception}`);
});

process.argv.slice(2).forEach((arg) =>
{
    scope = arg;
    console.info('[*] Scope now set to ' + scope);
});

Q.spawn(function*() {
    let conn = yield Broker.connect('amqp://root:root@localhost');
    let chan = yield conn.createChannel();

    chan.assertExchange(XCHANGE, 'topic', { durable: false });

    for(let count=0;; count=++count%3) // Wow! Watch out, haha!
    {
        let output = (new Date()).toString();
        let key = `${scope}.${count}`;
        chan.publish(XCHANGE, key, Buffer.from(output));
        console.log(`[x] Published item "${output}" to <${XCHANGE} : ${key}>`);
        
        yield Q.delay(500); // This yield shit is so cool!
    }
});
