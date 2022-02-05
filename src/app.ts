import express from "express"
const app = express();

const PORT = 4000;
app.listen(PORT, () => { console.log(`🚀 O servidor está rodando na porta ${PORT}`) })