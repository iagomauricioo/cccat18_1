import pgp from "pg-promise";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.DATABASE_URL);

const connectionOptions = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}

const pgPromise = pgp({});

const connection = pgPromise(connectionOptions);

export default connection;