import express from 'express'
import cors from 'cors';
import { authorizationMiddleware } from './middlewares/authorization';
import tokenRouter from './tokenization'
import redisClient from './database/redis-client'

const app = express();
const router = express.Router();
const port = 3000

app.use(cors())
app.use(express.json());

router.use('/tokens', tokenRouter)


app.use(authorizationMiddleware)
app.use(router)

redisClient.connect();

app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})