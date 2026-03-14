const passwordDisplay = document.getElementById('password-display');
const copyBtn = document.getElementById('copy-btn');
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const generateBtn = document.getElementById('generate-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const toast = document.getElementById('toast');

// Atualizar valor do slider
lengthSlider.addEventListener('input', (e) => {
    lengthValue.innerText = e.target.value;
    updateStrengthMeter();
});

// Notificação Toast
function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Copiar Senha
copyBtn.addEventListener('click', () => {
    const password = passwordDisplay.value;
    if (!password) return;

    navigator.clipboard.writeText(password).then(() => {
        showToast();
    });
});

// Força da Senha com efeito visual melhorado
function updateStrengthMeter() {
    let strength = 0;
    const length = parseInt(lengthSlider.value);
    
    if (length > 12) strength += 2;
    if (length > 20) strength += 2;
    if (document.getElementById('uppercase').checked) strength += 2;
    if (document.getElementById('numbers').checked) strength += 2;
    if (document.getElementById('symbols').checked) strength += 2;

    if (strength <= 4) {
        strengthBar.style.width = '25%';
        strengthBar.style.backgroundColor = '#ef4444';
        strengthBar.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5)';
        strengthText.innerText = 'FRACA';
    } else if (strength <= 7) {
        strengthBar.style.width = '60%';
        strengthBar.style.backgroundColor = '#f59e0b';
        strengthBar.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.5)';
        strengthText.innerText = 'MÉDIA';
    } else {
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = '#10b981';
        strengthBar.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
        strengthText.innerText = 'FORTE';
    }
}

// Chamar API Backend
async function generatePassword() {
    const config = {
        length: lengthSlider.value,
        hasUpper: document.getElementById('uppercase').checked,
        hasLower: document.getElementById('lowercase').checked,
        hasNumber: document.getElementById('numbers').checked,
        hasSymbol: document.getElementById('symbols').checked
    };

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });

        const data = await response.json();
        passwordDisplay.value = data.password;
        updateStrengthMeter();
    } catch (error) {
        passwordDisplay.value = "Erro no Servidor!";
    }
}

generateBtn.addEventListener('click', generatePassword);
updateStrengthMeter();