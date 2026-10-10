// Story Arc Builder
// CANVAS_HEIGHT: 770
// Learner sequences four story elements of an IoT sales story into
// Setup, Rising Action, Climax, Resolution. A tension curve appears once the arc is correct.
// Cards can be dragged, or clicked and then a slot clicked (touch and keyboard friendly).

const slotNames = ['Setup', 'Rising Action', 'Climax', 'Resolution'];
const slotHints = [
    'Context and stakes',
    'Obstacles build tension',
    'Peak decision point',
    'Outcome and proof'
];

// correctSlot = index into slotNames
const elements = [
    { id: 'a', correctSlot: 3, text: 'After implementation, the company reduced downtime by 60% and improved product quality by 25%.' },
    { id: 'b', correctSlot: 0, text: "The company's legacy systems were causing frequent unplanned downtime, costing $2M annually in lost production." },
    { id: 'c', correctSlot: 2, text: 'The CTO approved a 3-month pilot after seeing a competitor gain market share through better reliability.' },
    { id: 'd', correctSlot: 1, text: 'The pilot required retraining staff, integrating with existing systems, and managing stakeholder resistance.' }
];

const whyText = [
    'Setup establishes the stakes: $2M a year in lost production.',
    'Rising action piles on obstacles: retraining, integration, resistance.',
    'The climax is the peak decision: the CTO commits under competitive pressure.',
    'Resolution delivers the payoff with proof: 60% less downtime, 25% better quality.'
];

// placement[id] = slot index, or -1 when in the pool
const placement = {};
let order = [];
let picked = null;
let attempts = 0;
let solved = false;
let poolEl, slotEls, checkBtn, statusEl, feedbackEl, curveEl;

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function reset() {
    order = shuffle(elements);
    elements.forEach(e => placement[e.id] = -1);
    picked = null;
    attempts = 0;
    solved = false;
    feedbackEl.className = '';
    feedbackEl.textContent = '';
    drawCurve(false);
    render();
}

function makeCard(e) {
    const c = document.createElement('div');
    c.className = 'card';
    c.textContent = e.text;
    c.draggable = !solved;
    c.tabIndex = 0;
    c.dataset.id = e.id;
    if (picked === e.id) c.classList.add('picked');
    c.addEventListener('dragstart', ev => {
        ev.dataTransfer.setData('text/plain', e.id);
        c.classList.add('dragging');
    });
    c.addEventListener('dragend', () => c.classList.remove('dragging'));
    c.addEventListener('click', ev => {
        ev.stopPropagation();
        if (solved) return;
        picked = picked === e.id ? null : e.id;
        render();
    });
    c.addEventListener('keydown', ev => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); c.click(); }
    });
    return c;
}

function moveTo(id, slot) {
    if (solved) return;
    // A slot holds one card; bump any occupant back to the pool
    if (slot >= 0) {
        for (const k in placement) if (placement[k] === slot) placement[k] = -1;
    }
    placement[id] = slot;
    picked = null;
    feedbackEl.className = '';
    feedbackEl.textContent = '';
    render();
}

function wireDrop(target, slot) {
    target.addEventListener('dragover', ev => { ev.preventDefault(); target.classList.add('over'); });
    target.addEventListener('dragleave', () => target.classList.remove('over'));
    target.addEventListener('drop', ev => {
        ev.preventDefault();
        target.classList.remove('over');
        const id = ev.dataTransfer.getData('text/plain');
        if (id) moveTo(id, slot);
    });
    target.addEventListener('click', () => { if (picked) moveTo(picked, slot); });
}

function render() {
    poolEl.innerHTML = '';
    const inPool = order.filter(e => placement[e.id] === -1);
    inPool.forEach(e => poolEl.appendChild(makeCard(e)));
    if (!inPool.length) {
        const p = document.createElement('div');
        p.className = 'pool-empty';
        p.textContent = 'All elements placed. Drag a card back here to remove it from the arc.';
        poolEl.appendChild(p);
    }

    slotEls.forEach((s, i) => {
        s.querySelectorAll('.card, .slot-hint').forEach(n => n.remove());
        const e = elements.find(x => placement[x.id] === i);
        if (e) {
            const c = makeCard(e);
            if (solved) c.classList.add('right');
            s.appendChild(c);
        } else {
            const h = document.createElement('div');
            h.className = 'slot-hint';
            h.textContent = picked ? 'Click to place here' : slotHints[i];
            s.appendChild(h);
        }
    });

    const placed = elements.filter(e => placement[e.id] >= 0).length;
    checkBtn.disabled = placed < 4 || solved;
    statusEl.textContent = solved
        ? `Solved in ${attempts} attempt${attempts === 1 ? '' : 's'}.`
        : `${placed} of 4 placed${picked ? ' - now click a slot' : ''}`;
}

function check() {
    attempts++;
    const wrongIds = elements.filter(e => placement[e.id] !== e.correctSlot).map(e => e.id);
    if (!wrongIds.length) {
        solved = true;
        feedbackEl.className = 'feedback ok';
        feedbackEl.innerHTML = '<strong>Correct!</strong> Your story arc builds tension effectively. ' +
            "Here's the tension curve showing how engagement rises through the arc.<br>" + whyText.join(' ');
        drawCurve(true);
    } else {
        feedbackEl.className = 'feedback bad';
        feedbackEl.innerHTML = '<strong>Not quite.</strong> The story arc should build tension, not resolve it too early. ' +
            `${wrongIds.length} of 4 elements are in the wrong place (outlined in red). Try rearranging them to create better narrative flow.`;
    }
    render();
    if (!solved) {
        slotEls.forEach(s => {
            const c = s.querySelector('.card');
            if (c && wrongIds.includes(c.dataset.id)) c.classList.add('wrong');
        });
    }
}

function drawCurve(show) {
    const W = 760, H = 170, L = 40, B = 140, T = 20, Rt = W - 20;
    const xs = slotNames.map((_, i) => L + (Rt - L) * (i + 0.5) / 4);
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tension curve across the story arc">
        <line class="axis" x1="${L}" y1="${B}" x2="${Rt}" y2="${B}"/>
        <line class="axis" x1="${L}" y1="${B}" x2="${L}" y2="${T}"/>
        <text class="axis-label" x="${L - 12}" y="${(B + T) / 2}" text-anchor="middle" transform="rotate(-90 ${L - 12} ${(B + T) / 2})">Tension</text>`;
    if (!show) {
        svg += `<text class="curve-placeholder" x="${W / 2}" y="${(B + T) / 2 + 6}">The tension curve appears when your arc is correct.</text>`;
    } else {
        // Tension rises from setup to the climax peak, then releases in the resolution
        const ys = [B - 30, B - 72, T + 8, B - 38];
        const pts = [[L, B - 18], ...xs.map((x, i) => [x, ys[i]]), [Rt, B - 30]];
        let d = `M ${pts[0][0]} ${pts[0][1]}`;
        for (let i = 1; i < pts.length; i++) {
            const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
            const mx = (x0 + x1) / 2;
            d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
        }
        svg += `<path class="tension-fill" d="${d} L ${Rt} ${B} L ${L} ${B} Z"/>`;
        svg += `<path class="tension" d="${d}"/>`;
        const colors = ['#546e7a', '#f9a825', '#e53935', '#43a047'];
        xs.forEach((x, i) => {
            svg += `<circle cx="${x}" cy="${ys[i]}" r="6" fill="${colors[i]}" stroke="white" stroke-width="2"/>`;
            svg += `<text class="phase-label" x="${x}" y="${B + 18}" fill="${colors[i]}">${slotNames[i]}</text>`;
        });
        svg += `<text class="axis-label" x="${xs[2]}" y="${T + 2}" text-anchor="middle" dy="-4">peak</text>`;
    }
    svg += '</svg>';
    curveEl.innerHTML = svg;
}

document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    main.innerHTML = `
        <h2>Story Arc Builder</h2>
        <div class="scenario"><strong>Scenario:</strong> You're telling a story about a manufacturing company that adopted
        your IoT platform. Arrange these story elements in the correct arc sequence. Drag each card into a slot, or click a card and then click a slot.</div>
        <div class="section-label">Story elements</div>
        <div class="pool" id="pool"></div>
        <div class="section-label">Your story arc</div>
        <div class="slots" id="slots"></div>
        <div class="controls">
            <button id="check">Check My Arc</button>
            <button id="reset" class="secondary">Shuffle and Reset</button>
            <span class="status" id="status"></span>
        </div>
        <div id="feedback"></div>
        <div class="curve-wrap" id="curve"></div>
    `;
    poolEl = document.getElementById('pool');
    const slotsEl = document.getElementById('slots');
    slotEls = slotNames.map((name, i) => {
        const s = document.createElement('div');
        s.className = 'slot';
        s.dataset.slot = i;
        s.innerHTML = `<div class="slot-title">${i + 1}. ${name}</div>`;
        wireDrop(s, i);
        slotsEl.appendChild(s);
        return s;
    });
    wireDrop(poolEl, -1);
    checkBtn = document.getElementById('check');
    statusEl = document.getElementById('status');
    feedbackEl = document.getElementById('feedback');
    curveEl = document.getElementById('curve');
    checkBtn.addEventListener('click', check);
    document.getElementById('reset').addEventListener('click', reset);
    reset();
});
