// Script de teste para verificar a integração com a API
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

async function testAPI() {
  try {
    console.log('🧪 Testando conexão com a API...');
    
    // Teste 1: Verificar se a API está rodando
    const response = await axios.get(`${API_BASE_URL}/auth/login`, {
      timeout: 5000
    });
    
    console.log('✅ API está respondendo');
    console.log('Status:', response.status);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ API não está rodando. Certifique-se de que o servidor está ativo em http://localhost:5000');
    } else if (error.response?.status === 405) {
      console.log('✅ API está rodando (método não permitido é esperado para GET em /auth/login)');
    } else {
      console.log('⚠️ Erro na API:', error.message);
    }
  }
}

// Teste de login
async function testLogin() {
  try {
    console.log('\n🔐 Testando login...');
    
    const loginData = {
      email: 'admin@finplanner.com',
      password: 'admin123'
    };
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    
    console.log('✅ Login realizado com sucesso');
    console.log('Tokens recebidos:', {
      access_token: response.data.access_token ? 'Sim' : 'Não',
      refresh_token: response.data.refresh_token ? 'Sim' : 'Não'
    });
    
  } catch (error) {
    console.log('❌ Erro no login:', error.response?.data?.error || error.message);
  }
}

// Executar testes
testAPI().then(() => {
  testLogin();
});
