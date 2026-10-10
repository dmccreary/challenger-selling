// Story Component Builder - sequence the six sales story components, then write them
// CANVAS_HEIGHT: 640
// Phase 1: drag (or click) components into six slots and check the order.
// Phase 2: write 1-2 sentences per component and review the assembled story.

const APP_HEIGHT = 640;

const SCENARIO = "You're selling a predictive maintenance platform to a manufacturing company.";

// Correct order
const COMPONENTS = [
    { id: 'hook', name: 'Opening Hook', role: 'Grab attention',
      prompt: 'Open with a surprising fact or vivid moment.',
      sample: 'At 2 a.m. last March, a bearing failed on Line 3 at a plant just like yours, and 400 orders missed their ship date.' },
    { id: 'problem', name: 'Problem Statement', role: 'Define the challenge',
      prompt: 'Name the specific challenge the customer faces.',
      sample: 'Most plants still service equipment on a fixed calendar, so failures between inspections go undetected until a machine stops.' },
    { id: 'agitation', name: 'Agitation', role: 'Show consequences',
      prompt: 'Make the cost of the status quo concrete.',
      sample: 'Unplanned downtime costs mid-size manufacturers about $260,000 an hour, and every hour delays deliveries and puts customer contracts at risk.' },
    { id: 'solution', name: 'Solution Presentation', role: 'Introduce your solution',
      prompt: 'Show how your solution resolves the tension.',
      sample: 'Our platform reads vibration and temperature sensors continuously and flags failing parts weeks in advance, so repairs happen during planned stops.' },
    { id: 'proof', name: 'Social Proof', role: 'Provide evidence',
      prompt: 'Cite a similar customer and a measurable result.',
      sample: 'A tier-1 auto supplier cut unplanned downtime by 38% in the first six months across four plants.' },
    { id: 'cta', name: 'Call to Action', role: 'Propose next step',
      prompt: 'Propose a specific, actionable next step.',
      sample: 'Let\'s run a 30-day pilot on Line 3. Can we schedule a kickoff with your maintenance lead next Tuesday?' }
];

// Starting pool order from the specification
const SHUFFLED = ['cta', 'hook', 'problem', 'agitation', 'solution', 'proof'];

const COLORS = ['#e3f2fd', '#ede7f6', '#fff3e0', '#e8f5e9', '#fce4ec', '#e0f7fa'];
const ACCENTS = ['#1976d2', '#7e57c2', '#fb8c00', '#43a047', '#d81b60', '#00acc1'];

// Words that suggest a specific, actionable call to action
const CTA_SPECIFIC = /\b(pilot|schedule|meeting|meet|demo|call|workshop|kickoff|trial|assessment|monday|tuesday|wednesday|thursday|friday|week|day|date|by|next)\b/i;

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    const byId = Object.fromEntries(COMPONENTS.map((c, i) => [c.id, { ...c, color: COLORS[i] }]));
    let slots = new Array(6).fill(null);
    let selected = null;       // id of chip picked by click (touch / keyboard friendly)
    let checkAttempts = 0;
    const content = {};

    injectStyles();

    // ---------- Phase 1: sequencing ----------
    function renderSequence(message) {
        const pool = SHUFFLED.filter(id => !slots.includes(id));
        app.innerHTML = `
            <h2>Story Component Builder</h2>
            <p class="subtitle">Step 1 of 2: arrange the six components into an effective story sequence.</p>
            <div class="card"><h3>Scenario</h3><p class="quote">${SCENARIO}</p></div>
            <div class="scb-label">Components (drag to a slot, or click a component then click a slot)</div>
            <div class="scb-pool" data-pool="1">
                ${pool.map(chip).join('') || '<span class="scb-empty">All components placed</span>'}
            </div>
            <div class="scb-label">Story Sequence</div>
            <div class="scb-slots">
                ${slots.map((id, i) => `
                    <div class="scb-slot ${id ? 'filled' : ''}" data-slot="${i}">
                        <span class="scb-num">${i + 1}</span>
                        ${id ? chip(id) : '<span class="scb-empty">drop here</span>'}
                    </div>${i < 5 ? '<span class="scb-arrow">&#10140;</span>' : ''}`).join('')}
            </div>
            <div class="btn-row">
                <button id="check" ${slots.every(Boolean) ? '' : 'disabled'}>Check Sequence</button>
                <button id="reset" class="secondary">Reset</button>
            </div>
            <div id="feedback">${message || ''}</div>
        `;
        wireSequence();
    }

    function chip(id) {
        const c = byId[id];
        return `<div class="scb-chip ${selected === id ? 'sel' : ''}" draggable="true" data-id="${id}" style="background:${c.color}">
            <strong>${c.name}</strong><span>${c.role}</span></div>`;
    }

    function place(id, slotIndex) {
        const from = slots.indexOf(id);
        const displaced = slots[slotIndex];
        if (from >= 0) slots[from] = displaced;  // swap when moving between slots
        slots[slotIndex] = id;
        selected = null;
        renderSequence();
    }

    function unplace(id) {
        const from = slots.indexOf(id);
        if (from >= 0) slots[from] = null;
        selected = null;
        renderSequence();
    }

    function wireSequence() {
        app.querySelectorAll('.scb-chip').forEach(el => {
            el.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', el.dataset.id));
            el.addEventListener('click', e => {
                e.stopPropagation();
                const id = el.dataset.id;
                const slotEl = el.closest('.scb-slot');
                // Clicking a filled slot while holding another component swaps them
                if (selected && selected !== id && slotEl) return place(selected, +slotEl.dataset.slot);
                selected = selected === id ? null : id;
                renderSequence();
            });
        });
        app.querySelectorAll('.scb-slot, .scb-pool').forEach(zone => {
            zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
            zone.addEventListener('dragleave', () => zone.classList.remove('over'));
            zone.addEventListener('drop', e => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain');
                if (zone.dataset.pool) unplace(id); else place(id, +zone.dataset.slot);
            });
            zone.addEventListener('click', () => {
                if (!selected) return;
                if (zone.dataset.pool) unplace(selected); else place(selected, +zone.dataset.slot);
            });
        });
        app.querySelector('#reset').addEventListener('click', () => {
            slots = new Array(6).fill(null);
            selected = null;
            renderSequence();
        });
        app.querySelector('#check').addEventListener('click', checkSequence);
    }

    function checkSequence() {
        checkAttempts++;
        const wrong = [];
        app.querySelectorAll('.scb-slot').forEach((el, i) => {
            const ok = slots[i] === COMPONENTS[i].id;
            el.classList.add(ok ? 'right' : 'wrong');
            if (!ok) wrong.push(i);
        });
        const fb = app.querySelector('#feedback');
        if (wrong.length === 0) {
            fb.innerHTML = `<div class="feedback ok"><strong>Correct!</strong> This sequence builds narrative tension effectively:
                Opening Hook &rarr; Problem &rarr; Agitation &rarr; Solution &rarr; Proof &rarr; Action. Tension rises before the solution resolves it.
                ${checkAttempts === 1 ? ' You got it on the first try.' : ''}</div>
                <div class="btn-row"><button id="toWrite">Continue: Write Your Story</button></div>`;
            app.querySelector('#toWrite').addEventListener('click', renderWrite);
        } else {
            fb.innerHTML = `<div class="feedback bad"><strong>${6 - wrong.length} of 6 in the right position.</strong> ${hint()}
                Slots marked in red need to move.</div>`;
        }
    }

    function hint() {
        const pos = id => slots.indexOf(id);
        if (pos('solution') < pos('agitation')) return 'Agitation must come before the solution. The customer has to feel the cost of the problem before your solution matters.';
        if (pos('cta') !== 5) return 'The call to action closes the story. Ask for the next step only after the evidence is in.';
        if (pos('hook') !== 0) return 'Start with the hook. You need attention before you can define a problem.';
        if (pos('proof') < pos('solution')) return 'Social proof backs up a solution. Introduce the solution first, then show evidence that it works.';
        return 'Think about how tension rises (problem, consequences) and then resolves (solution, evidence, action).';
    }

    // ---------- Phase 2: writing ----------
    function renderWrite() {
        app.innerHTML = `
            <h2>Story Component Builder</h2>
            <p class="subtitle">Step 2 of 2: write 1-2 sentences for each component. ${SCENARIO}</p>
            ${COMPONENTS.map((c, i) => `
                <div class="scb-write" style="border-left-color:${ACCENTS[i]}">
                    <div class="scb-write-head">
                        <strong>${i + 1}. ${c.name}</strong> <span class="scb-role">${c.prompt}</span>
                        <button class="small secondary" data-sample="${c.id}">Show example</button>
                    </div>
                    <textarea rows="2" data-id="${c.id}" placeholder="${c.role}...">${content[c.id] || ''}</textarea>
                </div>`).join('')}
            <div class="btn-row">
                <button id="submitStory">Submit Story</button>
                <button id="back" class="secondary">Back to Sequence</button>
            </div>
            <div id="feedback"></div>
        `;
        app.querySelectorAll('textarea').forEach(t => t.addEventListener('input', () => { content[t.dataset.id] = t.value; }));
        app.querySelectorAll('[data-sample]').forEach(b => b.addEventListener('click', () => {
            const ta = app.querySelector(`textarea[data-id="${b.dataset.sample}"]`);
            ta.placeholder = 'Example: ' + byId[b.dataset.sample].sample;
            ta.focus();
        }));
        app.querySelector('#back').addEventListener('click', () => renderSequence());
        app.querySelector('#submitStory').addEventListener('click', submitStory);
    }

    function submitStory() {
        const missing = COMPONENTS.filter(c => (content[c.id] || '').trim().length < 15);
        const fb = app.querySelector('#feedback');
        if (missing.length) {
            fb.innerHTML = `<div class="feedback warn">All six components are essential. Add at least a sentence for: <strong>${missing.map(c => c.name).join(', ')}</strong>.</div>`;
            fb.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        renderStory();
    }

    function renderStory() {
        const notes = [];
        if (!CTA_SPECIFIC.test(content.cta)) notes.push('Your <strong>Call to Action</strong> may be too vague. Name a concrete next step and a time, such as a pilot or a meeting date.');
        if (!/\d/.test(content.agitation + content.proof)) notes.push('Add a <strong>number</strong> to your Agitation or Social Proof. Quantified consequences and results are far more persuasive.');
        app.innerHTML = `
            <h2>Your Assembled Sales Story</h2>
            <p class="subtitle">${SCENARIO}</p>
            ${COMPONENTS.map((c, i) => `
                <div class="scb-write" style="border-left-color:${ACCENTS[i]}; background:white;">
                    <div class="scb-role" style="margin-bottom:2px;">${c.name}</div>
                    <div>${escapeHtml(content[c.id])}</div>
                </div>`).join('')}
            <div class="feedback ${notes.length ? 'warn' : 'ok'}">
                ${notes.length ? notes.join('<br>') : '<strong>Well done!</strong> Your story content demonstrates understanding of each component\'s purpose.'}
            </div>
            <div class="btn-row">
                <button id="edit" class="secondary">Edit Story</button>
                <button id="restart">Start Over</button>
            </div>
        `;
        app.querySelector('#edit').addEventListener('click', renderWrite);
        app.querySelector('#restart').addEventListener('click', () => {
            slots = new Array(6).fill(null);
            checkAttempts = 0;
            Object.keys(content).forEach(k => delete content[k]);
            renderSequence();
        });
        app.scrollTop = 0;
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    }

    function injectStyles() {
        const css = document.createElement('style');
        css.textContent = `
            .scb-label { font-weight: bold; font-size: 0.9em; margin: 6px 0 4px; }
            .scb-pool { display: flex; flex-wrap: wrap; gap: 8px; min-height: 58px; padding: 8px; border: 2px dashed var(--border); border-radius: 8px; background: white; margin-bottom: 8px; }
            .scb-pool.over, .scb-slot.over { border-color: var(--primary); background: #e3f2fd; }
            .scb-chip { display: flex; flex-direction: column; padding: 5px 7px; border-radius: 6px; border: 1px solid #b0bec5; cursor: grab; font-size: 0.85em; user-select: none; }
            .scb-chip span { color: var(--muted); font-size: 0.9em; }
            .scb-slot .scb-chip { font-size: 0.78em; padding: 4px 5px; overflow-wrap: break-word; }
            @media (max-width: 760px) { .scb-arrow { display: none; } .scb-slots { gap: 5px; } }
            .scb-chip.sel { outline: 3px solid var(--primary); }
            .scb-slots { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; margin-bottom: 10px; }
            .scb-slot { flex: 1 1 0; min-width: 78px; min-height: 70px; border: 2px dashed var(--border); border-radius: 8px; background: white; padding: 4px; display: flex; flex-direction: column; gap: 3px; cursor: pointer; }
            .scb-slot.filled { border-style: solid; }
            .scb-slot.right { border-color: var(--ok); background: var(--ok-bg); }
            .scb-slot.wrong { border-color: var(--bad); background: var(--bad-bg); }
            .scb-num { font-weight: bold; color: var(--primary); font-size: 0.85em; }
            .scb-arrow { color: var(--muted); }
            .scb-empty { color: #b0bec5; font-size: 0.85em; font-style: italic; align-self: center; margin: auto; }
            .scb-write { border-left: 6px solid; padding: 6px 10px; margin-bottom: 6px; background: var(--panel); border-radius: 4px; }
            .scb-write-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
            .scb-write-head button { margin-left: auto; }
            .scb-role { color: var(--muted); font-size: 0.85em; }
        `;
        document.head.appendChild(css);
    }

    renderSequence();
});
