// Graph Traversal Explorer - run neighbor, 2-hop, and shortest-path traversals
// CANVAS_HEIGHT: 700
// Learners click a starting node, choose a traversal pattern, predict the
// result, then reveal it. Each hop is compared to the JOIN a relational
// database would need for the same question.

const APP_HEIGHT = 700;
const SVG_NS = 'http://www.w3.org/2000/svg';

const POS = {
    A: [70, 150], B: [190, 55], C: [190, 245], D: [310, 150], E: [420, 70], F: [480, 220]
};
const EDGES = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F'], ['A', 'C'], ['B', 'D']];
const NAMES = Object.keys(POS);

const PATTERNS = {
    neighbors: 'Neighbors (1 hop)',
    two: 'Neighbors of neighbors (2 hops)',
    path: 'Shortest path to...'
};

const ADJ = {};
NAMES.forEach(n => { ADJ[n] = []; });
EDGES.forEach(([a, b]) => { ADJ[a].push(b); ADJ[b].push(a); });
NAMES.forEach(n => ADJ[n].sort());

function bfs(start) {
    const dist = { [start]: 0 };
    const queue = [start];
    while (queue.length) {
        const u = queue.shift();
        ADJ[u].forEach(v => { if (!(v in dist)) { dist[v] = dist[u] + 1; queue.push(v); } });
    }
    return dist;
}

function allShortestPaths(start, target) {
    const dist = bfs(start);
    const paths = [];
    (function walk(path) {
        const u = path[path.length - 1];
        if (u === target) { paths.push(path.slice()); return; }
        ADJ[u].forEach(v => { if (dist[v] === dist[u] + 1 && dist[v] <= dist[target]) { path.push(v); walk(path); path.pop(); } });
    })([start]);
    return paths;
}

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    let start = null, pattern = null, phase = 'setup';
    let predicted = new Set();
    let reveal = null; // { level: {node: 1|2}, pathEdges: Set, path: [] }
    const log = [];
    const usedPatterns = new Set();

    app.innerHTML = `
        <h2>Graph Traversal Explorer</h2>
        <p class="subtitle">Click a starting node, pick a pattern, predict the result, then reveal it.</p>
        <div class="two-col" style="margin-bottom:10px;">
        <div class="graph-wrap" id="graph" style="flex:2 1 380px;margin-bottom:0;"></div>
        <div class="side-panel">
        <div class="field full" style="margin-bottom:8px;">
            <label>Traversal Pattern</label>
            <div class="choice-row" id="patterns">
                ${Object.entries(PATTERNS).map(([k, v]) => `<button type="button" class="choice" data-p="${k}">${v}</button>`).join('')}
            </div>
        </div>
        <div class="field-row" style="flex-direction:column;gap:8px;">
            <div class="field" id="target-field" style="display:none;flex:0 0 auto;">
                <label for="target">Target node</label>
                <select id="target"><option value="">-- choose --</option>${NAMES.map(n => `<option>${n}</option>`).join('')}</select>
            </div>
            <div class="field" id="hops-field" style="display:none;flex:0 0 auto;">
                <label for="hops">Your prediction: how many hops?</label>
                <select id="hops"><option value="">-- choose --</option>${[1, 2, 3, 4, 5].map(n => `<option>${n}</option>`).join('')}</select>
            </div>
        </div>
        <div class="btn-row">
            <button id="go" disabled>Predict</button>
            <button id="reset" class="secondary">Reset</button>
        </div>
        </div>
        </div>
        <div id="feedback"><div class="feedback warn">Step 1: click a node in the graph to choose the starting point.</div></div>
        <div id="log"></div>
    `;

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 550 300');
    app.querySelector('#graph').appendChild(svg);
    const go = app.querySelector('#go');
    const fb = app.querySelector('#feedback');
    const targetSel = app.querySelector('#target');
    const hopsSel = app.querySelector('#hops');

    const el = (tag, attrs, parent) => {
        const e = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
        (parent || svg).appendChild(e);
        return e;
    };

    function nodeFill(n) {
        if (n === start) return '#ffb300';
        if (reveal && reveal.level[n] === 1) return '#1976d2';
        if (reveal && reveal.level[n] === 2) return '#7b1fa2';
        if (reveal && reveal.path.includes(n)) return '#ef6c00';
        return 'white';
    }

    function draw() {
        svg.innerHTML = '';
        EDGES.forEach(([a, b]) => {
            const key = [a, b].sort().join('');
            const on = reveal && reveal.pathEdges.has(key);
            el('line', { x1: POS[a][0], y1: POS[a][1], x2: POS[b][0], y2: POS[b][1], stroke: on ? '#ef6c00' : '#90a4ae', 'stroke-width': on ? 7 : 3 });
        });
        NAMES.forEach(n => {
            const [x, y] = POS[n];
            const g = el('g', { class: 'node' });
            const fill = nodeFill(n);
            if (predicted.has(n)) el('circle', { cx: x, cy: y, r: 33, fill: 'none', stroke: '#2e7d32', 'stroke-width': 4, 'stroke-dasharray': '6 4' }, g);
            el('circle', { cx: x, cy: y, r: 25, fill: fill, stroke: '#37474f' }, g);
            const t = el('text', { x: x, y: y + 7, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 'bold', fill: fill === 'white' ? '#263238' : 'white' }, g);
            t.textContent = n;
            g.addEventListener('click', () => clickNode(n));
        });
        const legend = [['#ffb300', 'Start'], ['#1976d2', '1 hop'], ['#7b1fa2', '2 hops'], ['#ef6c00', 'Path']];
        legend.forEach(([c, label], i) => {
            el('rect', { x: 8 + i * 100, y: 280, width: 14, height: 14, fill: c });
            const t = el('text', { x: 27 + i * 100, y: 293, 'font-size': 15, fill: '#455a64' });
            t.textContent = label;
        });
        el('circle', { cx: 415, cy: 287, r: 7, fill: 'none', stroke: '#2e7d32', 'stroke-width': 2.5, 'stroke-dasharray': '3 2' });
        const pt = el('text', { x: 427, y: 293, 'font-size': 15, fill: '#455a64' });
        pt.textContent = 'Your prediction';
    }

    function setMsg(cls, html) { fb.innerHTML = `<div class="feedback ${cls}">${html}</div>`; }

    function updateControls() {
        app.querySelectorAll('#patterns .choice').forEach(b => b.classList.toggle('selected', b.dataset.p === pattern));
        app.querySelector('#target-field').style.display = pattern === 'path' ? '' : 'none';
        app.querySelector('#hops-field').style.display = pattern === 'path' && phase === 'predict' ? '' : 'none';
        const ready = start && pattern && (pattern !== 'path' || (targetSel.value && targetSel.value !== start));
        if (phase === 'setup') { go.textContent = 'Predict'; go.disabled = !ready; }
        else if (phase === 'predict') { go.textContent = 'Reveal'; go.disabled = pattern === 'path' ? !hopsSel.value : false; }
        else { go.textContent = 'Try Another'; go.disabled = false; }
    }

    function clickNode(n) {
        if (phase === 'predict' && pattern !== 'path') {
            if (n === start) return;
            predicted.has(n) ? predicted.delete(n) : predicted.add(n);
        } else if (phase !== 'predict') {
            start = n;
            phase = 'setup';
            reveal = null;
            predicted = new Set();
            setMsg('warn', `Start node: <strong>${n}</strong>. Step 2: choose a traversal pattern${pattern ? ' (or keep the current one)' : ''}, then select <strong>Predict</strong>.`);
        }
        draw();
        updateControls();
    }

    app.querySelectorAll('#patterns .choice').forEach(b => b.addEventListener('click', () => {
        if (phase === 'predict') return;
        pattern = b.dataset.p;
        phase = 'setup';
        reveal = null;
        predicted = new Set();
        if (!start) setMsg('warn', 'Click a node in the graph to choose the starting point.');
        else if (pattern === 'path') setMsg('warn', `Choose a target node, then select <strong>Predict</strong>.`);
        else setMsg('warn', `Select <strong>Predict</strong> to make your prediction.`);
        draw();
        updateControls();
    }));
    targetSel.addEventListener('change', updateControls);
    hopsSel.addEventListener('change', updateControls);

    go.addEventListener('click', () => {
        if (phase === 'setup') {
            phase = 'predict';
            hopsSel.value = '';
            if (pattern === 'path') setMsg('warn', `Predict: how many hops is the shortest path from <strong>${start}</strong> to <strong>${targetSel.value}</strong>? Trace it with your eyes, choose a number, then select <strong>Reveal</strong>.`);
            else setMsg('warn', `Predict: click every node you expect the <strong>${PATTERNS[pattern]}</strong> traversal from <strong>${start}</strong> to find (dashed green rings), then select <strong>Reveal</strong>.`);
        } else if (phase === 'predict') {
            doReveal();
        } else {
            phase = 'setup';
            reveal = null;
            predicted = new Set();
            setMsg('warn', 'Click a new starting node or choose a different pattern.');
        }
        draw();
        updateControls();
    });

    app.querySelector('#reset').addEventListener('click', () => {
        start = null; pattern = null; phase = 'setup'; reveal = null; predicted = new Set();
        targetSel.value = ''; log.length = 0; usedPatterns.clear();
        app.querySelector('#log').innerHTML = '';
        setMsg('warn', 'Step 1: click a node in the graph to choose the starting point.');
        draw();
        updateControls();
    });

    function doReveal() {
        const dist = bfs(start);
        reveal = { level: {}, pathEdges: new Set(), path: [] };
        let html, ok, resultText, hops;
        if (pattern === 'path') {
            const target = targetSel.value;
            const paths = allShortestPaths(start, target);
            const p = paths[0];
            hops = p.length - 1;
            reveal.path = p;
            for (let i = 0; i < p.length - 1; i++) reveal.pathEdges.add([p[i], p[i + 1]].sort().join(''));
            ok = Number(hopsSel.value) === hops;
            resultText = p.join('&ndash;');
            const ties = paths.length > 1 ? ` There ${paths.length === 2 ? 'is' : 'are'} also ${paths.length - 1} other path${paths.length > 2 ? 's' : ''} of the same length: ${paths.slice(1).map(x => x.join('&ndash;')).join(', ')}.` : '';
            html = `Starting from <strong>${start}</strong>, shortest path traversal to <strong>${target}</strong> found: <strong>${resultText}</strong>. This took <strong>${hops} hop${hops > 1 ? 's' : ''}</strong>.${ties}`;
            html += `<br>Your prediction: ${hopsSel.value} hop${hopsSel.value === '1' ? '' : 's'} ${ok ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>'}`;
        } else {
            const maxHop = pattern === 'neighbors' ? 1 : 2;
            const found = NAMES.filter(n => n !== start && dist[n] <= maxHop);
            found.forEach(n => { reveal.level[n] = dist[n]; });
            hops = maxHop;
            ok = found.length === predicted.size && found.every(n => predicted.has(n));
            resultText = found.map(n => `${n}${maxHop === 2 ? ` (${dist[n]} hop${dist[n] > 1 ? 's' : ''})` : ''}`).join(', ');
            const missed = found.filter(n => !predicted.has(n));
            const extra = [...predicted].filter(n => !found.includes(n));
            html = `Starting from <strong>${start}</strong>, the <strong>${PATTERNS[pattern]}</strong> traversal found: <strong>${resultText}</strong>. This took up to <strong>${hops} hop${hops > 1 ? 's' : ''}</strong>.`;
            html += `<br>Your prediction ${ok ? '<span class="mark-ok">&#10003; matched exactly</span>' : '<span class="mark-bad">&#10007;</span>'}`;
            if (missed.length) html += ` &mdash; missed: ${missed.join(', ')}`;
            if (extra.length) html += ` &mdash; not reachable in ${maxHop} hop${maxHop > 1 ? 's' : ''}: ${extra.join(', ')}`;
        }
        html += `<br><em>A relational database would need about ${hops} JOIN${hops > 1 ? 's' : ''} for this; the graph simply follows ${hops} edge${hops > 1 ? 's' : ''}.</em>`;
        phase = 'revealed';
        setMsg(ok ? 'ok' : 'bad', html);
        log.push({ start, pattern: pattern === 'path' ? `Shortest path to ${targetSel.value}` : PATTERNS[pattern], result: resultText, ok });
        usedPatterns.add(pattern);
        renderLog();
    }

    function renderLog() {
        const correct = log.filter(r => r.ok).length;
        let html = `<table class="summary"><tr><th>#</th><th>Start</th><th>Pattern</th><th>Result</th><th>Prediction</th></tr>` +
            log.map((r, i) => `<tr><td>${i + 1}</td><td>${r.start}</td><td>${r.pattern}</td><td>${r.result}</td><td>${r.ok ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>'}</td></tr>`).join('') +
            '</table>';
        if (usedPatterns.size === 3) {
            html = `<div class="feedback warn" style="margin-top:0;"><strong>Summary:</strong> you have tried all three patterns (${correct} of ${log.length} predictions correct). Different patterns answer different questions from the same start node. Graph traversals find connected nodes by following edges directly, unlike JOIN operations in relational databases, so each extra hop stays fast even as the graph grows.</div>` + html;
        } else {
            html = `<p class="subtitle" style="text-align:left;">Patterns tried: ${usedPatterns.size} of 3. Try all three to unlock the summary.</p>` + html;
        }
        app.querySelector('#log').innerHTML = html;
    }

    draw();
    updateControls();
});
