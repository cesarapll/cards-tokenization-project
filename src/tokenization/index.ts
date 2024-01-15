import express from 'express'
import tokenController from './controllers/token-controller';
import paymentInformationController from './controllers/payment-information-controller';
const router = express.Router();

router.post("/tokens", tokenController.createToken)
router.get("/card", paymentInformationController.getCardByToken)

export default router;