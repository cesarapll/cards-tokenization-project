import { CreditCard } from './credit-card'

export interface PaymentInformation {
    email: string;
    creditCard: CreditCard;
}


export interface PaymentInformationWithToken extends PaymentInformation {
    token: string;
}