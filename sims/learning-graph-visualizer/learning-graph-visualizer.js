// Learning Graph Visualizer - read prerequisite relationships in a learning graph
// CANVAS_HEIGHT: 720
// Learners click each arrow in a four-concept learning graph to reveal the
// prerequisite relationship it encodes. Once all arrows are explored, five
// questions about dependencies and learning order unlock.

const APP_HEIGHT = 720;
const SVG_NS = 'http://www.w3.org/2000/svg';

const NODES = {
    A: { label: ['Storytelling', 'Fundamentals'], x: 90, y: 120, color: '#2e7d32' },
    B: { label: ['Challenger', 'Methodology'], x: 300, y: 120, color: '#1976d2' },
    C: { label: ['Story', 'Delivery'], x: 510, y: 50, color: '#7b1fa2' },
    D: { label: ['Story', 'Analytics'], x: 510, y: 190, color: '#00897b' }
};
const NAME = k => NODES[k].label.join(' ');
const EDGES = [['A', 'B'], ['B', 'C'], ['B', 'D']];

const QUESTIONS = [
    {
        q: '1. Which concept is the direct prerequisite for Story Delivery?',
        options: ['Storytelling Fundamentals', 'Challenger Methodology', 'Story Analytics'],
        correct: 'Challenger Methodology',
        explain: 'The arrow into Story Delivery comes from Challenger Methodology. (Storytelling Fundamentals is an indirect prerequisite, two steps back.)'
    },
    {
        q: '2. Which concept does Challenger Methodology depend on?',
        options: ['Storytelling Fundamentals', 'Story Delivery', 'Story Analytics', 'Nothing'],
        correct: 'Storytelling Fundamentals',
        explain: 'The only arrow pointing into Challenger Methodology starts at Storytelling Fundamentals.'
    },
    {
        q: '3. Can a student learn Story Analytics before Challenger Methodology?',
        options: ['Yes', 'No'],
        correct: 'No',
        explain: 'No. Challenger Methodology is a prerequisite for Story Analytics, so it must come first.'
    },
    {
        q: '4. Which is a valid learning order?',
        options: [
            'Fundamentals → Methodology → Delivery → Analytics',
            'Methodology → Fundamentals → Delivery → Analytics',
            'Fundamentals → Delivery → Methodology → Analytics',
            'Analytics → Methodology → Fundamentals → Delivery'
        ],
        correct: 'Fundamentals → Methodology → Delivery → Analytics',
        explain: 'Every concept must come after all of its prerequisites: A → B, then C and D.'
    },
    {
        q: '5. Story Delivery and Story Analytics can be learned in either order.',
        options: ['True', 'False'],
        correct: 'True',
        explain: 'True. Neither depends on the other; both only need Challenger Methodology. Learning graphs branch, so paths do not have to be a single straight line.'
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

    app.innerHTML = `
        <h2>Learning Graph Visualizer</h2>
        <p class="subtitle">Each arrow points from a prerequisite to the concept that depends on it. Click every arrow to reveal its meaning.</p>
        <div class="graph-wrap" id="graph"></div>
        <div class="feedback warn" id="info">Click an arrow in the graph. <strong>Explored: 0 of ${EDGES.length}</strong></div>
        <div id="questions"></div>
    `;
    const info = app.querySelector('#info');
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 600 240');
    app.querySelector('#graph').appendChild(svg);

    const el = (tag, attrs, parent) => {
        const e = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
        (parent || svg).appendChild(e);
        return e;
    };

    const defs = el('defs', {});
    [['arrow', '#78909c'], ['arrow-on', '#ffb300']].forEach(([id, c]) => {
        const m = el('marker', { id, viewBox: '0 0 10 10', refX: 10, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto' }, defs);
        el('path', { d: 'M0,0 L10,5 L0,10 z', fill: c }, m);
    });

    const W = 62, H = 28; // node half-width and half-height
    const edgeShapes = {};

    function boxEdgePoint(n, tx, ty) {
        // point on the node's border along the line toward (tx, ty)
        const dx = tx - n.x, dy = ty - n.y;
        const s = Math.min(W / Math.abs(dx || 1e-6), H / Math.abs(dy || 1e-6));
        return [n.x + dx * s, n.y + dy * s];
    }

    EDGES.forEach(([s, t]) => {
        const a = NODES[s], b = NODES[t];
        const [x1, y1] = boxEdgePoint(a, b.x, b.y);
        const [x2, y2] = boxEdgePoint(b, a.x, a.y);
        const g = el('g', { class: 'node' });
        const line = el('line', { x1, y1, x2, y2, stroke: '#78909c', 'stroke-width': 4, 'marker-end': 'url(#arrow)' }, g);
        el('line', { x1, y1, x2, y2, class: 'edge-hit' }, g);
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const badge = el('circle', { cx: mx, cy: my, r: 12, fill: 'white', stroke: '#78909c', 'stroke-width': 2 }, g);
        const q = el('text', { x: mx, y: my + 5, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 'bold', fill: '#455a64' }, g);
        q.textContent = '?';
        g.addEventListener('click', () => select(s + t));
        edgeShapes[s + t] = { line, badge, q, s, t };
    });

    Object.values(NODES).forEach(n => {
        el('rect', { x: n.x - W, y: n.y - H, width: W * 2, height: H * 2, rx: 10, fill: n.color });
        n.label.forEach((line, i) => {
            const t = el('text', { x: n.x, y: n.y - 3 + i * 18, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 'bold', fill: 'white' });
            t.textContent = line;
        });
    });

    function select(key) {
        selected = key;
        explored.add(key);
        Object.entries(edgeShapes).forEach(([k, e]) => {
            const on = k === selected;
            e.line.setAttribute('stroke', on ? '#ffb300' : '#78909c');
            e.line.setAttribute('marker-end', on ? 'url(#arrow-on)' : 'url(#arrow)');
            e.badge.setAttribute('stroke', on ? '#ffb300' : '#78909c');
            if (explored.has(k)) e.q.textContent = '\u2713';
        });
        const e = edgeShapes[key];
        info.className = 'feedback ok';
        info.innerHTML = `This edge shows that <strong>${NAME(e.s)}</strong> is a prerequisite for <strong>${NAME(e.t)}</strong>: learn ${NAME(e.s)} first.<br><strong>Explored: ${explored.size} of ${EDGES.length}</strong>${explored.size === EDGES.length ? ' &mdash; questions unlocked below &darr;' : ''}`;
        if (explored.size === EDGES.length && !app.querySelector('#check')) renderQuestions();
    }

    function renderQuestions() {
        app.querySelector('#questions').innerHTML = '<div class="q-grid">' + QUESTIONS.map((q, i) => `
            <div class="card" data-q="${i}">
                <h3>${q.q}</h3>
                <div class="choice-row">${q.options.map(o => `
                    <label style="flex:0 0 auto;font-size:0.92em;cursor:pointer;">
                        <input type="radio" name="q${i}" value="${o}"> ${o}
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
            const chosen = card.querySelector('input:checked');
            const ok = chosen && chosen.value === q.correct;
            if (ok) score++;
            card.querySelector('.q-fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}" style="margin:8px 0 0 0;">${ok ? '<strong>Correct.</strong> ' : (chosen ? '<strong>Not quite.</strong> ' : '<strong>No answer selected.</strong> ')}${q.explain}</div>`;
        });
        app.querySelector('#score').innerHTML = `
            <div class="feedback ${score === QUESTIONS.length ? 'ok' : 'warn'}">
                You correctly identified <strong>${score} of ${QUESTIONS.length}</strong> relationships. Learning graphs ensure students learn concepts in the optimal order.
                <br><strong>Learning path:</strong> Storytelling Fundamentals &rarr; Challenger Methodology &rarr; { Story Delivery, Story Analytics } in either order.
                Storytelling Fundamentals is <em>foundational</em>: it has no prerequisites and everything else builds on it.
                ${score < QUESTIONS.length ? '<br><em>Adjust your answers and select Check Answers again.</em>' : ''}
            </div>`;
        app.scrollTop = app.scrollHeight;
    }
});
