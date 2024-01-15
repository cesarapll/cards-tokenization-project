import { NextFunction, Request, Response } from "express";
import { PaymentInformation } from "../interfaces/payment-information";
import { CreditCard } from "../interfaces/credit-card";
import tokenService from "../services/token-service";
import { tokenRequestSchema } from "../validators/token-request";
import * as Yup from "yup";
import { nextTick } from "process";
import { BadRequestError, UnauthorizedError } from "../../handlers/error-handler";

interface TokenController {
    createToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCardByToken: (req: Request, res: Response, next: NextFunction) => void;
}

const tokenController: TokenController = {
    createToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await tokenRequestSchema.validate(req.body, { abortEarly: false });
            const { card_number, cvv, expiration_year, expiration_month, email } = result;
            const creditCard: CreditCard = {
                card_number,
                cvv,
                expiration_year,
                expiration_month,
            };
            const paymentInfo: PaymentInformation = {
                email,
                creditCard,
            };
            const token = await tokenService.signIn(paymentInfo);

            res.json({ token });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                res.status(400).json({ message: error.errors.join('. ') });
            } else {
                next(error)
            }
        }
    },
    getCardByToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.headers["card-token"];
            if (!token) throw new BadRequestError("No se ha encontrado el token de tarjeta");
            if (Array.isArray(token)) {
                throw new BadRequestError("Solo debe ingresar un token")
            }

            tokenService.verify(token);
            const { card_number, expiration_month, expiration_year } =
                await tokenService.getCardByToken(token);
            res.json({
                card_number,
                expiration_month,
                expiration_year,
            });

        } catch (error) {
            next(error)
        }
    },
};

export default tokenController;
