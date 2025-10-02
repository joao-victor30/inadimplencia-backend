import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
    .catch(err => console.error("❌ Erro de conexão:", err));

// ==================== MODELOS ====================

// Registro
const RegistroSchema = new mongoose.Schema({
    codigo: Number,
    data: String
});
const Registro = mongoose.model("Registro", RegistroSchema);

// Negociacao
const NegociacaoSchema = new mongoose.Schema({
    cliente: String,
    valor: Number,
    parcelas: [String],
    status: String
});
const Negociacao = mongoose.model("Negociacao", NegociacaoSchema);

// ==================== ROTAS REGISTRO ====================

// Listar registros
app.get("/registros", async (req, res) => {
    try {
        const registros = await Registro.find();
        res.json(registros);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Criar registro
app.post("/registros", async (req, res) => {
    try {
        const novoRegistro = new Registro(req.body);
        await novoRegistro.save();
        res.json(novoRegistro);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Deletar registro por id
app.delete("/registros/:id", async (req, res) => {
    try {
        await Registro.findByIdAndDelete(req.params.id);
        res.json({ message: "Registro deletado" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// ==================== ROTAS NEGOCIACAO ====================

// Listar negociações
app.get("/negociacoes", async (req, res) => {
    try {
        const negociacoes = await Negociacao.find();
        res.json(negociacoes);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Criar negociação
app.post("/negociacoes", async (req, res) => {
    try {
        const novaNegociacao = new Negociacao(req.body);
        await novaNegociacao.save();
        res.json(novaNegociacao);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Atualizar negociação
app.put("/negociacoes/:id", async (req, res) => {
    try {
        const negociacaoAtualizada = await Negociacao.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(negociacaoAtualizada);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Deletar negociação
app.delete("/negociacoes/:id", async (req, res) => {
    try {
        await Negociacao.findByIdAndDelete(req.params.id);
        res.json({ message: "Negociação deletada" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// ==================== INICIAR SERVIDOR ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌍 Servidor rodando na porta ${PORT}`));
