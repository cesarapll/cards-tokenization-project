import express from 'express'
import tokenController from './controllers/token-controller';

const router = express.Router();

router.post("/", tokenController.createToken)
router.get("/card", tokenController.getCardByToken)

export default router;