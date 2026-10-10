// Sentiment Analyzer - classify sentiment and justify it with indicators
// CANVAS_HEIGHT: 690
// Learners label the sentiment of four customer excerpts and explain which
// words signal it. After each submission the indicator words are highlighted
// in the excerpt and compared with the learner's explanation.

const TONE_COLOR = { pos: '#c8e6c9', neg: '#ffcdd2', neu: '#e0e0e0', hedge: '#fff59d' };

function highlight(text, indicators) {
    let out = text;
    indicators.forEach(([word, tone]) => {
        out = out.replace(new RegExp('(' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i'),
            `<mark style="background:${TONE_COLOR[tone]};padding:0 2px;border-radius:3px;">$1</mark>`);
    });
    return out;
}

const CONFIG = {
    title: 'Sentiment Analyzer',
    subtitle: 'Label the sentiment of each excerpt and explain which words give it away.',
    height: 690,
    itemLabel: 'Excerpt',
    fields: [
        { id: 'sentiment', label: 'Sentiment', type: 'buttons', options: ['Positive', 'Negative', 'Neutral'] },
        { id: 'why', label: 'Sentiment indicators (which words or phrases signal it?)', type: 'text', placeholder: 'e.g. "thrilled" and "praising" are strongly positive...' }
    ],
    optionInfo: {
        sentiment: {
            'Positive': 'means the overall tone is favorable',
            'Negative': 'means the overall tone is unfavorable',
            'Neutral': 'means the language is factual with little emotion either way'
        }
    },
    items: [
        {
            short: 'Thrilled with results',
            text: 'Our customers are thrilled with the results! They\'ve seen 40% improvement and can\'t stop praising our team.',
            indicators: [['thrilled', 'pos'], ['40% improvement', 'pos'], ['praising', 'pos']],
            correct: { sentiment: 'Positive' },
            reason: 'This excerpt is <strong>Positive</strong>. Indicators: "thrilled," "improvement," and "can\'t stop praising" are strong positive words, and the exclamation mark intensifies them.',
            why: 'Strong positive words + exclamation.'
        },
        {
            short: 'Disappointed with delays',
            text: 'We\'re disappointed with the delays. The implementation took twice as long as promised and we\'re losing patience.',
            indicators: [['disappointed', 'neg'], ['delays', 'neg'], ['twice as long as promised', 'neg'], ['losing patience', 'neg']],
            correct: { sentiment: 'Negative' },
            reason: 'This excerpt is <strong>Negative</strong>. Indicators: "disappointed," "delays," "twice as long as promised" (a broken expectation), and "losing patience," which warns the frustration is growing.',
            why: 'Broken promises and growing frustration.'
        },
        {
            short: 'Performs as expected',
            text: 'The solution performs as expected. It meets our requirements and the team is responsive.',
            indicators: [['as expected', 'neu'], ['meets our requirements', 'neu'], ['responsive', 'neu']],
            correct: { sentiment: 'Neutral' },
            reason: 'This excerpt is <strong>Neutral</strong>. Indicators: "as expected" and "meets our requirements" are factual, with no strong emotion. "Responsive" is mildly favorable, but nothing here signals delight or frustration. In sales, neutral is not a win: there is no advocate yet.',
            why: 'Factual, low emotion. Not yet an advocate.'
        },
        {
            short: 'Cautiously optimistic',
            text: 'We\'re cautiously optimistic. Early results are promising but we need to see sustained performance over time.',
            indicators: [['optimistic', 'pos'], ['promising', 'pos'], ['cautiously', 'hedge'], ['but we need to see', 'hedge']],
            correct: { sentiment: 'Positive' },
            reason: 'This excerpt is (cautiously) <strong>Positive</strong>. Indicators: "optimistic" and "promising" are positive; "cautiously" and "but we need to see..." are hedges that soften it. Mixed sentiment like this is common, and the hedge tells you what proof the customer still needs.',
            why: 'Positive, softened by hedges.'
        }
    ],
    resultHtml: (it, sel) => {
        // an indicator counts as mentioned if the explanation contains its longest word
        const key = w => w.toLowerCase().split(/\s+/).sort((a, b) => b.length - a.length)[0].replace(/[^a-z0-9%]/g, '');
        const mentioned = it.indicators.filter(([w]) => sel.why.toLowerCase().includes(key(w)));
        return `<div class="result"><strong>Indicators highlighted:</strong> "${highlight(it.text, it.indicators)}"
            <br><span style="font-size:0.85em;"><mark style="background:${TONE_COLOR.pos}">positive</mark> <mark style="background:${TONE_COLOR.neg}">negative</mark> <mark style="background:${TONE_COLOR.neu}">neutral</mark> <mark style="background:${TONE_COLOR.hedge}">hedge</mark></span>
            <br><strong>Your explanation</strong> named ${mentioned.length} of ${it.indicators.length} indicators${mentioned.length ? ': ' + mentioned.map(m => '"' + m[0] + '"').join(', ') : ''}.</div>`;
    },
    summaryNote: 'sentiment analysis reads emotional tone from keywords, context, and language patterns, and it is often subtle or mixed. Watch for hedges such as "cautiously" and "but": they show where a customer\'s sentiment could shift, and what proof would move it.'
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
    const graded = C.fields.filter(f => f.type !== 'text');
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
        if (f.type === 'text') {
            return `<div class="field full"><label for="f-${f.id}">${f.label}</label>` +
                `<textarea id="f-${f.id}" data-field="${f.id}" rows="2" placeholder="${esc(f.placeholder || '')}"></textarea></div>`;
        }
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
        app.querySelectorAll('textarea[data-field]').forEach(t => t.addEventListener('input', () => {
            sel[t.dataset.field] = t.value.trim().length >= 3 ? t.value.trim() : '';
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
            graded.forEach(f => { ok[f.id] = sel[f.id] === it.correct[f.id]; });
            const allOk = graded.every(f => ok[f.id]);
            if (!results[index]) results[index] = { firstTryCorrect: allOk, sel: Object.assign({}, sel) };

            let html;
            if (allOk) {
                html = `<div class="feedback ok"><strong>Correct!</strong> ${it.reason}</div>`;
            } else {
                const parts = graded.map(f => {
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
        const head = `<tr><th>#</th><th>${C.itemLabel}</th>${graded.map(f => `<th>${f.label}</th>`).join('')}<th>Why</th></tr>`;
        const rows = C.items.map((it, i) => {
            const mark = results[i].firstTryCorrect ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>';
            return `<tr><td>${mark} ${i + 1}</td><td>${it.short}</td>` +
                graded.map(f => `<td><strong>${esc(it.correct[f.id])}</strong></td>`).join('') +
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
