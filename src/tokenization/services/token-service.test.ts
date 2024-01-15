import tokenService from "./token-service";
import jwt from "jsonwebtoken";
import paymentInformationRepository from "../repositories/payment-info-repository";
import { PaymentInformation } from "../interfaces/payment-information";

describe("Token Service", () => {
    let repositoryMock: jest.SpyInstance;
    let jwtSignMock: jest.SpyInstance;
    let mockedToken: string;
    let invalidPaymentInfo: PaymentInformation;
    let validPaymentInfo: PaymentInformation;
    beforeEach(() => {
        repositoryMock = jest.spyOn(
            paymentInformationRepository,
            "setPaymentInformationWithExpiration"
        );
        jwtSignMock = jest.spyOn(jwt, "sign");
        mockedToken = "mocked-token";
    });

    afterEach(() => {
        repositoryMock.mockRestore();
        jwtSignMock.mockRestore();
        invalidPaymentInfo = {} as PaymentInformation;
        validPaymentInfo = {} as PaymentInformation;
    });

    describe("Token Service", () => {
        describe("signIn", () => {
            test("should create a token with the correct payload", async () => {
                validPaymentInfo = {
                    card_number: 4111111111111111,
                    expiration_month: "12",
                    expiration_year: "2024",
                    cvv: 123,
                    email: "cpizarrollanos@gmail.com",
                };

                repositoryMock.mockResolvedValue(undefined);
                jwtSignMock.mockImplementation(
                    (payload, secret, options?) => mockedToken
                );

                const token = await tokenService.signIn(validPaymentInfo);

                expect(jwtSignMock).toHaveBeenCalled();
                expect(repositoryMock).toHaveBeenCalled();
                expect(token).toBe(mockedToken);
            });

            test("should throw an error if email doesn't have valid domains", async () => {
                invalidPaymentInfo = {
                    card_number: 4111111111111111,
                    expiration_month: "12",
                    expiration_year: "2024",
                    cvv: 123,
                    email: "cpizarrollanos@yop.com",
                };
                repositoryMock.mockResolvedValue(undefined);
                jwtSignMock.mockImplementation(
                    (payload, secret, options?) => mockedToken
                );

                await expect(tokenService.signIn(invalidPaymentInfo)).rejects.toThrow(
                    "El email no tiene un dominio gmail.com, hotmail.com o yahoo.es"
                );
            });

            test("should throw an error if card number is invalid according to Luhn's algorithm", async () => {
                invalidPaymentInfo = {
                    card_number: 9911111122223438,
                    expiration_month: "12",
                    expiration_year: "2024",
                    cvv: 123,
                    email: "cpizarrollanos@gmail.com",
                };

                repositoryMock.mockResolvedValue(undefined);
                jwtSignMock.mockImplementation(
                    (payload, secret, options?) => mockedToken
                );

                await expect(tokenService.signIn(invalidPaymentInfo)).rejects.toThrow(
                    "El número de tarjeta no cumple con el algoritmo de Luhn"
                );
            });

            test("should throw an error if expiration year is before than current one", async () => {
                const invalidPaymentInfo = {
                    card_number: 4111111111111111,
                    expiration_month: "12",
                    expiration_year: "2023",
                    cvv: 123,
                    email: "cpizarrollanos@gmail.com",
                };

                repositoryMock.mockResolvedValue(undefined);
                jwtSignMock.mockImplementation(
                    (payload, secret, options?) => mockedToken
                );

                await expect(tokenService.signIn(invalidPaymentInfo)).rejects.toThrow(
                    "El año de expiración debe ser igual o mayor al año actual y menor o igual al año actual más 5 años"
                );
            });
        });
    });
});
