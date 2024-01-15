import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../handlers/error-handler";
import paymentInformationService from "../services/payment-information-service";

interface PaymentInformationController {
    getCardByToken: (req: Request, res: Response, next: NextFunction) => void;
}

const paymentInformationController: PaymentInformationController = {
    getCardByToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.headers["card-token"];
            if (!token) throw new BadRequestError("No se ha encontrado el token de tarjeta");
            if (Array.isArray(token)) {
                throw new BadRequestError("Solo debe ingresar un token")
            }
            const { card_number, expiration_month, expiration_year } =
                await paymentInformationService.getCardByToken(token);
            res.json({
                card_number,
                expiration_month,
                expiration_year,
            });

        } catch (error) {
            next(error)
        }
    },
}

export default paymentInformationController;