import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import pgp from "pg-promise";

export async function signup (input: any) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const id = crypto.randomUUID();
	const [accountData] = await connection.query("select * from ccca.account where email = $1", [input.email]);
	if (accountData) return -4;
	if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) return -3;
	if (!input.email.match(/^(.+)@(.+)$/)) return -2;
	if (!validateCpf(input.cpf)) return -1;
	if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) return -5;
	await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
	await connection.$pool.end();
	return {
		accountId: id
	};
};

export async function getAccountById (accountId: string) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
	await connection.$pool.end();
	return accountData
};
