// Objection Story Selector - match customer objections to story types
// CANVAS_HEIGHT: 560
// Step-through practice: read an objection, choose the story type that answers
// it, and see an example of that story applied.

const APP_HEIGHT = 560;

const TYPES = {
    'Price': 'reframes price from a line-item expense to an investment by exposing the hidden cost of the status quo or a cheaper alternative',
    'Timing': 'creates urgency by showing the cost of waiting: what customers who delayed lost, or what fast movers gained',
    'Competitor': 'shows a customer who evaluated both options and chose you for specific, factual reasons, without disparaging the competitor',
    'Risk': 'acknowledges the concern, then shows a customer who faced the same risk and managed it with a structured plan',
    'Authority': 'gives the buyer a roadmap for winning internal approval by showing how another champion persuaded their stakeholders'
};

const OBJECTIONS = [
    {
        text: "Your solution looks good, but the price is beyond our budget. We can't justify the expense.",
        type: 'Price',
        example: 'A regional distributor chose a vendor 30% cheaper. Within 18 months, custom integration work, extra headcount, and a failed upgrade made total cost 25% higher than our quote. They switched and now track ROI quarterly.'
    },
    {
        text: "We're interested, but this isn't the right time. We need to wait until next quarter to evaluate this.",
        type: 'Timing',
        example: 'A retailer postponed its decision by six months. During that window, a competitor launched the same capability and captured the holiday season. Recovering that share took two years.'
    },
    {
        text: 'Your competitor offers a similar solution at a lower price. Why should we choose you over them?',
        type: 'Competitor',
        example: 'A manufacturer ran a 60-day side-by-side pilot of both platforms. They chose us because implementation finished in 8 weeks instead of 20 and our support team resolved issues in hours, not days.'
    },
    {
        text: "We're concerned about implementation complexity. What if this disrupts our operations?",
        type: 'Risk',
        example: 'A hospital network had the same worry. We rolled out to one pilot site first, ran old and new systems in parallel for 30 days, and expanded only after zero disruptions. All 12 sites were live within a year.'
    },
    {
        text: "I like your solution, but I'll need to get approval from the CFO before we can move forward.",
        type: 'Authority',
        example: 'An operations VP faced a skeptical CFO. Instead of a feature deck, she told the story of a peer company that cut downtime costs by $2M, and backed it with a one-page payback model. The CFO approved it in one meeting.'
    }
];

// Why a tempting wrong choice does not fit, keyed by "chosen>correct"
const MISMATCH = {
    'Price>Competitor': 'The objection mentions price, but the real question is "why you instead of them?" A Competitor story answers that directly.',
    'Competitor>Price': 'No competitor is named. The buyer is questioning whether the spend is justified at all.',
    'Risk>Timing': '"Not the right time" is about delay, not disruption. Show the cost of waiting.',
    'Timing>Risk': 'The buyer is worried about what could go wrong, not when to start.',
    'Price>Authority': 'The buyer is not disputing the value. They lack the authority to approve it alone.'
};

document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const app = document.createElement('div');
    app.className = 'app';
    app.style.setProperty('--app-height', APP_HEIGHT + 'px');
    main.appendChild(app);

    let index = 0;
    const results = [];

    function progressDots() {
        return '<div class="progress">' + OBJECTIONS.map((o, i) => {
            let cls = 'dot';
            if (results[i] !== undefined) cls += results[i] ? ' right' : ' wrong';
            else if (i === index) cls += ' current';
            return `<div class="${cls}">${i + 1}</div>`;
        }).join('') + '</div>';
    }

    function renderObjection() {
        const o = OBJECTIONS[index];
        app.innerHTML = `
            <h2>Objection Story Selector</h2>
            <p class="subtitle">Answer each objection with a story instead of an argument. Which story type fits?</p>
            ${progressDots()}
            <div class="card">
                <h3>Objection ${index + 1} of ${OBJECTIONS.length}</h3>
                <p class="quote">"${o.text}"</p>
            </div>
            <div class="field-row">
                <div class="field">
                    <label for="type">Story Type</label>
                    <select id="type">
                        <option value="">-- choose --</option>
                        ${Object.keys(TYPES).map(t => `<option value="${t}">${t} Objection Story</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="btn-row">
                <button id="submit" disabled>Submit</button>
                <button id="next" class="secondary hidden">${index < OBJECTIONS.length - 1 ? 'Next Objection' : 'See Summary'}</button>
            </div>
            <div id="feedback"></div>
        `;
        const sel = app.querySelector('#type');
        const submit = app.querySelector('#submit');
        const next = app.querySelector('#next');
        const fb = app.querySelector('#feedback');

        sel.addEventListener('change', () => { submit.disabled = !sel.value; });

        submit.addEventListener('click', () => {
            const t = sel.value;
            const ok = t === o.type;
            if (results[index] === undefined) results[index] = ok;
            if (ok) {
                fb.innerHTML = `<div class="feedback ok"><strong>Correct!</strong> This is a <strong>${o.type}</strong> objection. A ${o.type} story ${TYPES[o.type]}.
                    <br><br><strong>Example:</strong> <em>"${o.example}"</em></div>`;
            } else {
                const why = MISMATCH[`${t}>${o.type}`] || `A ${t} story ${TYPES[t]}, which does not address this concern.`;
                fb.innerHTML = `<div class="feedback bad"><strong>Not quite.</strong> This objection is better addressed with a <strong>${o.type}</strong> story. ${why}
                    <br><br><strong>Example ${o.type} story:</strong> <em>"${o.example}"</em></div>`;
            }
            next.classList.remove('hidden');
            app.querySelector('.progress').outerHTML = progressDots();
        });

        next.addEventListener('click', () => {
            index++;
            if (index < OBJECTIONS.length) renderObjection(); else renderSummary();
        });
    }

    function renderSummary() {
        const score = results.filter(Boolean).length;
        const rows = OBJECTIONS.map((o, i) => `
            <tr><td>${results[i] ? '<span class="mark-ok">&#10003;</span>' : '<span class="mark-bad">&#10007;</span>'} "${o.text}"</td>
            <td><strong>${o.type}</strong></td><td>${TYPES[o.type]}</td></tr>`).join('');
        app.innerHTML = `
            <h2>Objection Story Selector: Summary</h2>
            <p class="subtitle">First-try score: <strong>${score} of ${OBJECTIONS.length}</strong>${score === OBJECTIONS.length ? ' (mastery)' : ''}</p>
            <table class="summary">
                <tr><th>Objection</th><th>Story Type</th><th>What the story does</th></tr>
                ${rows}
            </table>
            <div class="feedback warn" style="margin-top:10px;"><strong>Why stories?</strong> Countering an objection directly invites a debate. A story provides social proof and concrete evidence at the same time, and lets the customer draw the conclusion.</div>
            <div class="btn-row"><button id="restart">Start Over</button></div>
        `;
        app.querySelector('#restart').addEventListener('click', () => {
            index = 0;
            results.length = 0;
            renderObjection();
        });
    }

    renderObjection();
});
