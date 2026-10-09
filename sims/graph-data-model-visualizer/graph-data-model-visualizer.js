// Graph Data Model Visualizer - explore nodes, edges, and properties
// CANVAS_HEIGHT: 720
// Learners click each element of a small business graph to reveal whether it
// is a node or an edge and what properties it carries. Once every element has
// been explored, five identification questions unlock.

const APP_HEIGHT = 720;
const SVG_NS = 'http://www.w3.org/2000/svg';

const NODES = [
    { id: 'customer', label: 'Customer', x: 85, y: 75, color: '#1976d2', props: { name: 'Acme Corp', industry: 'Manufacturing' } },
    { id: 'order', label: 'Order', x: 300, y: 75, color: '#7b1fa2', props: { date: '2024-01-15', quantity: 50 } },
    { id: 'product', label: 'Product', x: 515, y: 75, color: '#00897b', props: { name: 'Widget X', price: '$100' } }
];

const EDGES = [
    { id: 'placed', label: 'placed', from: 'customer', to: 'order', name: 'Edge 1', props: { value: '$5,000' } },
    { id: 'contains', label: 'contains', from: 'order', to: 'product', name: 'Edge 2', props: { quantity: 50 } }
];

const QUESTIONS = [
    {
        q: '1. Which elements are nodes? (select all that apply)', type: 'check',
        options: ['Customer', 'Order', 'Product', 'placed', 'contains'],
        correct: ['Customer', 'Order', 'Product'],
        explain: 'Customer, Order, and Product are entities, so they are nodes.'
    },
    {
        q: '2. Which elements are edges? (select all that apply)', type: 'check',
        options: ['Customer', 'Order', 'Product', 'placed', 'contains'],
        correct: ['placed', 'contains'],
        explain: '"placed" and "contains" connect two nodes, so they are edges (relationships).'
    },
    {
        q: '3. What properties does the Customer node have? (select all that apply)', type: 'check',
        options: ['name', 'industry', 'price', 'date', 'value'],
        correct: ['name', 'industry'],
        explain: 'The Customer node stores name: "Acme Corp" and industry: "Manufacturing".'
    },
    {
        q: '4. What relationship does Edge 1 represent?', type: 'radio',
        options: ['Customer placed an Order', 'Order contains a Product', 'Product placed an Order', 'Customer is a Product'],
        correct: ['Customer placed an Order'],
        explain: 'Edge 1 runs from Customer to Order with the label "placed": the customer placed the order.'
    },
    {
        q: '5. Which property is stored on an edge rather than a node?', type: 'radio',
        options: ['value: $5,000', 'name: Acme Corp', 'price: $100', 'date: 2024-01-15'],
        correct: ['value: $5,000'],
        explain: 'value: $5,000 lives on the "placed" edge. Edges can carry properties too, which relational tables cannot do without an extra join table.'
    }
];

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    const explored = new Set();
    let selected = null;
    const total = NODES.length + EDGES.length;

    app.innerHTML = `
        <h2>Graph Data Model Visualizer</h2>
        <p class="subtitle">Click every node and edge to reveal what it is and what it stores. The questions unlock once all five are explored.</p>
        <div class="graph-wrap" id="graph"></div>
        <div class="feedback warn" id="info">Click an element in the graph to inspect it. <strong>Explored: 0 of ${total}</strong></div>
        <div id="questions"></div>
    `;
    const info = app.querySelector('#info');
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 600 150');
    app.querySelector('#graph').appendChild(svg);

    const el = (tag, attrs, parent) => {
        const e = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
        (parent || svg).appendChild(e);
        return e;
    };

    const defs = el('defs', {});
    const marker = el('marker', { id: 'arrow', viewBox: '0 0 10 10', refX: 10, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto' }, defs);
    el('path', { d: 'M0,0 L10,5 L0,10 z', fill: '#455a64' }, marker);

    const shapes = {};
    const nodeById = id => NODES.find(n => n.id === id);
    const fmtProps = p => Object.entries(p).map(([k, v]) => `${k}: ${typeof v === 'number' ? v : '"' + v + '"'}`).join(', ');

    EDGES.forEach(e => {
        const a = nodeById(e.from), b = nodeById(e.to);
        const x1 = a.x + 56, x2 = b.x - 56;
        const g = el('g', { class: 'node' });
        const line = el('line', { x1, y1: a.y, x2, y2: b.y, stroke: '#455a64', 'stroke-width': 3, 'marker-end': 'url(#arrow)' }, g);
        el('line', { x1, y1: a.y, x2, y2: b.y, class: 'edge-hit' }, g);
        const lbl = el('rect', { x: (x1 + x2) / 2 - 42, y: a.y - 36, width: 84, height: 24, rx: 12, fill: 'white', stroke: '#455a64', 'stroke-width': 1.5 }, g);
        const t = el('text', { x: (x1 + x2) / 2, y: a.y - 19, 'text-anchor': 'middle', 'font-size': 14, fill: '#263238' }, g);
        t.textContent = e.label;
        const sub = el('text', { x: (x1 + x2) / 2, y: a.y + 24, 'text-anchor': 'middle', 'font-size': 12, fill: '#607d8b' }, g);
        sub.textContent = e.name;
        g.addEventListener('click', () => select(e, 'edge'));
        shapes[e.id] = { main: line, badge: lbl, kind: 'edge' };
    });

    NODES.forEach(n => {
        const g = el('g', { class: 'node' });
        const r = el('rect', { x: n.x - 56, y: n.y - 30, width: 112, height: 60, rx: 12, fill: n.color, stroke: n.color }, g);
        const t = el('text', { x: n.x, y: n.y + 6, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 'bold', fill: 'white' }, g);
        t.textContent = n.label;
        const hint = el('text', { x: n.x, y: n.y + 52, 'text-anchor': 'middle', 'font-size': 12, fill: '#607d8b' }, g);
        hint.textContent = 'click me';
        g.addEventListener('click', () => select(n, 'node'));
        shapes[n.id] = { main: r, hint: hint, kind: 'node' };
    });

    function select(item, kind) {
        selected = item.id;
        explored.add(item.id);
        Object.entries(shapes).forEach(([id, s]) => {
            const on = id === selected;
            if (s.kind === 'node') {
                s.main.setAttribute('stroke', on ? '#ffb300' : nodeById(id).color);
                s.main.setAttribute('stroke-width', on ? 5 : 2);
                if (explored.has(id)) s.hint.textContent = '\u2713 explored';
            } else {
                s.main.setAttribute('stroke', on ? '#ffb300' : '#455a64');
                s.badge.setAttribute('stroke', on ? '#ffb300' : '#455a64');
                s.badge.setAttribute('stroke-width', on ? 3 : 1.5);
            }
        });
        let msg;
        if (kind === 'node') {
            msg = `<strong>${item.label}</strong> is a <strong>node</strong> (an entity) with properties: <code>{${fmtProps(item.props)}}</code>.`;
        } else {
            msg = `<strong>${item.name}: "${item.label}"</strong> is an <strong>edge</strong> (a relationship) from ${nodeById(item.from).label} to ${nodeById(item.to).label} with properties: <code>{${fmtProps(item.props)}}</code>.`;
        }
        info.className = 'feedback ok';
        info.innerHTML = `${msg}<br><strong>Explored: ${explored.size} of ${total}</strong>${explored.size === total ? ' &mdash; questions unlocked below &darr;' : ''}`;
        if (explored.size === total && !app.querySelector('#check')) renderQuestions();
    }

    function renderQuestions() {
        const qDiv = app.querySelector('#questions');
        qDiv.innerHTML = '<div class="q-grid">' + QUESTIONS.map((q, i) => `
            <div class="card" data-q="${i}">
                <h3>${q.q}</h3>
                <div class="choice-row">${q.options.map(o => `
                    <label style="flex:0 0 auto;font-size:0.92em;cursor:pointer;">
                        <input type="${q.type === 'check' ? 'checkbox' : 'radio'}" name="q${i}" value="${o}"> ${o}
                    </label>`).join('')}
                </div>
                <div class="q-fb"></div>
            </div>`).join('') + `</div>
            <div class="btn-row"><button id="check">Check Answers</button></div>
            <div id="score"></div>`;
        app.querySelector('#check').addEventListener('click', checkAnswers);
    }

    function checkAnswers() {
        let score = 0;
        QUESTIONS.forEach((q, i) => {
            const card = app.querySelector(`[data-q="${i}"]`);
            const chosen = [...card.querySelectorAll('input:checked')].map(x => x.value).sort();
            const ok = chosen.join('|') === [...q.correct].sort().join('|');
            if (ok) score++;
            card.querySelector('.q-fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}" style="margin:8px 0 0 0;">${ok ? '<strong>Correct.</strong> ' : '<strong>Not quite.</strong> '}${q.explain}</div>`;
        });
        app.querySelector('#score').innerHTML = `
            <div class="feedback ${score === QUESTIONS.length ? 'ok' : 'warn'}">
                You correctly identified <strong>${score} of ${QUESTIONS.length}</strong>. Graph data models use <strong>nodes</strong> for entities and
                <strong>edges</strong> for relationships, and both can carry properties.
                <table class="summary" style="margin-top:8px;">
                    <tr><th>Element</th><th>Type</th><th>Properties</th></tr>
                    ${NODES.map(n => `<tr><td>${n.label}</td><td>Node</td><td><code>{${fmtProps(n.props)}}</code></td></tr>`).join('')}
                    ${EDGES.map(e => `<tr><td>${e.name}: ${e.label}</td><td>Edge (${nodeById(e.from).label} &rarr; ${nodeById(e.to).label})</td><td><code>{${fmtProps(e.props)}}</code></td></tr>`).join('')}
                </table>
                ${score < QUESTIONS.length ? '<em>Adjust your answers and select Check Answers again.</em>' : ''}
            </div>`;
        app.scrollTop = app.scrollHeight;
    }
});
