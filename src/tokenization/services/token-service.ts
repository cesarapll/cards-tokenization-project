import {
    PaymentInformation,
    PaymentInformationWithToken,
} from "../interfaces/payment-information";
import jwt from "jsonwebtoken";
import paymentInformationRepository from "../repositories/payment-info-repository";
import { CreditCard } from "../interfaces/credit-card";
import { InternalServerError, NotFoundError, UnauthorizedError } from "../../handlers/error-handler";

const TOKEN_EXPIRATION = 60;

interface TokenService {
    signIn: (paymentInfo: PaymentInformation, tokenExpiration?: number) => Promise<string>;
    verify: (token: string) => boolean;
    getCardByToken: (token: string) => Promise<CreditCard>
}

const tokenService: TokenService = {
    signIn: async (
        paymentInfo: PaymentInformation,
        tokenExpiration: number = TOKEN_EXPIRATION
    ): Promise<string> => {
        const token = jwt.sign(paymentInfo, process.env.JWT_SECRET_KEY!, {
            expiresIn: tokenExpiration,
        });
        const paymentInfoWithToken: PaymentInformationWithToken = {
            ...paymentInfo,
            token,
        };
        await paymentInformationRepository.setPaymentInformationWithExpiration(`${token}`, paymentInfoWithToken);
        return token;
    },
    verify: (token: string): boolean => {

        jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, decodedPayload) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    throw new UnauthorizedError("El token ha expirado")
                } else {
                    throw new UnauthorizedError("El token no es válido")
                }
            }
        })
        return true;
    },
    getCardByToken: async (token: string): Promise<CreditCard> => {
        const paymentInfoWithToken = await paymentInformationRepository.getPaymentInformation(token);
        if (!paymentInfoWithToken) throw new NotFoundError("No se ha encontrado la tarjeta porque el token ha expirado");
        return paymentInfoWithToken.creditCard;
    }
}

export default tokenService;