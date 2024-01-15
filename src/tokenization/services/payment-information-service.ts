import { CreditCardResponse } from "../interfaces/credit-card-response";
import paymentInformationRepository from '../repositories/payment-info-repository'
import { NotFoundError } from '../../handlers/error-handler'

interface PaymentInformationService {
    getCardByToken: (token: string) => Promise<CreditCardResponse>;
}

const paymentInformationService: PaymentInformationService = {
    getCardByToken: async (token: string): Promise<CreditCardResponse> => {
        const paymentInfoWithToken =
            await paymentInformationRepository.getPaymentInformation(token);
        if (!paymentInfoWithToken)
            throw new NotFoundError(
                "No se ha encontrado la tarjeta porque el token ha expirado"
            );
        const { card_number, expiration_month, expiration_year } =
            paymentInfoWithToken;
        return {
            card_number,
            expiration_month,
            expiration_year,
        };
    },
};

export default paymentInformationService;