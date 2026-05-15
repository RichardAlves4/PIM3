import axios from 'axios';

// Cria uma instância customizada do Axios com configurações globais reaproveitáveis
const api = axios.create({
    // Define a URL base do servidor backend. 
    // Todas as chamadas posteriores usando 'api.get' ou 'api.post' anexarão o endpoint a este caminho.
    baseURL:'https://localhost:7156/api',
    
    // Configura os cabeçalhos padrão para todas as requisições feitas por esta instância
    headers: {
    // Informa à API que o corpo das requisições enviadas (payload) estará no formato estruturado JSON
    'Content-Type': 'application/json'
  }
});

// Exporta a instância configurada como padrão para que possa ser importada e utilizada em qualquer outro arquivo do projeto
export default api;