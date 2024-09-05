import crypto from "crypto";
import express from "express";
import { validateCpf } from "./validateCpf";
import pgp from "pg-promise";

const app = express();
app.use(express.json());

export const ERROR_MESSAGES = {
	emailExists: "Este e-mail já está em uso.",
	invalidName: "O nome deve conter pelo menos dois nomes.",
	invalidEmail: "O e-mail fornecido é inválido.",
	invalidCpf: "O CPF fornecido é inválido.",
	invalidCarPlate: "A placa do carro fornecida é inválida.",
};

const isValid = (nameIsValid: boolean, emailIsValid: boolean, cpfIsValid: boolean, carPlateIsValid: boolean) => {
	return nameIsValid && emailIsValid && cpfIsValid && carPlateIsValid;
}

app.post("/signup", async (req, res) => {
	const input = req.body;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const id = crypto.randomUUID();
	let result;
	const [acc] = await connection.query("select * from ccca.account where email = $1", [input.email]);
	if (acc) result = ERROR_MESSAGES.emailExists;
	if (!acc) {
		const nameIsValid = input.name.match(/[a-zA-Z] [a-zA-Z]+/)
		const emailIsValid = input.email.match(/^(.+)@(.+)$/)
		const carPlateIsValid = input.carPlate.match(/[A-Z]{3}[0-9]{4}/);
		const cpfIsValid = validateCpf(input.cpf);
		const INSERT_INTO_ACCOUNTS = "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)"
		if (!nameIsValid) result = ERROR_MESSAGES.invalidName;
		if (!emailIsValid) result = ERROR_MESSAGES.invalidEmail;
		if (!validateCpf(input.cpf)) result = ERROR_MESSAGES.invalidCpf;
		if (!carPlateIsValid) result = ERROR_MESSAGES.invalidCarPlate;
		if (isValid(nameIsValid, emailIsValid, cpfIsValid, carPlateIsValid)) {
			await connection.query(INSERT_INTO_ACCOUNTS, [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
			const obj = {
				accountId: id
			};
			result = obj;
		}
	}
	const resultIsOk = (typeof result === "object" && result.hasOwnProperty("accountId"));
	if (resultIsOk) res.json(result);
	if (!resultIsOk) res.status(422).json({ message: result });
	await connection.$pool.end();
});

app.get("/account/:id", async (req, res) => {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const accountId = req.params.id;
    try {
        const [account] = await connection.query('SELECT * FROM ccca.account WHERE account_id = $1', [accountId]);
    
    if (account) {
        res.json(account);
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    } catch (error) {
      console.error('Error fetching account:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
	console.log("Server running at http://localhost:3000");
});


export default app;