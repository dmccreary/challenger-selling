// Use Case Matcher - match business scenarios to graph database use cases
// CANVAS_HEIGHT: 520
// Step-through practice: read a business scenario, choose the graph use case
// that fits, and get feedback explaining which relationships make it a fit.

const CONFIG = {
    title: 'Use Case Matcher',
    subtitle: 'Which graph database use case fits each business scenario?',
    height: 520,
    itemLabel: 'Scenario',
    fields: [{
        id: 'useCase', label: 'Graph Use Case', type: 'buttons',
        options: ['Social Network Analysis', 'Fraud Detection', 'Recommendation Engines', 'Knowledge Graphs']
    }],
    optionInfo: {
        useCase: {
            'Social Network Analysis': 'looks for influencers, communities, and how people connect to each other',
            'Fraud Detection': 'looks for hidden rings of accounts, devices, and transactions that coordinate suspiciously',
            'Recommendation Engines': 'follows customer-to-product paths to suggest what similar people bought or viewed',
            'Knowledge Graphs': 'organizes facts about many kinds of entities so experts can query how they relate'
        }
    },
    items: [
        {
            short: 'Bank fraud rings',
            text: 'A bank wants to detect suspicious transaction patterns that might indicate fraud rings where multiple accounts coordinate to launder money.',
            correct: { useCase: 'Fraud Detection' },
            reason: 'This scenario is a <strong>Fraud Detection</strong> problem because each account looks normal on its own. The fraud only appears when you follow the edges and see many accounts sharing devices, addresses, and money flows in a tight ring.',
            why: 'The signal lives in the connections between accounts, not in any single account.'
        },
        {
            short: 'Influencers and communities',
            text: 'A social media platform wants to identify influencers and communities to improve content targeting and engagement.',
            correct: { useCase: 'Social Network Analysis' },
            reason: 'This scenario is a <strong>Social Network Analysis</strong> problem because influence and community are properties of the network itself: who is connected to whom, and which people sit at the center of many paths.',
            why: 'Influence = centrality; communities = densely connected clusters.'
        },
        {
            short: 'Product suggestions',
            text: 'An e-commerce site wants to recommend products based on what similar customers purchased and viewed.',
            correct: { useCase: 'Recommendation Engines' },
            reason: 'This scenario is a <strong>Recommendation Engines</strong> problem because the answer comes from a short traversal: customer &rarr; bought &rarr; product &larr; bought &larr; similar customer &rarr; bought &rarr; new product.',
            why: 'A 3-hop customer-product-customer-product traversal.'
        },
        {
            short: 'Drugs, diseases, genes, trials',
            text: 'A pharmaceutical company wants to organize and query relationships between drugs, diseases, genes, and clinical trials.',
            correct: { useCase: 'Knowledge Graphs' },
            reason: 'This scenario is a <strong>Knowledge Graphs</strong> problem because it connects many different <em>types</em> of entities with named relationships (treats, targets, studied-in) so researchers can ask questions that span all of them.',
            why: 'Many entity types joined by meaningful, named relationships.'
        }
    ],
    summaryNote: 'every use case is a business problem first. Pick the use case by asking which relationships carry the answer: people-to-people (social), account-to-account (fraud), customer-to-product (recommendations), or fact-to-fact across many entity types (knowledge graphs).'
};

// ---------------------------------------------------------------------------
// Step-through scenario engine: one scenario at a time, learner selections,
// Submit -> feedback, Next -> following scenario, then a summary table.
// Only the first submission for each scenario counts toward the score.
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const C = CONFIG;
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', C.height + 'px');
    main.appendChild(app);

    let index = 0;
    const results = [];
    const n = C.items.length;
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const optsFor = (it, f) => (it.options && it.options[f.id]) || f.options;
    const info = (f, v) => (C.optionInfo && C.optionInfo[f.id] && C.optionInfo[f.id][v]) || '';

    function progressDots() {
        return '<div class="progress">' + C.items.map((s, i) => {
            let cls = 'dot';
            if (results[i]) cls += results[i].firstTryCorrect ? ' right' : ' wrong';
            else if (i === index) cls += ' current';
            return `<div class="${cls}">${i + 1}</div>`;
        }).join('') + '</div>';
    }

    function fieldHtml(f, opts) {
        if (f.type === 'buttons') {
            return `<div class="field full"><label>${f.label}</label><div class="choice-row" data-field="${f.id}">` +
                opts.map(o => `<button type="button" class="choice" data-value="${esc(o)}">${esc(o)}</button>`).join('') +
                '</div></div>';
        }
        return `<div class="field"><label for="f-${f.id}">${f.label}</label><select id="f-${f.id}" data-field="${f.id}">` +
            '<option value="">-- choose --</option>' +
            opts.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('') + '</select></div>';
    }

    function renderItem() {
        const it = C.items[index];
        const sel = {};
        app.innerHTML = `
            <h2>${C.title}</h2>
            <p class="subtitle">${C.subtitle}</p>
            ${C.contextHtml || ''}
            ${progressDots()}
            <div class="card">
                <h3>${C.itemLabel} ${index + 1} of ${n}${it.heading ? ': ' + it.heading : ''}</h3>
                <p class="quote">${it.text}</p>
            </div>
            <div class="field-row">${C.fields.map(f => fieldHtml(f, optsFor(it, f))).join('')}</div>
            <div class="btn-row">
                <button id="submit" disabled>Submit</button>
                <button id="next" class="secondary hidden">${index < n - 1 ? 'Next ' + C.itemLabel : 'See Summary'}</button>
            </div>
            <div id="feedback"></div>
        `;
        const submit = app.querySelector('#submit');
        const next = app.querySelector('#next');
        const fb = app.querySelector('#feedback');
        const updateSubmit = () => { submit.disabled = !C.fields.every(f => sel[f.id]); };

        app.querySelectorAll('select[data-field]').forEach(s => s.addEventListener('change', () => {
            sel[s.dataset.field] = s.value;
            updateSubmit();
        }));
        app.querySelectorAll('.choice-row').forEach(row => row.querySelectorAll('button.choice').forEach(b => {
            b.addEventListener('click', () => {
                row.querySelectorAll('button.choice').forEach(x => x.classList.remove('selected'));
                b.classList.add('selected');
                sel[row.dataset.field] = b.dataset.value;
                updateSubmit();
            });
        }));

        submit.addEventListener('click', () => {
            const ok = {};
            C.fields.forEach(f => { ok[f.id] = sel[f.id] === it.correct[f.id]; });
            const allOk = C.fields.every(f => ok[f.id]);
            if (!results[index]) results[index] = { firstTryCorrect: allOk, sel: Object.assign({}, sel) };

            let html;
            if (allOk) {
                html = `<div class="feedback ok"><strong>Correct!</strong> ${it.reason}</div>`;
            } else {
                const parts = C.fields.map(f => {
                    if (ok[f.id]) return `<strong>${f.label}:</strong> ${esc(sel[f.id])} is right.`;
                    const why = info(f, sel[f.id]);
                    return `<strong>${f.label}:</strong> you chose ${esc(sel[f.id])}${why ? ', which ' + why : ''}. The better choice is <strong>${esc(it.correct[f.id])}</strong>.`;
                });
                html = `<div class="feedback bad"><strong>Not quite.</strong> ${parts.join(' ')}<br>${it.reason}` +
                    '<br><em>Change your selections and submit again to compare, or move on.</em></div>';
            }
            if (C.resultHtml) {
                const res = C.resultHtml(it, sel, allOk);
                html = C.resultBeside ? `<div class="two-col">${res}${html}</div>` : res + html;
            }
            fb.innerHTML = html;
            next.classList.remove('hidden');
            const old = app.querySelector('.progress');
            if (old) old.outerHTML = progressDots();
        });

        next.addEventListener('click', () => {
            index++;
            if (index < n) renderItem(); else renderSummary();
        });
    }

    function renderSummary() {
        const score = results.filter(r => r.firstTryCorrect).length;
        const head = `<tr><th>#</th><th>${C.itemLabel}</th>${C.fields.map(f => `<th>${f.label}</th>`).join('')}<th>Why</th></tr>`;
        const rows = C.items.map((it, i) => {
            const mark = results[i].firstTryCorrect ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>';
            return `<tr><td>${mark} ${i + 1}</td><td>${it.short}</td>` +
                C.fields.map(f => `<td><strong>${esc(it.correct[f.id])}</strong></td>`).join('') +
                `<td>${it.why}</td></tr>`;
        }).join('');
        app.innerHTML = `
            <h2>${C.title}: Summary</h2>
            <p class="subtitle">First-try score: <strong>${score} of ${n}</strong>${score === n ? ' (mastery)' : ''}</p>
            <table class="summary">${head}${rows}</table>
            <div class="feedback warn" style="margin-top:10px;"><strong>Remember:</strong> ${C.summaryNote}</div>
            <div class="btn-row"><button id="restart">Start Over</button></div>
        `;
        app.querySelector('#restart').addEventListener('click', () => {
            index = 0;
            results.length = 0;
            renderItem();
        });
    }

    renderItem();
});
