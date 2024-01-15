export interface PaymentInformation {
    card_number: number;
    cvv: number;
    expiration_year: string;
    expiration_month: string;
    email: string;
}


export interface PaymentInformationWithToken extends PaymentInformation {
    token: string;
}