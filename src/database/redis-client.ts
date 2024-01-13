import * as redis from 'redis';

const client = redis.createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
}) 

client.on('error', err => console.error(`Redis Client Error: ${err}`))

client.on('connect', () => {
    console.log('Connected to Redis')
})

export default client;