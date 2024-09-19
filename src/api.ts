import express from "express"
import { getAccountById, signup } from "./signup";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const input = req.body;
    const output = await signup(input);
	if (typeof output === "number")  {
        res.status(422).json({ message: output});
    } else {
        res.json(output);
    }
});

app.get("/accounts/:accountId", async function (req, res) {
    const output = await getAccountById(req.params.accountId);
	res.json(output);
});

app.listen(3000);
console.log("Server running at http://localhost:3000/");