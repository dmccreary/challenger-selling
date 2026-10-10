// A/B Test Designer - design a one-variable test of a price objection story
// CANVAS_HEIGHT: 740
// Learners choose the single variable to change, write a hypothesis, and pick
// a success metric. After submitting a valid design they interpret early and
// later results to practice the idea of statistical significance.

const APP_HEIGHT = 740;

const VARIABLES = {
    'Opening hook': 'the first 15 seconds: the question or statistic that earns attention',
    'Agitation approach': 'how the story makes the cost of the status quo feel real',
    'Social proof example': 'which customer example proves the point',
    'Call to action': 'the specific next step the story asks for',
    'All four at once (rewrite the whole story)': null
};

const METRICS = {
    'Conversion rate': { ok: true, note: 'Conversion rate is a business outcome: did the opportunity advance past the price objection?' },
    'Engagement rate': { ok: false, note: 'Engagement rate is a leading indicator. Track it as a secondary metric, but a more engaging story that does not move deals has not won.' },
    'Story completion': { ok: false, note: 'Story completion tells you the rep finished telling it, not whether the buyer moved. Use it as a secondary metric.' },
    'Customer recall': { ok: false, note: 'Customer recall is valuable but slow to measure and not the business outcome. Use it as a secondary metric.' }
};

// Two-proportion z-test, two-sided p-value
function pValue(c1, n1, c2, n2) {
    const p = (c1 + c2) / (n1 + n2);
    const z = Math.abs(c1 / n1 - c2 / n2) / Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
    // Abramowitz-Stegun approximation of the normal CDF
    const t = 1 / (1 + 0.2316419 * z);
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const tail = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return 2 * tail;
}

const ROUNDS = [
    { label: 'Early results (2 weeks)', a: [18, 100], b: [24, 100], correct: 'Not yet: keep collecting data' },
    { label: 'Later results (8 weeks)', a: [72, 400], b: [96, 400], correct: 'Yes: Story B wins' }
];

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    function renderDesign() {
        app.innerHTML = `
            <h2>A/B Test Designer</h2>
            <p class="subtitle">Design a valid A/B test in three steps.</p>
            <div class="context"><strong>Scenario:</strong> Your team's price objection story ("Story A") is used in every late-stage deal. You want to make it better. Design an A/B test.</div>
            <div class="card">
                <h3>Step 1: What will Story B change?</h3>
                <div class="choice-row" id="vars">${Object.keys(VARIABLES).map(v => `<button type="button" class="choice" data-v="${v}">${v}</button>`).join('')}</div>
            </div>
            <div class="card">
                <h3>Step 2: Write your hypothesis</h3>
                <textarea id="hyp" rows="2" placeholder="Story B, which changes the ..., will produce a higher ... than Story A."></textarea>
                <div class="btn-row" style="margin:6px 0 0 0;"><button id="tmpl" class="secondary small">Start from a template</button></div>
            </div>
            <div class="card">
                <h3>Step 3: What is the primary success metric?</h3>
                <div class="choice-row" id="metrics">${Object.keys(METRICS).map(m => `<button type="button" class="choice" data-m="${m}">${m}</button>`).join('')}</div>
            </div>
            <div class="btn-row"><button id="submit" disabled>Submit Test Design</button></div>
            <div id="feedback"></div>
        `;
        let variable = null, metric = null;
        const hyp = app.querySelector('#hyp');
        const submit = app.querySelector('#submit');
        const update = () => { submit.disabled = !(variable && metric && hyp.value.trim()); };

        app.querySelectorAll('#vars .choice').forEach(b => b.addEventListener('click', () => {
            app.querySelectorAll('#vars .choice').forEach(x => x.classList.remove('selected'));
            b.classList.add('selected');
            variable = b.dataset.v;
            update();
        }));
        app.querySelectorAll('#metrics .choice').forEach(b => b.addEventListener('click', () => {
            app.querySelectorAll('#metrics .choice').forEach(x => x.classList.remove('selected'));
            b.classList.add('selected');
            metric = b.dataset.m;
            update();
        }));
        hyp.addEventListener('input', update);
        app.querySelector('#tmpl').addEventListener('click', () => {
            const v = variable && VARIABLES[variable] ? variable.toLowerCase() : '[variable]';
            const m = metric ? metric.toLowerCase() : '[metric]';
            hyp.value = `Story B, which changes the ${v}, will produce a higher ${m} than Story A (current).`;
            update();
        });

        submit.addEventListener('click', () => {
            const issues = [];
            const tips = [];
            const h = hyp.value.trim();
            if (!VARIABLES[variable]) issues.push('<strong>Step 1:</strong> changing all four elements at once means that if Story B wins, you will not know <em>which</em> change caused it. Test one variable at a time.');
            if (h.includes('[')) issues.push('<strong>Step 2:</strong> replace the [bracketed] placeholders in your hypothesis.');
            else if (h.split(/\s+/).length < 8) issues.push('<strong>Step 2:</strong> a hypothesis needs to name the change, the metric, and the expected direction. Yours is too short to do all three.');
            else if (!/(higher|lower|more|less|fewer|increase|decrease|improve|outperform|better|worse|raise|reduce)/i.test(h)) tips.push('Your hypothesis does not predict a <em>direction</em> (higher, lower, more...). Stating the direction makes the result easy to judge.');
            if (!METRICS[metric].ok) tips.push(METRICS[metric].note + ' The recommended primary metric is <strong>Conversion rate</strong>.');
            const fb = app.querySelector('#feedback');
            if (issues.length) {
                fb.innerHTML = `<div class="feedback bad"><strong>Not a valid test yet.</strong><br>${issues.join('<br>')}</div>`;
                return;
            }
            fb.innerHTML = `
                <div class="feedback ok">
                    Your A/B test will compare <strong>Story A (current)</strong> against a <strong>Story B</strong> that changes only the <strong>${variable.toLowerCase()}</strong> (${VARIABLES[variable]}).
                    <br><strong>Hypothesis:</strong> ${h.replace(/</g, '&lt;')}
                    <br><strong>Success metric:</strong> ${metric}. This is a valid test design.
                    ${tips.length ? '<br><em>Tip:</em> ' + tips.join(' ') : ''}
                </div>
                <div class="btn-row"><button id="run">Run the Test</button></div>`;
            fb.querySelector('#run').addEventListener('click', () => renderResults(variable, metric, 0, []));
            app.scrollTop = app.scrollHeight;
        });
    }

    function renderResults(variable, metric, round, answers) {
        const r = ROUNDS[round];
        const pa = (r.a[0] / r.a[1] * 100).toFixed(0), pb = (r.b[0] / r.b[1] * 100).toFixed(0);
        const pv = pValue(r.a[0], r.a[1], r.b[0], r.b[1]);
        app.innerHTML = `
            <h2>A/B Test Designer: Read the Results</h2>
            <p class="subtitle">Test: Story B changes the <strong>${variable.toLowerCase()}</strong>. Metric: <strong>${metric}</strong>.</p>
            <div class="card">
                <h3>${r.label}</h3>
                <table class="summary">
                    <tr><th>Version</th><th>Deals where story was told</th><th>Advanced past price objection</th><th>Rate</th></tr>
                    <tr><td>Story A (current)</td><td>${r.a[1]}</td><td>${r.a[0]}</td><td>${pa}%</td></tr>
                    <tr><td>Story B (new ${variable.toLowerCase()})</td><td>${r.b[1]}</td><td>${r.b[0]}</td><td><strong>${pb}%</strong></td></tr>
                </table>
            </div>
            <div class="card">
                <h3>Story B is ahead by ${pb - pa} points. Should the team switch everyone to Story B now?</h3>
                <div class="choice-row" id="decide">
                    ${['Yes: Story B wins', 'Not yet: keep collecting data'].map(o => `<button type="button" class="choice" data-o="${o}">${o}</button>`).join('')}
                </div>
            </div>
            <div id="feedback"></div>
        `;
        app.querySelectorAll('#decide .choice').forEach(b => b.addEventListener('click', () => {
            if (answers[round] !== undefined) return;
            b.classList.add('selected');
            const ok = b.dataset.o === r.correct;
            answers[round] = ok;
            const sig = pv < 0.05;
            const explain = sig
                ? `With ${r.a[1]} deals per version, a ${pb - pa}-point gap is <strong>statistically significant</strong> (p &asymp; ${pv.toFixed(3)}, below the usual 0.05 threshold). It is now unlikely the gap is luck.`
                : `With only ${r.a[1]} deals per version, a ${pb - pa}-point gap could easily be luck (p &asymp; ${pv.toFixed(2)}, well above the usual 0.05 threshold). Not every difference matters; wait for statistical significance.`;
            const last = round === ROUNDS.length - 1;
            app.querySelector('#feedback').innerHTML = `
                <div class="feedback ${ok ? 'ok' : 'bad'}"><strong>${ok ? 'Correct.' : 'Not quite.'}</strong> ${explain}</div>
                <div class="btn-row"><button id="next">${last ? 'See Summary' : 'Keep the Test Running'}</button></div>`;
            app.querySelector('#next').addEventListener('click', () => last ? renderSummary(variable, metric, answers) : renderResults(variable, metric, round + 1, answers));
        }));
    }

    function renderSummary(variable, metric, answers) {
        const score = answers.filter(Boolean).length;
        app.innerHTML = `
            <h2>A/B Test Designer: Summary</h2>
            <p class="subtitle">Results interpretation: <strong>${score} of ${ROUNDS.length}</strong> correct</p>
            <table class="summary">
                <tr><th>Design element</th><th>Your choice</th><th>Principle</th></tr>
                <tr><td>Variable</td><td>${variable}</td><td>Change one variable at a time so you can isolate its effect.</td></tr>
                <tr><td>Primary metric</td><td>${metric}</td><td>Judge the winner on a business outcome; keep engagement and recall as secondary metrics.</td></tr>
                <tr><td>Sample size</td><td>100 &rarr; 400 deals per version</td><td>Start small, but do not declare a winner until the difference is statistically significant.</td></tr>
            </table>
            <div class="feedback warn" style="margin-top:10px;"><strong>Remember:</strong> A/B testing requires testing one variable at a time to isolate its effect. Test, measure, and iterate: the winning Story B becomes the new Story A for your next test.</div>
            <div class="btn-row"><button id="restart">Design Another Test</button></div>
        `;
        app.querySelector('#restart').addEventListener('click', renderDesign);
    }

    renderDesign();
});
