const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para entender JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota Principal: Serve o seu index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint da API: Onde a mágica acontece
app.post('/api/generate', (req, res) => {
    const { length, hasUpper, hasLower, hasNumber, hasSymbol } = req.body;

    // Definição dos conjuntos de caracteres
    const charset = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        number: '0123456789',
        symbol: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    let characters = '';
    if (hasUpper) characters += charset.upper;
    if (hasLower) characters += charset.lowercase; // Corrigido para bater com o objeto
    if (hasNumber) characters += charset.number;
    if (hasSymbol) characters += charset.symbol;

    // Fallback caso nada seja selecionado
    if (characters === '') characters = charset.lower + charset.number;

    let generatedPassword = '';
    const charLength = characters.length;

    // Uso da biblioteca CRYPTO para máxima segurança
    for (let i = 0; i < length; i++) {
        // Gera um byte aleatório seguro
        const randomByte = crypto.randomBytes(1)[0];
        // Garante uma distribuição uniforme dentro do nosso charset
        generatedPassword += characters.charAt(randomByte % charLength);
    }

    // Retorna a senha em formato JSON
    res.json({ password: generatedPassword });
});

app.listen(PORT, () => {
    console.log(`-------------------------------------------`);
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`🚀 Pronto para testes locais antes do Deploy!`);
    console.log(`-------------------------------------------`);
});