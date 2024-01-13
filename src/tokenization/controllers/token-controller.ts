import { Request, Response } from 'express'
import { PaymentInformation } from '../interfaces/payment-information';
import { CreditCard } from '../interfaces/credit-card';
import { signIn } from '../services/token-service'


export const createToken = async (req: Request, res: Response): Promise<void> => {
    const { card_number, cvv, expiration_year, expiration_month, email } = req.body;
    const creditCard: CreditCard = {
        card_number,
        cvv,
        expiration_year,
        expiration_month
    }
    const paymentInfo: PaymentInformation = {
        email,
        creditCard
    };
    const token = await signIn(paymentInfo)

    res.json({ token })
}

export const verifyToken = (req: Request, res: Response): void => {
    const token = req.query.token


}

