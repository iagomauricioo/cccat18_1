import express from "express"
import { AccountDAODatabase } from "./AccountDAO";
import GetAccount from "./GetAccounts";
import { MailerGatewayMemory } from "./MailerGateway";
import Signup from "./Signup";
import cors from "cors";
import Login from "./Login";
import connection from "./database/connection";

const app = express();
app.use(express.json());
app.use(cors())

app.post("/signup", async function (req, res) {
	const input = req.body;
    try {
        const accountDAO = new AccountDAODatabase();
        const mailerGateway = new MailerGatewayMemory();
        const signup = new Signup(accountDAO, mailerGateway);
        const output = await signup.execute(input);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({ message: e.message});
    }
});

app.post("/login", async function (req, res) {
    const input = req.body;
    try {
        const accountDAO = new AccountDAODatabase();
        const login = new Login(accountDAO);
        const output = await login.execute(input);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({ message: e.message });
    }
});

app.get("/accounts/:accountId", async function (req, res) {
    const accountDAO = new AccountDAODatabase();
    const getAccount = new GetAccount(accountDAO);
    const output = await getAccount.execute(req.params.accountId);
	res.json(output);
});

app.listen(3000);
console.log("Server running at http://localhost:3000/");

process.on("SIGINT", async () => {
    console.log("\nRecebendo sinal de interrupção... Fechando a conexão com o banco de dados.");
    await connection.$pool.end();
    console.log("Conexão com o banco de dados fechada.");
    process.exit(0);
})