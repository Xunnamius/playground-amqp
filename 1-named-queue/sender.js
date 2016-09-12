#!/usr/bin/env node
"use strict";

const queue = 'test-queue';
const amqp = require('amqplib');
const Q = require('q');
/*amqp.connect('amqp://root:root@localhost', (err, conn) =>
{
    if(err)
        console.error('CONN ERROR:', err);

    else
    {
        conn.createChannel((err, chan) =>
        {
            if(err)
                console.error('CHAN ERROR:', err);

            else
            {
                chan.assertQueue(queue, { durable: false });
                chan.sendToQueue(queue, Buffer.from('Hello, world!'));
                console.log('[x] Message sent!');
            }

            setTimeout(() => { conn.close(); process.exit(0); }, 500);
        });
    }
});*/

/*amqp.connect('amqp://root:root@localhost').then((conn) => {
    conn.createChannel().then((chan) => {
        chan.assertQueue(queue, { durable: false });
        chan.sendToQueue(queue, Buffer.from('Hello, world!'));
        console.log('[x] Message sent!');
    }).then(() => {
        Q.delay(500).then(() => {
            conn.close();
            process.exit(0);
        });    
    }).catch((err) => {
        console.log(err);
    });
});*/

Q.async(function*()
{   
    try
    {
        let conn = yield amqp.connect('amqp://root:root@localhost');
        let chan = yield conn.createChannel();
        
        while(true)
        {
            chan.assertQueue(queue, { durable: false });
            chan.sendToQueue(queue, Buffer.from('Hello, world!'));
            console.log('[x] Message sent!');
            yield Q.delay(500);
        }
    }

    catch(err)
    {
        console.error(err);
    }

})();
