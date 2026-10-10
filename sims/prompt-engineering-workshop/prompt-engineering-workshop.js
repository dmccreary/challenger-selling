// Prompt Engineering Workshop - build and order an AI story-generation prompt
// CANVAS_HEIGHT: 640
// Learners pick prompt elements, arrange them, optionally add custom text,
// and get feedback on completeness, focus, and logical structure.

const APP_HEIGHT = 640;

const SCENARIO = 'You want to generate a sales story for a CTO in manufacturing. Build an effective prompt.';

// rank = position in the effective structure: 1 context, 2 insight, 3 structure, 4 tone, 5 requirements
// rank 0 = distractor (excess context that dilutes the prompt)
const ELEMENTS = [
    { id: 'persona',   text: 'Target persona: CTO', rank: 1, group: 'Context', essential: true },
    { id: 'industry',  text: 'Industry: Manufacturing', rank: 1, group: 'Context', essential: true },
    { id: 'insight',   text: 'Challenger insight: Legacy systems block innovation', rank: 2, group: 'Insight', essential: true },
    { id: 'structure', text: 'Story structure: Hook, problem, agitation, solution, social proof, call to action', rank: 3, group: 'Structure', essential: true },
    { id: 'tone',      text: 'Tone: Technical and authoritative', rank: 4, group: 'Tone', essential: true },
    { id: 'words',     text: 'Word count: 500 words', rank: 5, group: 'Requirement' },
    { id: 'metrics',   text: 'Include specific metrics', rank: 5, group: 'Requirement' },
    { id: 'debt',      text: 'Focus on technical debt', rank: 5, group: 'Requirement' },
    { id: 'history',   text: 'Company history: founded 1952, 14 plants, 3 acquisitions, new logo in 2019', rank: 0, group: 'Extra context' },
    { id: 'features',  text: 'Mention every feature in our product catalog', rank: 0, group: 'Extra context' }
];

const GROUP_ORDER = ['Context', 'Insight', 'Structure', 'Tone', 'Requirement'];

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);
    injectStyles();

    const byId = Object.fromEntries(ELEMENTS.map(e => [e.id, e]));
    let order = [];          // ids (or custom objects) in prompt order
    let customCount = 0;
    let iteration = 0;

    app.innerHTML = `
        <h2>Prompt Engineering Workshop</h2>
        <p class="subtitle">${SCENARIO}</p>
        <div class="pew-cols">
            <div class="pew-col">
                <div class="pew-head">1. Select elements</div>
                <div id="elements"></div>
                <div class="pew-head" style="margin-top:8px;">Add custom text (optional)</div>
                <div class="pew-custom">
                    <input type="text" id="customText" placeholder="e.g. Mention a 2-hour plant shutdown">
                    <button id="addCustom" class="small">Add</button>
                </div>
            </div>
            <div class="pew-col">
                <div class="pew-head">2. Arrange your prompt <span class="pew-muted">(drag or use arrows)</span></div>
                <ol id="order" class="pew-order"></ol>
                <div class="pew-head">Assembled prompt</div>
                <textarea id="preview" rows="6" readonly></textarea>
            </div>
        </div>
        <div class="btn-row">
            <button id="submit" disabled>Submit Prompt</button>
            <button id="reset" class="secondary">Reset</button>
            <span id="count" class="pew-muted" style="align-self:center;"></span>
        </div>
        <div id="feedback"></div>
    `;

    const elList = app.querySelector('#elements');
    const orderList = app.querySelector('#order');
    const preview = app.querySelector('#preview');
    const submit = app.querySelector('#submit');
    const fb = app.querySelector('#feedback');

    elList.innerHTML = ELEMENTS.map(e => `
        <label class="pew-el"><input type="checkbox" value="${e.id}"> ${e.text}</label>`).join('');

    elList.addEventListener('change', e => {
        const id = e.target.value;
        if (e.target.checked) order.push(id); else order = order.filter(x => x !== id);
        refresh();
    });

    app.querySelector('#addCustom').addEventListener('click', () => {
        const input = app.querySelector('#customText');
        const text = input.value.trim();
        if (!text) return;
        const id = 'custom' + (++customCount);
        byId[id] = { id, text, rank: -1, group: 'Custom' };
        order.push(id);
        input.value = '';
        refresh();
    });

    app.querySelector('#reset').addEventListener('click', () => {
        order = [];
        iteration = 0;
        elList.querySelectorAll('input').forEach(cb => { cb.checked = false; });
        fb.innerHTML = '';
        refresh();
    });

    submit.addEventListener('click', evaluate);

    function refresh() {
        orderList.innerHTML = order.map((id, i) => `
            <li draggable="true" data-i="${i}" class="pew-item g-${byId[id].group.replace(' ', '-')}">
                ${iteration ? `<span class="pew-tag">${byId[id].group}</span>` : ""}
                <span class="pew-text">${escapeHtml(byId[id].text)}</span>
                <span class="pew-btns">
                    <button class="small secondary" data-move="-1" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Move up">&uarr;</button>
                    <button class="small secondary" data-move="1" data-i="${i}" ${i === order.length - 1 ? 'disabled' : ''} aria-label="Move down">&darr;</button>
                    <button class="small secondary" data-remove="${i}" aria-label="Remove">&times;</button>
                </span>
            </li>`).join('') || '<li class="pew-placeholder">Selected elements appear here</li>';

        preview.value = order.length
            ? 'Write a sales story with these specifications:\n' + order.map(id => '- ' + byId[id].text).join('\n')
            : '';
        submit.disabled = order.length < 4;
        app.querySelector('#count').textContent = order.length < 4
            ? `Select at least 4 elements (${order.length} selected)`
            : `${order.length} elements`;
        wireOrder();
    }

    function wireOrder() {
        orderList.querySelectorAll('[data-move]').forEach(b => b.addEventListener('click', () => {
            const i = +b.dataset.i, j = i + +b.dataset.move;
            [order[i], order[j]] = [order[j], order[i]];
            refresh();
        }));
        orderList.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
            const id = order.splice(+b.dataset.remove, 1)[0];
            const cb = elList.querySelector(`input[value="${id}"]`);
            if (cb) cb.checked = false;
            refresh();
        }));
        orderList.querySelectorAll('li[draggable]').forEach(li => {
            li.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', li.dataset.i));
            li.addEventListener('dragover', e => { e.preventDefault(); li.classList.add('over'); });
            li.addEventListener('dragleave', () => li.classList.remove('over'));
            li.addEventListener('drop', e => {
                e.preventDefault();
                const from = +e.dataTransfer.getData('text/plain'), to = +li.dataset.i;
                const [moved] = order.splice(from, 1);
                order.splice(to, 0, moved);
                refresh();
            });
        });
    }

    function evaluate() {
        iteration++;
        refresh();
        const chosen = order.map(id => byId[id]);
        const missing = ELEMENTS.filter(e => e.essential && !order.includes(e.id));
        const distractors = chosen.filter(e => e.rank === 0);
        const ranked = chosen.filter(e => e.rank > 0);
        // Find the first element that appears after a later-stage element
        let outOfOrder = null;
        for (let i = 1; i < ranked.length; i++) {
            if (ranked[i].rank < ranked[i - 1].rank) { outOfOrder = [ranked[i - 1], ranked[i]]; break; }
        }
        const hasRequirement = chosen.some(e => e.rank === 5) || chosen.some(e => e.rank === -1);

        const groupsIncluded = GROUP_ORDER.filter(g => chosen.some(e => e.group === g));
        const effective = !missing.length && !distractors.length && !outOfOrder && hasRequirement;
        const suggestions = [];
        if (missing.length) suggestions.push(`You might want to add <strong>${missing.map(m => m.text).join('</strong> and <strong>')}</strong> to make the prompt more specific.`);
        if (distractors.length) suggestions.push(`Remove <strong>${distractors.map(d => d.text).join('</strong> and <strong>')}</strong>. More context is not always better: irrelevant detail dilutes the model's focus and can leak into the story.`);
        if (outOfOrder) suggestions.push(`<strong>${outOfOrder[1].group}</strong> ("${outOfOrder[1].text}") should come before <strong>${outOfOrder[0].group}</strong>. Effective prompts flow from context to insight to structure to tone to specific requirements.`);
        if (!hasRequirement) suggestions.push('Add at least one specific requirement, such as metrics, a technical focus, or a length, so the output is concrete.');

        fb.innerHTML = `
            <div class="feedback ${effective ? 'ok' : 'warn'}">
                <strong>Iteration ${iteration}:</strong> Your prompt includes ${groupsIncluded.join(', ') || 'no core elements'}${distractors.length ? ' plus extra context' : ''}.
                This structure is <strong>${effective ? 'effective' : 'in need of improvement'}</strong>.
                ${effective
                    ? 'It gives the model who, what, how, and in what voice, then constrains the output. A real first draft may still need refinement: try adding custom text, then resubmit.'
                    : '<br>' + suggestions.join('<br>') + '<br><em>Refine and resubmit. Iterating on a prompt is normal practice.</em>'}
            </div>`;
        fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    }

    function injectStyles() {
        const css = document.createElement('style');
        css.textContent = `
            .pew-cols { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
            .pew-col { flex: 1 1 300px; background: white; border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; }
            .pew-head { font-weight: bold; font-size: 0.9em; margin-bottom: 4px; }
            .pew-muted { color: var(--muted); font-weight: normal; font-size: 0.85em; }
            .pew-el { display: flex; gap: 6px; align-items: flex-start; font-size: 0.88em; padding: 3px 0; cursor: pointer; }
            .pew-custom { display: flex; gap: 6px; }
            .pew-order { list-style: none; padding: 0; margin: 0 0 8px 0; min-height: 40px; }
            .pew-item { display: flex; align-items: center; gap: 6px; padding: 4px 6px; margin-bottom: 4px; border-radius: 6px; border: 1px solid var(--border); background: var(--panel); cursor: grab; font-size: 0.85em; }
            .pew-item.over { border-color: var(--primary); background: #e3f2fd; }
            .pew-text { flex: 1; }
            .pew-btns { display: flex; gap: 2px; }
            .pew-btns button { padding: 1px 6px; }
            .pew-tag { font-size: 0.75em; font-weight: bold; padding: 1px 5px; border-radius: 4px; background: #cfd8dc; white-space: nowrap; }
            .g-Context .pew-tag { background: #bbdefb; }
            .g-Insight .pew-tag { background: #d1c4e9; }
            .g-Structure .pew-tag { background: #ffe0b2; }
            .g-Tone .pew-tag { background: #c8e6c9; }
            .g-Requirement .pew-tag { background: #f8bbd0; }
            .g-Extra-context .pew-tag { background: #eeeeee; color: #757575; }
            .pew-placeholder { color: #b0bec5; font-style: italic; font-size: 0.85em; padding: 8px; border: 2px dashed var(--border); border-radius: 6px; }
            #preview { font-family: monospace; font-size: 0.8em; background: #fafafa; }
        `;
        document.head.appendChild(css);
    }

    refresh();
});
