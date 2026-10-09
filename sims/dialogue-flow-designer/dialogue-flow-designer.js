// Dialogue Flow Designer - design the conversation flow for a CFO practice agent
// CANVAS_HEIGHT: 720
// Learners order six dialogue stages, choose a transition condition between each
// pair (including a strong/weak coaching branch), and see a live flowchart.

const APP_HEIGHT = 720;

const SCENARIO = 'Design a dialogue flow for a sales practice agent simulating a CFO conversation.';

// Correct order
const STAGES = [
    { id: 'intro',     name: 'Introduction',           desc: 'Agent introduces CFO persona and company context' },
    { id: 'challenge', name: 'Challenge presentation', desc: 'Agent presents business challenge' },
    { id: 'insight',   name: 'Insight delivery',       desc: 'Agent delivers Challenger insight' },
    { id: 'objection', name: 'Objection raising',      desc: 'Agent raises price objection' },
    { id: 'evaluate',  name: 'Response evaluation',    desc: "Agent evaluates salesperson's objection handling" },
    { id: 'closing',   name: 'Closing',                desc: 'Agent summarizes conversation and provides feedback' }
];

const START_ORDER = ['objection', 'intro', 'closing', 'insight', 'evaluate', 'challenge'];

const TRANSITIONS = {
    auto:     'Proceed automatically',
    response: 'Proceed after salesperson responds',
    branch:   'Branch: strong \u2192 next, weak \u2192 coaching loop'
};

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);
    injectStyles();

    const byId = Object.fromEntries(STAGES.map(s => [s.id, s]));
    let order = START_ORDER.slice();
    let trans = new Array(5).fill('auto');   // trans[i] = transition from order[i] to order[i+1]

    app.innerHTML = `
        <h2>Dialogue Flow Designer</h2>
        <p class="subtitle">${SCENARIO}</p>
        <div class="dfd-cols">
            <div class="dfd-col">
                <div class="dfd-head">1. Arrange stages and set transitions <span class="dfd-muted">(drag or use arrows)</span></div>
                <div id="builder"></div>
            </div>
            <div class="dfd-col">
                <div class="dfd-head">2. Flow diagram</div>
                <div id="diagram"></div>
            </div>
        </div>
        <div class="btn-row">
            <button id="submit">Submit Flow Design</button>
            <button id="reset" class="secondary">Reset</button>
        </div>
        <div id="feedback"></div>
    `;

    const builder = app.querySelector('#builder');
    const diagram = app.querySelector('#diagram');
    const fb = app.querySelector('#feedback');

    app.querySelector('#reset').addEventListener('click', () => {
        order = START_ORDER.slice();
        trans = new Array(5).fill('auto');
        fb.innerHTML = '';
        render();
    });
    app.querySelector('#submit').addEventListener('click', evaluate);

    function render() {
        builder.innerHTML = order.map((id, i) => `
            <div class="dfd-stage" draggable="true" data-i="${i}">
                <span class="dfd-n">${i + 1}</span>
                <span class="dfd-name"><strong>${byId[id].name}</strong><br><span class="dfd-muted">${byId[id].desc}</span></span>
                <button class="small secondary" data-move="-1" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Move up">&uarr;</button>
                <button class="small secondary" data-move="1" data-i="${i}" ${i === 5 ? 'disabled' : ''} aria-label="Move down">&darr;</button>
            </div>
            ${i < 5 ? `<div class="dfd-trans"><span>&darr;</span>
                <select data-t="${i}" aria-label="Transition ${i + 1}">
                    ${Object.entries(TRANSITIONS).map(([k, v]) => `<option value="${k}" ${trans[i] === k ? 'selected' : ''}>${v}</option>`).join('')}
                </select></div>` : ''}`).join('');

        builder.querySelectorAll('[data-move]').forEach(b => b.addEventListener('click', () => {
            const i = +b.dataset.i, j = i + +b.dataset.move;
            [order[i], order[j]] = [order[j], order[i]];
            render();
        }));
        builder.querySelectorAll('select').forEach(s => s.addEventListener('change', () => {
            trans[+s.dataset.t] = s.value;
            drawDiagram();
        }));
        builder.querySelectorAll('.dfd-stage').forEach(el => {
            el.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', el.dataset.i));
            el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('over'); });
            el.addEventListener('dragleave', () => el.classList.remove('over'));
            el.addEventListener('drop', e => {
                e.preventDefault();
                const from = +e.dataTransfer.getData('text/plain'), to = +el.dataset.i;
                const [moved] = order.splice(from, 1);
                order.splice(to, 0, moved);
                render();
            });
        });
        drawDiagram();
    }

    // Vertical flowchart; branches get a side "Coaching" node that loops back
    function drawDiagram(marks) {
        const W = 340, boxW = 200, boxH = 38, gap = 30, x0 = 10, top = 8;
        const H = top + 6 * boxH + 5 * gap + 8;
        const y = i => top + i * (boxH + gap);
        let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-height:${H}px">
            <defs>
                <marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#546e7a"/></marker>
                <marker id="ahr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#e65100"/></marker>
            </defs>`;
        order.forEach((id, i) => {
            const fill = marks ? (marks[i] ? '#e8f5e9' : '#ffebee') : (i === 0 ? '#e3f2fd' : i === 5 ? '#ede7f6' : '#ffffff');
            const stroke = marks ? (marks[i] ? '#2e7d32' : '#c62828') : '#1976d2';
            svg += `<rect x="${x0}" y="${y(i)}" width="${boxW}" height="${boxH}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
                <text x="${x0 + boxW / 2}" y="${y(i) + boxH / 2 + 5}" text-anchor="middle" font-size="13" fill="#263238">${i + 1}. ${byId[id].name}</text>`;
            if (i < 5) {
                const cx = x0 + boxW / 2, y1 = y(i) + boxH, y2 = y(i + 1);
                svg += `<line x1="${cx}" y1="${y1}" x2="${cx}" y2="${y2 - 1}" stroke="#546e7a" stroke-width="1.5" marker-end="url(#ah)"/>`;
                if (trans[i] === 'response') svg += `<text x="${cx + 6}" y="${(y1 + y2) / 2 + 4}" font-size="10" fill="#546e7a">on reply</text>`;
                if (trans[i] === 'branch') {
                    const bx = x0 + boxW + 30, by = y(i) + boxH / 2 + gap / 2, back = Math.max(0, i - 1);
                    svg += `<text x="${cx + 6}" y="${(y1 + y2) / 2 + 4}" font-size="10" fill="#2e7d32" font-weight="bold">strong</text>
                        <line x1="${x0 + boxW}" y1="${y(i) + boxH / 2}" x2="${bx - 1}" y2="${by}" stroke="#e65100" stroke-width="1.5" marker-end="url(#ahr)"/>
                        <text x="${x0 + boxW + 4}" y="${y(i) + boxH / 2 - 5}" font-size="10" fill="#e65100" font-weight="bold">weak</text>
                        <rect x="${bx}" y="${by - 15}" width="90" height="30" rx="15" fill="#fff3e0" stroke="#e65100" stroke-width="1.5"/>
                        <text x="${bx + 45}" y="${by + 4}" text-anchor="middle" font-size="12" fill="#e65100">Coaching</text>
                        <path d="M${bx + 45},${by - 15} L${bx + 45},${y(back) + boxH / 2} L${x0 + boxW + 2},${y(back) + boxH / 2}" fill="none" stroke="#e65100" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ahr)"/>
                        <text x="${bx + 49}" y="${(by - 15 + y(back) + boxH / 2) / 2}" font-size="10" fill="#e65100">retry</text>`;
                }
            }
        });
        diagram.innerHTML = svg + '</svg>';
    }

    function evaluate() {
        const marks = order.map((id, i) => id === STAGES[i].id);
        const correctCount = marks.filter(Boolean).length;
        const evalPos = order.indexOf('evaluate');
        const branchAtEval = evalPos < 5 && trans[evalPos] === 'branch' && order[evalPos + 1] === 'closing';
        const branchCount = trans.filter(t => t === 'branch').length;
        const allLinear = trans.every(t => t === 'auto');
        const objPos = order.indexOf('objection');
        const waitsOnObjection = objPos < 5 && trans[objPos] !== 'auto';

        const notes = [];
        if (correctCount < 6) notes.push(`<strong>${correctCount} of 6 stages</strong> are in a logical position. ${orderHint()}`);
        if (allLinear) notes.push('Your flow is completely linear. Real conversations branch on what the salesperson says, so add a branch where the agent judges the response.');
        else if (!branchAtEval) notes.push('Add a <strong>branch after Response evaluation</strong>: a strong response proceeds to Closing, and a weak one goes to a coaching loop that re-raises the objection.');
        if (branchCount > 1) notes.push('You have more than one branch. Only branch where the agent actually evaluates something, or the flow becomes hard to follow.');
        if (!waitsOnObjection && correctCount === 6) notes.push('Consider making the transition after <strong>Objection raising</strong> wait for the salesperson\'s reply. The agent cannot evaluate a response it never received.');

        const good = correctCount === 6 && branchAtEval && branchCount === 1;
        fb.innerHTML = `<div class="feedback ${good ? 'ok' : 'warn'}">
            Your dialogue flow includes ${order.map(id => byId[id].name).join(' &rarr; ')}.
            The transitions are <strong>${good ? 'logical' : 'in need of refinement'}</strong>.
            ${good ? 'The agent sets context, builds tension, challenges, tests, and branches on performance, so weak responses get coaching instead of a premature close.' : ''}
            ${notes.length ? '<br>' + notes.join('<br>') : ''}
        </div>`;
        drawDiagram(marks);
        fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function orderHint() {
        const p = id => order.indexOf(id);
        if (p('intro') !== 0) return 'The agent must establish the CFO persona and company context before anything else.';
        if (p('closing') !== 5) return 'Closing summarizes the whole conversation, so it has to come last.';
        if (p('insight') < p('challenge')) return 'An insight reframes a challenge. Present the challenge first.';
        if (p('evaluate') < p('objection')) return 'The agent can only evaluate objection handling after it raises an objection.';
        return 'Raise the objection after the insight lands. That is when a real CFO pushes back.';
    }

    function injectStyles() {
        const css = document.createElement('style');
        css.textContent = `
            .dfd-cols { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
            .dfd-col { flex: 1 1 280px; background: white; border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; }
            .dfd-head { font-weight: bold; font-size: 0.9em; margin-bottom: 6px; }
            .dfd-muted { color: var(--muted); font-weight: normal; font-size: 0.85em; }
            .dfd-stage { display: flex; align-items: center; gap: 6px; padding: 4px 6px; border: 1px solid var(--primary); border-radius: 6px; background: var(--panel); cursor: grab; font-size: 0.85em; }
            .dfd-stage.over { background: #e3f2fd; border-width: 2px; }
            .dfd-stage button { padding: 1px 6px; }
            .dfd-n { font-weight: bold; color: var(--primary); width: 16px; }
            .dfd-name { flex: 1; line-height: 1.25; }
            .dfd-trans { display: flex; align-items: center; gap: 6px; margin: 3px 0 3px 18px; }
            .dfd-trans span { color: var(--muted); }
            .dfd-trans select { font-size: 0.8em; padding: 3px 4px; width: auto; flex: 1; }
        `;
        document.head.appendChild(css);
    }

    render();
});
