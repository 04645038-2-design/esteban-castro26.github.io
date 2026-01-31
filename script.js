const defaultConfig = {
    tournament_title: 'Torneo Deportivo Tercer Ciclo',
    admin_password: '123472026'
};

let config = { ...defaultConfig };
let isAdmin = false;
let isLoading = false;
let allData = [];
let teams = [];
let matches = [];
let scorers = [];
let homeScorersInput = {};
let awayScorersInput = {};

const dataHandler = {
    onDataChanged(data) {
        allData = data;
        parseData();
        updateTeamSelects();
        renderMatches();
        renderStandings();
        renderScorers();
        renderStats();
        renderTeamsList();
        renderAllMatches();
        renderAllScorers();
        renderLiveMatches();
    }
};

function parseData() {
    teams = [];
    matches = [];
    scorers = [];

    allData.forEach(item => {
        try {
            const itemData = JSON.parse(item.item_data || '{}');
            if (item.record_type === 'team') {
                teams.push({ ...itemData, __backendId: item.__backendId });
            } else if (item.record_type === 'match') {
                matches.push({ ...itemData, __backendId: item.__backendId });
            } else if (item.record_type === 'scorer') {
                scorers.push({ ...itemData, __backendId: item.__backendId });
            }
        } catch (e) {
            console.error('Parse error:', e);
        }
    });
}

async function initApp() {
    if (window.dataSdk) {
        await window.dataSdk.init(dataHandler);
    }

    if (window.elementSdk) {
        window.elementSdk.init({
            defaultConfig,
            onConfigChange: (newConfig) => {
                config = { ...newConfig };
                document.getElementById('tournament-title').textContent = config.tournament_title || defaultConfig.tournament_title;
            }
        });
    }

    setupEventListeners();
}

function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.tab));
    });

    // Admin Tabs
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchAdminSection(btn.dataset.adminTab));
    });

    // Auth
    document.getElementById('admin-btn').addEventListener('click', (e) => {
        e.preventDefault();
        isAdmin ? switchSection('admin') : showLoginModal();
    });

    document.getElementById('login-submit').addEventListener('click', handleLogin);
    document.getElementById('login-cancel').addEventListener('click', hideLoginModal);
}

function switchSection(tabId) {
    document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${tabId}-section`).classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('tab-active', btn.dataset.tab === tabId);
    });
}

function handleLogin() {
    const password = document.getElementById('login-password').value;
    if (password === (config.admin_password || defaultConfig.admin_password)) {
        isAdmin = true;
        hideLoginModal();
        document.getElementById('admin-tab').classList.remove('hidden');
        switchSection('admin');
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
}

// ... Resto de funciones de renderizado (renderMatches, calculateStandings, etc.) ...

initApp();