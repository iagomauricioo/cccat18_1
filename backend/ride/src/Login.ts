import AccountDAO from "./AccountDAO";

export default class Login {

    constructor(readonly accountDAO: AccountDAO) {}

    async execute(input: any) {
        const accountData = await this.accountDAO.getAccountByEmail(input.email);
        if (!accountData) throw new Error("Account not found");
        if (accountData.password !== input.password) throw new Error("Invalid password");
        
        return {
            accountId: accountData.accountId
        };
    }
}
