import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import { AccountDAODatabase } from "./AccountDAO";

const accountDAO = new AccountDAODatabase();

export default class Signup {

	constructor(readonly accountDAO: AccountDAODatabase) {
	}
	
	async execute (input: any) {
		input.id = crypto.randomUUID();
		const [accountData] = await accountDAO.getAccountByEmail(input.email);
		if (accountData) throw new Error("Duplicated account");
		if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
		if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
		if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
		if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate");
		await accountDAO.saveAccount(input);
		return {
			accountId: input.id
		};
	}
}
