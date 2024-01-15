import redisClient from "../../database/redis-client";
import { PaymentInformationWithToken } from "../interfaces/payment-information";


const DEFAULT_EXPIRATION = 60;

interface PaymentInformationRepository {
  setPaymentInformationWithExpiration: (
    key: string,
    value: PaymentInformationWithToken,
    expiration?: number
  ) => Promise<void>;
  getPaymentInformation: (
    key: string
  ) => Promise<PaymentInformationWithToken | null>;
}


const paymentInformationRepository: PaymentInformationRepository = {
  setPaymentInformationWithExpiration: async (
    key: string,
    value: PaymentInformationWithToken,
    expiration: number = DEFAULT_EXPIRATION
  ): Promise<void> => {
    await redisClient.setEx(key, expiration, JSON.stringify(value));
  },
  getPaymentInformation: async (
    key: string
  ): Promise<PaymentInformationWithToken | null> => {
    const result = await redisClient.get(key);
    if (!result) return null;
    return JSON.parse(result) as PaymentInformationWithToken;
  }
}

export default paymentInformationRepository; 
