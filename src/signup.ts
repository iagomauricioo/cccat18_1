import crypto from "crypto";
import express from "express";
import { validateCpf } from "./validateCpf";
import pgp from "pg-promise";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const input = req.body;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const id = crypto.randomUUID();
		let result;
		const [acc] = await connection.query("select * from ccca.account where email = $1", [input.email]);
		if (acc) result = -4;
		if (!acc) {
			const nameIsValid = input.name.match(/[a-zA-Z] [a-zA-Z]+/)
			const emailIsValid = input.email.match(/^(.+)@(.+)$/)
			const carPlateIsValid = input.carPlate.match(/[A-Z]{3}[0-9]{4}/);
			const INSERT_INTO_ACCOUNTS = "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)"
			if (!nameIsValid) result = -3;
			if (!emailIsValid) result = -2;
			if (!validateCpf(input.cpf)) result = -1;
			if (!carPlateIsValid) result = -5;
			if (nameIsValid) {
				if (emailIsValid) {
					if (validateCpf(input.cpf)) {
						if (carPlateIsValid) {
							await connection.query(INSERT_INTO_ACCOUNTS, [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
							const obj = {
								accountId: id
							};
							result = obj;
						}
					}
				}

			}

		}


		if (typeof result === "number") {
			res.status(422).json({ message: result });
		} else {
			res.json(result);
		}
	} finally {
		await connection.$pool.end();
	}
});

app.listen(3000, () => {
	console.log("Server running at http://localhost:3000");
});


export default app;