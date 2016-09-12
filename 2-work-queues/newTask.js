#!/usr/bin/env node

const QUEUE = 'work-queue';

const Broker = require('amqplib/callback_api');
const Rx = require('rx');
Rx.Node = require('rx-node');

Broker.connect('amqp://root:root@localhost', (err, conn) =>
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
                chan.assertQueue(QUEUE, { durable: false });

                Rx.Node.fromStream(process.stdin).subscribe(emission =>
                {
                    let input = emission.toString('utf-8', 0, emission.length - 1);

                    if(input == 'stop')
                    {
                        conn.close();
                        console.log('[x] Goodbye!');
                        process.exit(0);
                    }

                    else
                    {
                        chan.sendToQueue(QUEUE, Buffer.from(input));
                        console.log(`[x] Queued work item "${input}"`);
                    }
                });
            }
        });
    }
});
