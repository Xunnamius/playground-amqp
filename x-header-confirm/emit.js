#!/usr/bin/env node

const XCHANGE = 'headers-exchange';

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

Q.spawn(function*()
{
    let conn = yield Broker.connect('amqp://root:root@localhost');
    let chan = yield conn.createConfirmChannel();

    chan.assertExchange(XCHANGE, 'headers', { durable: false });

    for(let count=0;; count=++count%3)
    {
        let output = (new Date()).toString();
        let opts = { headers: { 'type': 'request', 'appId': 'test2' }};

        chan.publish(XCHANGE, '', Buffer.from(output), opts, (err, ok) =>
        {
            if (err !== null)
                console.warn('[xx] Message nacked!');
            else
                console.log(`[xx] Message acked <${ok}}>`);
        });

        console.log(`[x] Published item "${output}" to <${XCHANGE} : ${JSON.stringify(opts)}>`);
        
        yield Q.delay(500);
    }
});
