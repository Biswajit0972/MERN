import "dotenv/config";
import { app } from "./src/app.js";
import { dbConnection } from "./src/db/dbConnection.js";

dbConnection().then(app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}/`)
}))