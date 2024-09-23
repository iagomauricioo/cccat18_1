import express from "express"
import { AccountDAODatabase } from "./AccountDAO";
import Signup from "./signup";
import GetAccount from "./GetAccounts";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const input = req.body;
    try {
        const accountDAO = new AccountDAODatabase();
        const signup = new Signup(accountDAO);
        const output = await signup.execute(input);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({ message: e.message});
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