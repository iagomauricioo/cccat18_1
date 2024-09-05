import express from "express";
import { getDatabaseConnection } from "../database/getDatabaseConnection";

const app = express();
app.use(express.json());
const connection = getDatabaseConnection();

app.get("/account/:id", async (req, res) => {
    const accountId = req.params.id;
    try {
        const [account] = await connection.query('SELECT * FROM ccca.account WHERE account = $1', [accountId]);
    
    if (account) {
        res.json(account);
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    } catch (error) {
      console.error('Error fetching account:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
})

app.listen(3000, () => {
	console.log("Server running at http://localhost:3000");
});


export default app;