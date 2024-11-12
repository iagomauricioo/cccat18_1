import dotenv from "dotenv";
import connection from "./database/connection";

export default interface AccountDAO {
    getAccountByEmail(email: string): Promise<any>;
    getAccountById(accountId: string): Promise<any>;
    saveAccount(account: any): Promise<void>;
}

dotenv.config();

export class AccountDAODatabase implements AccountDAO {
    async getAccountByEmail(email: string) {
        const [accountData] = await connection.query("select * from uber.account where email = $1", [email]);	
        return accountData;
    }
    
    async getAccountById (accountId: string) {
        const [accountData] = await connection.query("select * from uber.account where account_id = $1", [accountId]);
        return accountData
    };
    
    async saveAccount(account: any) {
        await connection.query("insert into uber.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]);
    }
}

export class AccountDAOMemory implements AccountDAO {
    accounts: any[];    

    constructor() {
        this.accounts = [];
    }

    async getAccountByEmail(email: string): Promise<any> {
        return this.accounts.find((account: any) => account.email === email);
    }
    async getAccountById(accountId: string): Promise<any> {
        return this.accounts.find((account: any) => account.accountId === accountId);
    }
    async saveAccount(account: any): Promise<any> {
        return this.accounts.push(account);
    }


}