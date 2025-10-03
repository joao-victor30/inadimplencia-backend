import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ==================== CONEXÃO COM MONGODB ====================
mongoose.set("strictQuery", true); // evita warning futuro
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
    .catch(err => console.error("❌ Erro de conexão:", err));

// ==================== MODELOS ====================

// Registro
const RegistroSchema = new mongoose.Schema({
    codigo: { type: Number, required: true },
    data: { type: Date, default: Date.now }
});
const Registro = mongoose.model("Registro", RegistroSchema);

// Negociação
const NegociacaoSchema = new mongoose.Schema({
    cliente: { type: String, required: true },
    valor: { type: Number, required: true },
    parcelas: [String],
    status: { type: String, default: "pendente" }
});
const Negociacao = mongoose.model("Negociacao", NegociacaoSchema);

// ==================== ROTAS REGISTRO ====================

// Listar registros
app.get("/registro", async (req, res) => {
    try {
        const registros = await Registro.find();
        res.status(200).json(registros);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Criar registro
app.post("/Registro", async (req, res) => {
    try {
        const novoRegistro = new Registro(req.body);
        await novoRegistro.save();
        res.status(201).json(novoRegistro);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Deletar Registro por id
app.delete("/Registro/:id", async (req, res) => {
    try {
        const Registro = await Registro.findByIdAndDelete(req.params.id);
        if (!Registro) return res.status(404).json({ erro: "Registro não encontrado" });
        res.status(200).json({ message: "Registro deletado" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// ==================== ROTAS NEGOCIAÇÃO ====================

// Listar negociações
app.get("/Negociar", async (req, res) => {
    try {
        const Negociar = await Negociacao.find();
        res.status(200).json(Negociar);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Criar negociação
app.post("/Negociar", async (req, res) => {
    try {
        const novaNegociacao = new Negociacao(req.body);
        await novaNegociacao.save();
        res.status(201).json(novaNegociacao);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Atualizar negociação
app.put("/Negociar/:id", async (req, res) => {
    try {
        const negociacaoAtualizada = await Negociacao.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!negociacaoAtualizada) return res.status(404).json({ erro: "Negociação não encontrada" });
        res.status(200).json(negociacaoAtualizada);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Deletar negociação
app.delete("/Negociar/:id", async (req, res) => {
    try {
        const negociacao = await Negociacao.findByIdAndDelete(req.params.id);
        if (!negociacao) return res.status(404).json({ erro: "Negociação não encontrada" });
        res.status(200).json({ message: "Negociação deletada" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// ==================== INICIAR SERVIDOR ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌍 Servidor rodando na porta ${PORT}`));
