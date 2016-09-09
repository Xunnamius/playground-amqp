#!/usr/bin/env node

const broker = require('amqplib/callback_api');
const uuid = require('node-uuid');
const sleeper = require('sleep');
const Rx = require('rx');

Rx.Node = require('rx-node');

const QUEUE = 'work-queue';
const WORKER_ID = uuid.v4();
const WORKER_SHORT_ID = WORKER_ID.substr(0, 4);

broker.connect('amqp://root:root@localhost', (err, conn) =>
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
                chan.prefetch(1);

                console.log(`[*] Worker ${WORKER_ID} (${WORKER_SHORT_ID}) is online!`);

                chan.consume(QUEUE, (msg) =>
                {
                    let work = msg.content.toString();
                    let sleepTime = work.split('.').length - 1;

                    console.info(`[x](${WORKER_SHORT_ID}) Received work "${work}"`);
                    console.info(`[x](${WORKER_SHORT_ID}) Working for ${sleepTime} seconds...`);
                    sleeper.sleep(sleepTime);
                    console.info(`[x](${WORKER_SHORT_ID}) Previous work complete`);
                    chan.ack(msg);
                });
            }
        });
    }
});
