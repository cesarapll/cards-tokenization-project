import * as Yup from "yup";
import luhn from "fast-luhn";

export const tokenRequestSchema = Yup.object().shape({
    card_number: Yup.number()
        .required()
        .test({
            name: "isValidLength",
            message: "El número de tarjeta debe tener entre 13 y 16 dígitos",
            test: (value) =>
                value !== undefined &&
                (value.toString().length === 13 || value.toString().length === 16),
        })
        .test({
            name: "isValidWithLuhn",
            message: "El número de tarjeta no cumple con el algoritmo de Luhn",
            test: (value) => {
                return luhn(value.toString());
            },
        }),
    cvv: Yup.number()
        .required()
        .test({
            name: "isValidLength",
            message: "El CVV debe tener 3 o 4 dígitos",
            test: (value) =>
                value !== undefined &&
                (value.toString().length === 3 || value.toString().length === 4),
        }),
    expiration_year: Yup.string().length(4).required()
        .test({
            name: 'isAValidYearNumber',
            message: 'El año no es un número válido',
            test: (value) => {
                const numericYear = Number(value)
                if (isNaN(numericYear)) return false;
                const todayYear = (new Date()).getFullYear()
                return numericYear >= todayYear && numericYear <= todayYear + 5
            }
        }),

    expiration_month: Yup.string().min(1).max(2).required()
        .test({
            name: 'isAValidMonthNumber',
            message: 'El mes no es un número válido',
            test: (value) => {
                const numericMonth = Number(value)
                if (isNaN(numericMonth)) return false;
                return numericMonth >= 1 && numericMonth <= 12;
            }
        }),
    email: Yup.string()
        .required()
        .email()
        .min(5)
        .max(100)
        .test({
            name: "isValidDomainEmail",
            message: "El email no tiene un dominio gmail.com, hotmail.com o yahoo.es",
            test: (value) => {
                const validDomains = ["gmail.com", "hotmail.com", "yahoo.es"];
                if (!value) return false;
                const domain = value.split("@")[1];
                return validDomains.includes(domain);
            },
        }),
});
