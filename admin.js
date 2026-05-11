// Admin JavaScript - AmbienteOn
class AdminSystem {
    constructor() {
        this.currentUser = null;
        this.solicitations = [];
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadSampleData();
    }

    checkAuth() {
        const user = localStorage.getItem('adminUser');
        const path = window.location.pathname;
        const isLoginPage = path.includes('admin.html');
        const isDashboardPage = path.includes('dashboard.html');

        if (user) {
            this.currentUser = JSON.parse(user);
            if (isLoginPage) {
                window.location.href = 'dashboard.html';
            } else if (isDashboardPage) {
                this.updateUserInfo();
                this.renderDashboard();
            }
        } else {
            if (isDashboardPage) {
                window.location.href = 'admin.html';
            } else if (isLoginPage) {
                this.showLogin();
            }
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('adminLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior if it's a link
                this.logout();
            });
        }

        // Navigation (Old admin-nav and new admin-tabs)
        const navLinks = document.querySelectorAll('.admin-nav a, .admin-tabs a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Export buttons
        const exportPdfBtn = document.getElementById('exportPdfBtn');
        const exportExcelBtn = document.getElementById('exportExcelBtn');
        
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => this.exportToPDF());
        }
        
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', () => this.exportToExcel());
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const user = form.usuario.value.trim();
        const password = form.senha.value;

        // Simple authentication (in production, use secure backend)
        if (user === 'admin' && password === 'ambienteon2024') {
            this.currentUser = { name: 'Jaqueline do Nascimento', role: 'Administrador' };
            localStorage.setItem('adminUser', JSON.stringify(this.currentUser));
            // Redirect to dashboard page
            window.location.href = 'dashboard.html';
        } else {
            this.showLoginError('Usuário ou senha incorretos');
        }
    }

    showLoginError(message) {
        const errorElement = document.getElementById('loginError');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    showLogin() {
        const container = document.querySelector('.admin-container');
        const dashboard = document.querySelector('.admin-dashboard');
        
        if (container) container.style.display = 'flex';
        if (dashboard) dashboard.style.display = 'none';
    }

    showDashboard() {
        const container = document.querySelector('.admin-container');
        const dashboard = document.querySelector('.admin-dashboard');
        
        if (container) container.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        
        this.updateUserInfo();
        this.renderDashboard();
    }

    updateUserInfo() {
        const userNameElement = document.querySelector('.admin-user-name');
        const userRoleElement = document.querySelector('.admin-user-role');
        
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name;
        }
        if (userRoleElement && this.currentUser) {
            userRoleElement.textContent = this.currentUser.role;
        }
    }

    logout() {
        localStorage.removeItem('adminUser');
        this.currentUser = null;
        window.location.href = 'admin.html';
    }

    handleNavigation(e) {
        e.preventDefault();
        const target = e.target.getAttribute('href').substring(1);
        
        // Remove active class from all nav links
        document.querySelectorAll('.admin-nav a, .admin-tabs a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        e.target.classList.add('active');
        
        // Show corresponding section
        this.showSection(target);
    }

    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.style.display = 'none';
        });
        
        // Show selected section
        const targetSection = document.getElementById(`section-${section}`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }

    loadSampleData() {
        // Sample data for demonstration
        this.solicitations = [
            {
                id: 'AO' + Date.now().toString().slice(-6),
                date: new Date().toLocaleDateString('pt-BR'),
                company: 'Indústria Madeireira LTDA',
                cnpj: '12.345.678/0001-90',
                contact: 'Carlos Silva',
                phone: '(65) 99876-5432',
                email: 'carlos@madeireira.com.br',
                services: ['Licenciamento Ambiental', 'MTR'],
                status: 'pending',
                urgency: 'normal',
                message: 'Precisamos regularizar o licenciamento da nova unidade fabril.'
            },
            {
                id: 'AO' + (Date.now() - 86400000).toString().slice(-6),
                date: new Date(Date.now() - 86400000).toLocaleDateString('pt-BR'),
                company: 'Agropecuária ABC',
                cnpj: '98.765.432/0001-10',
                contact: 'Maria Santos',
                phone: '(65) 98765-4321',
                email: 'maria@agroabc.com.br',
                services: ['CAR', 'PGRS'],
                status: 'analysis',
                urgency: 'high',
                message: 'Solicito orçamento para regularização do CAR e elaboração do PGRS.'
            },
            {
                id: 'AO' + (Date.now() - 172800000).toString().slice(-6),
                date: new Date(Date.now() - 172800000).toLocaleDateString('pt-BR'),
                company: 'Comércio de Produtos Químicos',
                cnpj: '11.222.333/0001-44',
                contact: 'João Oliveira',
                phone: '(65) 99654-3210',
                email: 'joao@quimicos.com.br',
                services: ['CTF', 'PGRSS'],
                status: 'budget',
                urgency: 'normal',
                message: 'Necessitamos de orientação sobre o controle de produtos químicos.'
            }
        ];
    }

    renderDashboard() {
        this.renderStats();
        this.renderSolicitations();
    }

    renderStats() {
        const stats = {
            total: this.solicitations.length,
            pending: this.solicitations.filter(s => s.status === 'pending').length,
            analysis: this.solicitations.filter(s => s.status === 'analysis').length,
            budget: this.solicitations.filter(s => s.status === 'budget').length,
            completed: this.solicitations.filter(s => s.status === 'completed').length
        };

        const statsContainer = document.querySelector('.admin-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="admin-stat-card">
                    <div class="admin-stat-number">${stats.total}</div>
                    <div class="admin-stat-label">Total de Solicitações</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-number">${stats.pending}</div>
                    <div class="admin-stat-label">Pendentes</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-number">${stats.analysis}</div>
                    <div class="admin-stat-label">Em Análise</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-number">${stats.budget}</div>
                    <div class="admin-stat-label">Orçamento Enviado</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-number">${stats.completed}</div>
                    <div class="admin-stat-label">Concluídas</div>
                </div>
            `;
        }
    }

    renderSolicitations() {
        const tableBody = document.querySelector('#solicitationsTable tbody');
        if (tableBody) {
            tableBody.innerHTML = this.solicitations.map(solicitation => `
                <tr>
                    <td><strong>${solicitation.id}</strong></td>
                    <td>${solicitation.date}</td>
                    <td>${solicitation.company}</td>
                    <td>${solicitation.cnpj}</td>
                    <td>${solicitation.contact}</td>
                    <td>${solicitation.services.join(', ')}</td>
                    <td>
                        <span class="admin-status ${this.getStatusClass(solicitation.status)}">
                            ${this.getStatusLabel(solicitation.status)}
                        </span>
                    </td>
                    <td>
                        <div class="admin-table-actions">
                            <button class="admin-btn admin-btn-sm admin-btn-primary" onclick="adminSystem.viewSolicitation('${solicitation.id}')">
                                Ver
                            </button>
                            <button class="admin-btn admin-btn-sm admin-btn-secondary" onclick="adminSystem.editSolicitation('${solicitation.id}')">
                                Editar
                            </button>
                            <button class="admin-btn admin-btn-sm admin-btn-success" onclick="adminSystem.updateStatus('${solicitation.id}')">
                                Status
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }

    getStatusClass(status) {
        const statusClasses = {
            'pending': 'admin-status-pending',
            'analysis': 'admin-status-analysis',
            'budget': 'admin-status-budget',
            'completed': 'admin-status-completed',
            'cancelled': 'admin-status-cancelled'
        };
        return statusClasses[status] || 'admin-status-pending';
    }

    getStatusLabel(status) {
        const statusLabels = {
            'pending': 'Pendente',
            'analysis': 'Em Análise',
            'budget': 'Orçamento',
            'completed': 'Concluída',
            'cancelled': 'Cancelada'
        };
        return statusLabels[status] || 'Pendente';
    }

    viewSolicitation(id) {
        const solicitation = this.solicitations.find(s => s.id === id);
        if (solicitation) {
            alert(`
Detalhes da Solicitação

Protocolo: ${solicitation.id}
Data: ${solicitation.date}
Empresa: ${solicitation.company}
CNPJ: ${solicitation.cnpj}
Contato: ${solicitation.contact}
Telefone: ${solicitation.phone}
Email: ${solicitation.email}
Serviços: ${solicitation.services.join(', ')}
Urgência: ${solicitation.urgency}
Status: ${this.getStatusLabel(solicitation.status)}

Mensagem:
${solicitation.message}
            `);
        }
    }

    editSolicitation(id) {
        const solicitation = this.solicitations.find(s => s.id === id);
        if (solicitation) {
            alert(`Função de edição em desenvolvimento.\n\nProtocolo: ${id}`);
        }
    }

    updateStatus(id) {
        const solicitation = this.solicitations.find(s => s.id === id);
        if (solicitation) {
            const newStatus = prompt(`Alterar status da solicitação ${id}\n\nStatus atual: ${this.getStatusLabel(solicitation.status)}\n\nOpções:\n1 - Pendente\n2 - Em Análise\n3 - Orçamento Enviado\n4 - Concluída\n5 - Cancelada\n\nDigite o número do novo status:`);
            
            if (newStatus) {
                const statusMap = {
                    '1': 'pending',
                    '2': 'analysis',
                    '3': 'budget',
                    '4': 'completed',
                    '5': 'cancelled'
                };
                
                if (statusMap[newStatus]) {
                    solicitation.status = statusMap[newStatus];
                    this.renderDashboard();
                    alert(`Status atualizado com sucesso!`);
                } else {
                    alert('Opção inválida!');
                }
            }
        }
    }

    exportToPDF() {
        alert('Exportação para PDF em desenvolvimento.\n\nEsta função irá gerar um relatório completo das solicitações em formato PDF.');
    }

    exportToExcel() {
        // Create CSV content
        const headers = ['Protocolo', 'Data', 'Empresa', 'CNPJ', 'Contato', 'Serviços', 'Status', 'Urgência'];
        const csvContent = [
            headers.join(','),
            ...this.solicitations.map(s => [
                s.id,
                s.date,
                `"${s.company}"`,
                s.cnpj,
                `"${s.contact}"`,
                `"${s.services.join('; ')}"`,
                this.getStatusLabel(s.status),
                s.urgency
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `solicitacoes_ambienteon_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('Dados exportados com sucesso!\nArquivo CSV baixado.');
    }
}

// Initialize admin system
const adminSystem = new AdminSystem();