const API_BASE_URL = 'https://gs-java-2025-apirest.onrender.com';

// Funções auxiliares para localStorage
export const storageUtils = {
  setEmpresaId: (id: number) => {
    console.log('💾 Salvando empresaId:', id);
    localStorage.setItem('empresaId', id.toString());
  },
  getEmpresaId: () => {
    const id = localStorage.getItem('empresaId');
    return id ? parseInt(id, 10) : null;
  },
  removeEmpresaId: () => {
    localStorage.removeItem('empresaId');
  },
  setUsuarioId: (id: number) => {
    console.log('💾 Salvando usuarioId:', id);
    localStorage.setItem('usuarioId', id.toString());
  },
  getUsuarioId: () => {
    const id = localStorage.getItem('usuarioId');
    return id ? parseInt(id, 10) : null;
  },
  removeUsuarioId: () => {
    localStorage.removeItem('usuarioId');
  },
  clear: () => {
    localStorage.removeItem('empresaId');
    localStorage.removeItem('usuarioId');
  },
};

// Função de requisição genérica - CORRIGIDA COM TIMEOUT MAIOR
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 [${options.method || 'GET'}] ${url}`);
  if (options.body) console.log('📤 Payload:', options.body);

  try {
    const controller = new AbortController();
    // AUMENTADO DE 30s PARA 60s - Render pode demorar na primeira request
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    const status = response.status;
    console.log(`📡 Status: ${status}`);

    if (status === 204) {
      return { status };
    }

    const contentType = response.headers.get('content-type');
    let data: T | undefined;
    let rawText = '';

    try {
      rawText = await response.text();
      console.log('📄 Resposta:', rawText.substring(0, 300));

      if (rawText && contentType?.includes('application/json')) {
        data = JSON.parse(rawText);
      } else if (rawText && !isNaN(Number(rawText))) {
        data = Number(rawText) as T;
      } else if (rawText) {
        try { data = JSON.parse(rawText); } catch { /* ignore */ }
      }
    } catch (e) {
      console.warn('⚠️ Erro ao processar resposta:', e);
    }

    if (!response.ok) {
      let errorMsg = `HTTP ${status}`;
      if (data && typeof data === 'object' && 'message' in data) {
        errorMsg = (data as { message: string }).message;
      } else if (rawText && rawText.length < 200) {
        errorMsg = rawText;
      }
      console.error(`❌ Erro ${status}:`, errorMsg);
      return { error: errorMsg, status };
    }

    return { data, status };

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { error: 'Timeout: API não respondeu em 60s. Tente novamente.', status: 0 };
      }
      console.error('❌ Erro de rede:', error.message);
      return { error: `Erro de conexão: ${error.message}`, status: 0 };
    }
    return { error: 'Erro desconhecido', status: 0 };
  }
}

// API de Cadastro
export const cadastroAPI = {
  async criarEmpresa(data: {
    nome_empresa: string;
    cnpj: string;
    setor: string;
    data_criacao: string;
    email_corporativo: string;
    senha_corporativa: string;
  }) {
    return fetchAPI('/cadastro/empresa', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async listarEmpresas() {
    return fetchAPI<string[]>('/cadastro/empresa/lista', { method: 'GET' });
  },

  async criarUsuario(data: {
    nome_usuario: string;
    email: string;
    senha: string;
    nm_empresa: string;
  }) {
    return fetchAPI('/cadastro/usuario', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// API de Login
export const loginAPI = {
  async loginEmpresa(data: {
    email_login_empresa: string;
    senha_login_empresa: string;
  }) {
    return fetchAPI<number>('/login/empresa', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async loginUsuario(data: {
    email_login_usuario: string;
    senha_login_usuario: string;
  }) {
    return fetchAPI<number>('/login/usuario', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// API de Desafios (Empresa) - CORRIGIDA
export const desafiosAPI = {
  async listarDesafiosEmpresa(empresaId: number) {
    return fetchAPI(`/desafio/empresa/${empresaId}`, { method: 'GET' });
  },

  async criarDesafio(data: {
    id_empresa: number;
    titulo: string;
    descricao: string;
    categoria: string;
    dificuldade: string;
    xp_recompensa: number;
  }) {
    return fetchAPI('/desafio/criar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ✅ CORRIGIDO: Adicionado campo "ativo" obrigatório
  async atualizarDesafio(data: {
    id_desafio: number;
    id_empresa: number;
    titulo: string;
    descricao: string;
    categoria: string;
    dificuldade: string;
    xp_recompensa: number;
    ativo?: boolean; // Campo obrigatório no backend
  }) {
    // Garantir que ativo sempre seja enviado
    const payload = {
      ...data,
      ativo: data.ativo !== undefined ? data.ativo : true, // Default true
    };
    
    console.log('📝 Atualizando desafio:', payload);
    return fetchAPI('/desafio/atualizar', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deletarDesafio(idDesafio: number) {
    console.log('🗑️ Deletando desafio ID:', idDesafio);
    return fetchAPI(`/desafio/deletar/${idDesafio}`, { method: 'DELETE' });
  },
};

// API de Desafios do Usuário - CORRIGIDA
export const desafiosUsuarioAPI = {
  async listarDisponiveis(usuarioId: number) {
    return fetchAPI(`/desafiosUsuario/disponiveis/${usuarioId}`, { method: 'GET' });
  },

  async aceitarDesafio(usuarioId: number, idDesafio: number) {
    console.log(`🎯 Aceitando desafio ${idDesafio} para usuário ${usuarioId}`);
    return fetchAPI(`/desafiosUsuario/aceitar/${usuarioId}/${idDesafio}`, {
      method: 'POST',
    });
  },

  async listarAceitos(usuarioId: number) {
    return fetchAPI(`/desafiosUsuario/desafiosAceitos/${usuarioId}`, { method: 'GET' });
  },

  // ✅ CORRIGIDO: URL e método corretos
  async concluirDesafio(usuarioId: number, idDesafio: number) {
    console.log(`✅ Concluindo desafio ${idDesafio} para usuário ${usuarioId}`);
    console.log(`📍 URL: PUT /desafiosUsuario/concluirDesafio/${usuarioId}/${idDesafio}`);
    
    return fetchAPI(`/desafiosUsuario/concluirDesafio/${usuarioId}/${idDesafio}`, {
      method: 'PUT', // Backend espera PUT
    });
  },

  async obterStats(usuarioId: number) {
    return fetchAPI<{
      id_status_usuario: number;
      id_usuario: number;
      desafios_concluidos: number;
      nivel_atual: number;
      xp_atual: number;
      xp_total: number;
    }>(`/desafiosUsuario/stats/${usuarioId}`, { method: 'GET' });
  },
};