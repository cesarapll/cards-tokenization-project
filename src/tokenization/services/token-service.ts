import { PaymentInformation, PaymentInformationWithToken } from "../interfaces/payment-information";
import jwt from 'jsonwebtoken'
import { setPaymentInformationWithExpiration } from '../repositories/token-repository';

export const signIn = async (paymentInfo: PaymentInformation): Promise<string> => {
    const { email, ...creditCard } = paymentInfo
    const token = jwt.sign(creditCard, 'secret-key', { expiresIn: '60' })
    const paymentInfoWithToken: PaymentInformationWithToken = { ...paymentInfo, token }
    console.log(paymentInfoWithToken)
    await setPaymentInformationWithExpiration(`${token}`, paymentInfoWithToken);

    return token;
}

export const verify = (token: string) => {
    const creditCard = jwt.verify(token, 'secret-key');
    return creditCard
}

