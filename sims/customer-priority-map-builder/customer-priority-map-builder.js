// Customer Priority Map Builder - rank priorities per stakeholder, then test an insight against the map
// CANVAS_HEIGHT: 760
// Learners rank five priorities for a CFO, CTO, and COO (arrow buttons or
// drag-and-drop), compare each ranking with an expert map, then see the
// completed Customer Priority Map with conflicts highlighted and decide where
// a teaching insight aligns or creates tension.

const APP_HEIGHT = 760;

const PRIORITIES = [
    'Reduce IT infrastructure costs',
    'Improve system reliability and uptime',
    'Enable faster product launches',
    'Strengthen cybersecurity',
    'Support innovation and R&D'
];
const SHORT = ['Cost', 'Reliability', 'Speed to launch', 'Security', 'Innovation'];

const STAKEHOLDERS = [
    { id: 'cfo', name: 'CFO', focus: 'Cost control, ROI, financial risk',
      expert: [0, 1, 3, 2, 4],
      why: 'A CFO ranks cost first, then reliability and security because outages and breaches are financial risks. Innovation spending looks like cost until it is tied to revenue.' },
    { id: 'cto', name: 'CTO', focus: 'Technical fit, security, innovation capability',
      expert: [3, 1, 4, 2, 0],
      why: 'A CTO owns security and uptime first, then the platform\'s ability to support innovation. Cost matters, but it is rarely the CTO\'s top concern.' },
    { id: 'coo', name: 'COO', focus: 'Operational efficiency, reliability, supply chain optimization',
      expert: [1, 2, 3, 0, 4],
      why: 'A COO needs the plant and supply chain running: reliability first, then faster launches. Long-range R&D is furthest from daily operations.' }
];

const INSIGHT = 'Brittle data infrastructure blocks innovation.';
const ALIGN = {
    cfo: { answer: 'Creates tension', why: 'The CFO ranks innovation last and may hear "innovation" as new cost.', tailor: 'Frame innovation as competitive advantage that drives revenue, and quantify what brittle infrastructure already costs in maintenance.' },
    cto: { answer: 'Aligns', why: 'The CTO cares about innovation capability and technical fit; brittle infrastructure is exactly their problem.', tailor: 'Emphasize how modern infrastructure reduces technical debt and enables new capabilities securely.' },
    coo: { answer: 'Partially aligns', why: 'The COO values faster launches (aligned) but fears disruption to reliability (tension).', tailor: 'Show how reliability improves during and after the change while launches get faster.' }
};

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    let idx = 0;
    const rankings = {};              // stakeholder id -> ordered list of priority indexes
    const firstTry = {};              // stakeholder id -> top-2 match on first submit
    let dragFrom = null;

    function header() {
        return `<h2>Customer Priority Map Builder</h2>
            <p class="subtitle">You're selling data infrastructure to a manufacturing company. Rank each stakeholder's priorities (1 = highest).</p>
            <div class="progress">${STAKEHOLDERS.map((s, i) => `<div class="dot ${i < idx ? 'right' : i === idx ? 'current' : ''}" style="width:auto;padding:0 10px;border-radius:14px;">${s.name}</div>`).join('')}<div class="dot ${idx === 3 ? 'current' : ''}" style="width:auto;padding:0 10px;border-radius:14px;">Map</div></div>`;
    }

    function renderRanking() {
        const s = STAKEHOLDERS[idx];
        if (!rankings[s.id]) rankings[s.id] = [0, 1, 2, 3, 4];
        const order = rankings[s.id];
        app.innerHTML = `${header()}
            <div class="card">
                <h3>Stakeholder ${idx + 1} of 3: ${s.name}</h3>
                <p style="margin:0;"><strong>Focus:</strong> ${s.focus}</p>
            </div>
            <div class="card">
                <h3>Rank the priorities for the ${s.name}</h3>
                <p style="margin:0 0 6px 0;font-size:0.85em;color:var(--muted);">Use the arrows, or drag a row onto another row to move it there.</p>
                <div id="rank">${order.map((p, i) => `
                    <div class="seq-item" draggable="true" data-i="${i}" style="cursor:grab;">
                        <span class="seq-num">${i + 1}</span>
                        <span class="seq-label">${PRIORITIES[p]}</span>
                        <span class="rmark" data-m="${i}"></span>
                        <button class="secondary small" data-up="${i}" ${i === 0 ? 'disabled' : ''} title="Move up" aria-label="Move ${PRIORITIES[p]} up">&uarr;</button>
                        <button class="secondary small" data-down="${i}" ${i === 4 ? 'disabled' : ''} title="Move down" aria-label="Move ${PRIORITIES[p]} down">&darr;</button>
                    </div>`).join('')}
                </div>
            </div>
            <div class="btn-row"><button id="submit">Submit Ranking</button><button id="next" class="secondary hidden">${idx < 2 ? 'Next Stakeholder' : 'Build the Map'}</button></div>
            <div id="feedback"></div>`;
        const move = (i, j) => {
            const [x] = order.splice(i, 1);
            order.splice(j, 0, x);
            renderRanking();
        };
        app.querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => move(+b.dataset.up, +b.dataset.up - 1)));
        app.querySelectorAll('[data-down]').forEach(b => b.addEventListener('click', () => move(+b.dataset.down, +b.dataset.down + 1)));
        app.querySelectorAll('#rank .seq-item').forEach(row => {
            row.addEventListener('dragstart', () => { dragFrom = +row.dataset.i; row.style.opacity = '0.5'; });
            row.addEventListener('dragend', () => { row.style.opacity = '1'; });
            row.addEventListener('dragover', e => e.preventDefault());
            row.addEventListener('drop', e => { e.preventDefault(); if (dragFrom !== null && dragFrom !== +row.dataset.i) move(dragFrom, +row.dataset.i); dragFrom = null; });
        });
        app.querySelector('#submit').addEventListener('click', () => check(s, order));
        app.querySelector('#next').addEventListener('click', () => { idx++; idx < 3 ? renderRanking() : renderMap(); });
    }

    function check(s, order) {
        const topOk = [...order.slice(0, 2)].sort().join() === [...s.expert.slice(0, 2)].sort().join();
        const exact = order.every((p, i) => p === s.expert[i]);
        if (firstTry[s.id] === undefined) firstTry[s.id] = topOk;
        order.forEach((p, i) => {
            const d = s.expert.indexOf(p) - i;
            app.querySelector(`[data-m="${i}"]`).innerHTML = d === 0 ? '<span class="mark-ok">&#10003;</span>' : `<span style="font-size:0.8em;color:var(--muted);">expert: #${s.expert.indexOf(p) + 1}</span>`;
        });
        const verdict = exact ? ['ok', 'Exact match with the expert map!'] : topOk ? ['ok', 'Your top two priorities match the expert map.'] : ['bad', 'Your top priorities differ from the expert map.'];
        app.querySelector('#feedback').innerHTML = `
            <div class="feedback ${verdict[0]}"><strong>${verdict[1]}</strong> ${s.why}
                <br><strong>Expert ranking:</strong> ${s.expert.map((p, i) => `${i + 1}. ${SHORT[p]}`).join(' &nbsp; ')}
                ${exact ? '' : '<br><em>Rankings are judgment calls; what matters is getting the top priorities right. Adjust and resubmit, or continue.</em>'}</div>`;
        app.querySelector('#next').classList.remove('hidden');
        app.scrollTop = app.scrollHeight;
    }

    function renderMap() {
        const rankOf = (sid, p) => rankings[sid].indexOf(p) + 1;
        const rows = PRIORITIES.map((name, p) => {
            const ranks = STAKEHOLDERS.map(s => rankOf(s.id, p));
            const spread = Math.max(...ranks) - Math.min(...ranks);
            return `<tr style="${spread >= 3 ? 'background:#fff8e1;' : ''}"><td>${name}${spread >= 3 ? ' <span class="tag k-feedback">conflict</span>' : ''}</td>${ranks.map(r => `<td style="text-align:center;${r <= 2 ? 'font-weight:bold;color:#2e7d32;' : r === 5 ? 'color:#c62828;' : ''}">${r}</td>`).join('')}</tr>`;
        }).join('');
        app.innerHTML = `${header()}
            <div class="feedback ok" style="margin-bottom:10px;">Here's your Customer Priority Map. Notice where priorities align and where they conflict.</div>
            <table class="summary">
                <tr><th>Priority</th>${STAKEHOLDERS.map(s => `<th style="text-align:center;">${s.name}</th>`).join('')}</tr>${rows}
            </table>
            <p style="font-size:0.82em;color:var(--muted);margin:4px 0 10px 0;">Numbers are your ranks (1 = highest). Rows marked "conflict" are ranked very differently by different stakeholders.</p>
            <div class="card">
                <h3>Your teaching insight: "${INSIGHT}"</h3>
                <p style="margin:0 0 6px 0;font-size:0.92em;">For each stakeholder, does this insight align with their priorities or create tension?</p>
                ${STAKEHOLDERS.map(s => `
                    <div class="field-row" style="align-items:center;margin-bottom:6px;">
                        <div style="flex:0 0 60px;font-weight:bold;">${s.name}</div>
                        <div class="choice-row" data-a="${s.id}" style="flex:1;">${['Aligns', 'Partially aligns', 'Creates tension'].map(o => `<button type="button" class="choice" data-v="${o}" style="flex:1 1 120px;padding:5px 8px;">${o}</button>`).join('')}</div>
                    </div>`).join('')}
            </div>
            <div class="btn-row"><button id="analyze" disabled>See Alignment Analysis</button></div>
            <div id="analysis"></div>`;
        const answers = {};
        app.querySelectorAll('[data-a]').forEach(row => row.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
            row.querySelectorAll('button').forEach(x => x.classList.remove('selected'));
            b.classList.add('selected');
            answers[row.dataset.a] = b.dataset.v;
            app.querySelector('#analyze').disabled = Object.keys(answers).length < 3;
        })));
        app.querySelector('#analyze').addEventListener('click', () => {
            const score = STAKEHOLDERS.filter(s => answers[s.id] === ALIGN[s.id].answer).length;
            const aligned = STAKEHOLDERS.filter(s => ALIGN[s.id].answer === 'Aligns').map(s => s.name);
            const tension = STAKEHOLDERS.filter(s => ALIGN[s.id].answer !== 'Aligns').map(s => s.name);
            const rankScore = STAKEHOLDERS.filter(s => firstTry[s.id]).length;
            app.querySelector('#analysis').innerHTML = `
                <div class="feedback ${score === 3 ? 'ok' : 'warn'}">
                    <strong>Alignment: ${score} of 3</strong> match the expert analysis (rankings: top priorities right on the first try for ${rankScore} of 3 stakeholders).
                    Your insight aligns with the <strong>${aligned.join(', ')}</strong> and creates tension with the <strong>${tension.join(' and ')}</strong>. Here's how to address that tension:
                </div>
                <table class="summary">
                    <tr><th>Stakeholder</th><th>You</th><th>Expert</th><th>Why</th><th>How to tailor the insight</th></tr>
                    ${STAKEHOLDERS.map(s => `<tr><td>${s.name}</td><td>${answers[s.id] === ALIGN[s.id].answer ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>'} ${answers[s.id]}</td><td>${ALIGN[s.id].answer}</td><td>${ALIGN[s.id].why}</td><td>${ALIGN[s.id].tailor}</td></tr>`).join('')}
                </table>
                <div class="feedback warn" style="margin-top:10px;"><strong>Remember:</strong> stakeholders rarely share the same priorities, priorities shift with strategy and competition, and a good insight often creates tension somewhere. Map it, then tailor the message to each stakeholder.</div>
                <div class="btn-row"><button id="retry" class="secondary">Start Over</button></div>`;
            app.querySelector('#retry').addEventListener('click', () => {
                idx = 0;
                Object.keys(rankings).forEach(k => delete rankings[k]);
                Object.keys(firstTry).forEach(k => delete firstTry[k]);
                renderRanking();
            });
            app.scrollTop = app.querySelector('#analysis').offsetTop - 8;
        });
    }

    renderRanking();
});
