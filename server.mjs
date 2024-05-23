import express from "express";
import blockchainRouter from "./routes/blockchain-routes.mjs";
import memberRouter from "./routes/member-routes.mjs";

// console.log(process.argv[1]);
// console.log(process.argv[2]);
// console.log(process.argv[3]);

const PORT = process.argv[2];

//const PORT = 5500;

const app = express();

// Middleware...
app.use(express.json());
app.use("/api/v1/blockchain", blockchainRouter);
app.use("/api/v1/members", memberRouter);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
