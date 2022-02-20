import express from "express"

require('dotenv').config()

import { router } from "./api.routes";
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(router)

const PORT = 4000;
app.listen(PORT, () => { console.log(`🚀 O servidor está rodando na porta ${PORT}`) })