#!/usr/bin/env node
"use strict";

const queue = 'test-queue';
const amqp = require('amqplib');

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
                console.log('[*] Waiting for incoming...');
                chan.consume(queue, (msg) =>
                {
                    console.info(`[x] Received message "${msg.content.toString()}"`);
                }, { noAck: true });
            }
        });
    }
});
*/
amqp.connect('amqp://root:root@localhost').then((conn) =>
{
    conn.createChannel().then((channel) => 
    {
        channel.assertQueue(queue, { durable: false });
        console.log('[*] Waiting for incoming...');
        channel.consume(queue, (msg) => 
        {
            console.info(`[x] Received message "${msg.content.toString()}"`);
        }, { noAck: true });
    }).catch((err) => {
        console.error(err);
    });

}).catch((err) => {
    console.error(err);
});
