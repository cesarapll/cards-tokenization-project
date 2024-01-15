import { NextFunction, Request, Response } from "express";
import { PaymentInformation } from "../interfaces/payment-information";
import tokenService from "../services/token-service";

import * as Yup from "yup";

interface TokenController {
  createToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

const tokenController: TokenController = {
  createToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const paymentInfo: PaymentInformation = req.body as PaymentInformation;
      const token = await tokenService.signIn(paymentInfo);

      res.json({ token });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({ message: error.errors.join(". ") });
      } else {
        next(error);
      }
    }
  },
};

export default tokenController;
