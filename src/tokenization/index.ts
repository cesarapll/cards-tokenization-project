import express from 'express'
import { createToken, verifyToken } from './controllers/token-controller';

const router = express.Router();

router.post("/", createToken)
router.get("/", verifyToken)

export default router;