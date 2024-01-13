import redisClient from '../../database/redis-client'
import { PaymentInformationWithToken } from '../interfaces/payment-information'

const DEFAULT_EXPIRATION = 60

export const setPaymentInformationWithExpiration = async (key: string, value: PaymentInformationWithToken): Promise<void> => {
    redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(value))
}

export const getPaymentInformation = async (key: string): Promise<PaymentInformationWithToken | null> => {
    const result = await redisClient.get(key);
    if (!result) return null;
    return JSON.parse(result) as PaymentInformationWithToken;
}


