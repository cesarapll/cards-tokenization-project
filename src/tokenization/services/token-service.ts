import {
    PaymentInformation,
    PaymentInformationWithToken,
} from "../interfaces/payment-information";
import jwt from "jsonwebtoken";
import paymentInformationRepository from "../repositories/payment-info-repository";
import {
    UnauthorizedError,
} from "../../handlers/error-handler";
import paymentInfoValidator from "../validators/payment-info-validator";

const TOKEN_EXPIRATION = 60;

interface TokenService {
    signIn: (
        paymentInfo: PaymentInformation,
        tokenExpiration?: number
    ) => Promise<string>;
    verify: (token: string) => boolean;

}

const tokenService: TokenService = {
    signIn: async (
        paymentInfo: PaymentInformation,
        tokenExpiration: number = TOKEN_EXPIRATION
    ): Promise<string> => {

        await paymentInfoValidator.validate(paymentInfo, { abortEarly: false });

        const token = jwt.sign(paymentInfo, process.env.JWT_SECRET_KEY!, {
            expiresIn: tokenExpiration,
        });
        const paymentInfoWithToken: PaymentInformationWithToken = {
            ...paymentInfo,
            token,
        };
        await paymentInformationRepository.setPaymentInformationWithExpiration(
            `${token}`,
            paymentInfoWithToken
        );
        return token;
    },
    verify: (token: string): boolean => {
        jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, decodedPayload) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    throw new UnauthorizedError("El token de la tarjeta ha expirado");
                } else {
                    throw new UnauthorizedError("El token ingresado no es válido");
                }
            }
        });
        return true;
    },

};

export default tokenService;
