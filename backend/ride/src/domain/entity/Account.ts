export default class Account {
    private accountId: string;
    private name: string;
    private email: string;
    private cpf: string;
    private password: string;
    private carPlate: string;
    private isPassenger: boolean;
    private isDriver: boolean;
    
    constructor(accountId: string, name: string, email: string, cpf: string, password: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
        this.accountId = accountId;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.password = password;
        this.carPlate = carPlate;
        this.isPassenger = isPassenger;
        this.isDriver = isDriver;
    }

    getAccountId(): string {
        return this.accountId;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getCpf(): string {
        return this.cpf;
    }

    getPassword(): string {
        return this.password;
    }

    getCarPlate(): string {
        return this.carPlate;
    }

    getIsPassenger(): boolean {
        return this.isPassenger;
    }

    getIsDriver(): boolean {
        return this.isDriver;
    }   
}