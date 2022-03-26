import express from "express"

require('dotenv').config()

import { router } from "./api.routes";
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(router)

app.listen(process.env.PORT || 5000, () => { console.log(`🚀 O servidor está rodando na porta ${process.env.PORT}`) })