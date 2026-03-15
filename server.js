const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();

// Porta padrão 3000 ou a definida pelo ambiente da SaveinCloud
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON
app.use(express.json());

/**
 * CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS
 * Como não existe mais a pasta 'public', dizemos ao Express para servir 
 * os arquivos diretamente da raiz do projeto (__dirname).
 */
app.use(express.static(__dirname));

// Rota Principal: Serve o index.html que agora está na mesma pasta que este server.js
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint da API: Geração da senha com Crypto
app.post('/api/generate', (req, res) => {
    const { length, hasUpper, hasLower, hasNumber, hasSymbol } = req.body;

    const charset = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        number: '0123456789',
        symbol: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    let characters = '';
    if (hasUpper) characters += charset.upper;
    if (hasLower) characters += charset.lower; 
    if (hasNumber) characters += charset.number;
    if (hasSymbol) characters += charset.symbol;

    // Fallback de segurança
    if (characters === '') characters = charset.lower + charset.number;

    let generatedPassword = '';
    const charLength = characters.length;

    // Algoritmo de geração segura (CSPRNG)
    for (let i = 0; i < length; i++) {
        const randomByte = crypto.randomBytes(1)[0];
        generatedPassword += characters.charAt(randomByte % charLength);
    }

    res.json({ password: generatedPassword });
});

// Iniciando o servidor
// Ouve apenas no IP Privado da instância Node.js
app.listen(PORT, '10.100.31.71', () => {
    console.log(`✅ Node.js ouvindo na rede privada: http://10.100.31.71:${PORT}`);
});


