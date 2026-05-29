const API = 'http://localhost:3000';

let state = {
    competitors: [],
    teams: [],
    games: [],
    matches: []
};

document.addEventListener('DOMContentLoaded', async () => {

    await loadInitialData();

    renderAll();
});

async function loadInitialData() {

    const usuariosReq = await fetch(`${API}/usuarios`);
    const timesReq = await fetch(`${API}/times`);
    const jogosReq = await fetch(`${API}/modalidades`);
    const partidasReq = await fetch(`${API}/partidas`);

    const usuarios = await usuariosReq.json();
    const times = await timesReq.json();
    const jogos = await jogosReq.json();
    const partidas = await partidasReq.json();

    state.competitors = usuarios.map(u => ({
        id: u.id,
        name: u.nome,
        nickname: u.nome
    }));

    state.teams = times.map(t => ({
        id: t.id,
        name: t.nome
    }));

    state.games = jogos.map(j => ({
        id: j.id,
        name: j.nome_jogo,
        genre: 'Competitivo'
    }));

    state.matches = partidas.map(p => ({
        id: p.id,
        gameId: p.id_modalidade,
        team1Id: state.teams[0]?.id || null,
        team2Id: state.teams[1]?.id || null,
        score1: Number(p.placar.split('x')[0]),
        score2: Number(p.placar.split('x')[1]),
        date: p.data
    }));
}

function renderAll() {

    renderJogos();
    renderTimes();
    renderCompetidores();
    renderConfrontos();
}

function renderJogos() {

    const list = document.getElementById('list-jogos');

    list.innerHTML = state.games.map(g => `
        <div class="card">

            <span class="card-tag">
                ${g.genre}
            </span>

            <h3>${g.name}</h3>

            <p class="subtitle">
                ID: ${g.id}
            </p>

        </div>
    `).join('');
}

function renderTimes() {

    const list = document.getElementById('list-times');

    list.innerHTML = state.teams.map(t => `
        <div class="card">

            <span class="card-tag">
                EQUIPE
            </span>

            <h3>${t.name}</h3>

        </div>
    `).join('');
}

function renderCompetidores() {

    const list = document.getElementById('list-competidores');

    list.innerHTML = state.competitors.map(c => `
        <div class="card">

            <span class="card-tag">
                Competidor
            </span>

            <h3>${c.nickname}</h3>

            <p class="subtitle">
                ${c.name}
            </p>

        </div>
    `).join('');
}

function renderConfrontos() {

    const list = document.getElementById('list-confrontos');

    list.innerHTML = state.matches.map(m => {

        const game =
            state.games.find(
                g => g.id == m.gameId
            );

        const t1 =
            state.teams.find(
                t => t.id == m.team1Id
            );

        const t2 =
            state.teams.find(
                t => t.id == m.team2Id
            );

        const dateStr =
            new Date(m.date)
            .toLocaleString('pt-BR');

        return `
            <div class="card">

                <span class="card-tag">
                    ${game?.name || 'Jogo'}
                </span>

                <div class="match-card">

                    <div class="team-score">

                        <strong>
                            ${t1?.name || '???'}
                        </strong>

                        <div class="score">
                            ${m.score1}
                        </div>

                    </div>

                    <div class="vs">VS</div>

                    <div class="team-score">

                        <strong>
                            ${t2?.name || '???'}
                        </strong>

                        <div class="score">
                            ${m.score2}
                        </div>

                    </div>

                </div>

                <p class="subtitle">
                    ${dateStr}
                </p>

            </div>
        `;
    }).join('');
}