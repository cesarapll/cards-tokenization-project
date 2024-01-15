import paymentInformationService from './payment-information-service';
import { CreditCardResponse } from '../interfaces/credit-card-response';
import paymentInformationRepository from '../repositories/payment-info-repository';
import tokenService from './token-service';
import { PaymentInformation } from '../interfaces/payment-information';

describe('PaymentInformationService', () => {

    let paymentInfoRepositorySetMock: jest.SpyInstance;
    let paymentInfoRepositoryGetMock: jest.SpyInstance;
    let validPaymentInfo: PaymentInformation;
    beforeEach(() => {
        paymentInfoRepositorySetMock = jest.spyOn(paymentInformationRepository, 'setPaymentInformationWithExpiration')
        paymentInfoRepositoryGetMock = jest.spyOn(paymentInformationRepository, 'getPaymentInformation')
        validPaymentInfo = {
            card_number: 4111111111111111,
            expiration_month: "12",
            expiration_year: "2024",
            cvv: 123,
            email: "cpizarrollanos@gmail.com",
        };
    });

    describe('getCardByToken', () => {
        test('should return credit card information with a valid non-expired token', async () => {

            paymentInfoRepositorySetMock.mockResolvedValue(undefined);
            const token = await tokenService.signIn(validPaymentInfo);
            paymentInfoRepositoryGetMock.mockResolvedValue({ ...validPaymentInfo, token });

            const expectedCard: CreditCardResponse = {
                card_number: 4111111111111111,
                expiration_month: "12",
                expiration_year: "2024",
            };

            const result = await paymentInformationService.getCardByToken(token);

            expect(result).toEqual(expectedCard);
        });

        test('should throw an error if the token has expired', async () => {

            paymentInfoRepositorySetMock.mockResolvedValue(undefined);
            const token = await tokenService.signIn(validPaymentInfo, 1);
            paymentInfoRepositoryGetMock.mockResolvedValue({ ...validPaymentInfo, token });

            await new Promise((resolve) => setTimeout(resolve, 2000));
            await expect(paymentInformationService.getCardByToken(token)).rejects.toThrow('El token de la tarjeta ha expirado');


        });


        test('should return credit card without cvv', async () => {

            paymentInfoRepositorySetMock.mockResolvedValue(undefined);
            const token = await tokenService.signIn(validPaymentInfo);
            paymentInfoRepositoryGetMock.mockResolvedValue({ ...validPaymentInfo, token });

            const expectedCardWithCvv = {
                card_number: 4111111111111111,
                expiration_month: "12",
                expiration_year: "2024",
                cvv: 123
            };

            const result = await paymentInformationService.getCardByToken(token);

            expect(result).not.toEqual(expectedCardWithCvv);
        })

    });
});
