#!/usr/bin/env node

const queue = 'test-queue';
let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) =>
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
});
