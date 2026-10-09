// Challenger Principles Explorer
// CANVAS_HEIGHT: 650

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('main');
    
    // Principle data
    const principles = [
        {
            id: 'teach',
            title: 'Teach',
            description: 'Deliver insights that teach customers something new about their business. Focus on reframing problems, not just presenting solutions. Use data and research to back your claims.',
            example: 'A customer thinks their database is fine. You teach that 40% of their IT budget goes to maintaining brittle systems that block innovation.',
            outcome: 'Creates urgency'
        },
        {
            id: 'tailor',
            title: 'Tailor',
            description: 'Adapt your message to resonate with specific stakeholders. CFOs care about ROI. CTOs care about technical fit. CEOs care about strategic advantage. Emphasize different aspects of your insight for different audiences.',
            example: 'For the CFO, show the cost savings from faster development. For the CTO, show how the new architecture reduces technical debt.',
            outcome: 'Builds relevance'
        },
        {
            id: 'takecontrol',
            title: 'Take Control',
            description: 'Guide the customer toward a decision rather than waiting for them to navigate their own path. Propose clear next steps, create timelines, and provide structure. Don\'t ask "what next?"—propose what makes sense.',
            example: 'After the insight resonates, propose a 30-day pilot with clear success criteria, not just "let me know if you\'re interested."',
            outcome: 'Converts urgency into action'
        }
    ];

    // Quiz questions
    const quizQuestions = [
        {
            question: 'A customer doesn\'t recognize they have a problem. Which principle do you use first?',
            options: ['Teach', 'Tailor', 'Take Control'],
            correct: 'Teach',
            correctFeedback: 'Right! When customers don\'t see the problem, you must teach them about it first.',
            incorrectFeedback: 'Not quite. Teaching is about reframing problems customers don\'t recognize.'
        },
        {
            question: 'You\'ve delivered an insight that resonates, but the customer says "we need to think about it." Which principle do you apply now?',
            options: ['Teach', 'Tailor', 'Take Control'],
            correct: 'Take Control',
            correctFeedback: 'Yes! Taking control means proposing the next step rather than waiting.',
            incorrectFeedback: 'Not quite. Taking control provides structure to move the decision forward.'
        },
        {
            question: 'You\'re preparing for a meeting with the CFO. Which principle helps you decide what to emphasize?',
            options: ['Teach', 'Tailor', 'Take Control'],
            correct: 'Tailor',
            correctFeedback: 'Correct! Tailoring means emphasizing what matters most to the specific stakeholder.',
            incorrectFeedback: 'Not quite. Tailoring adapts the message to resonate with the stakeholder\'s priorities.'
        }
    ];

    let clickedPrinciples = new Set();
    let currentQuestionIndex = 0;
    let score = 0;

    // Create header
    const header = document.createElement('div');
    header.innerHTML = `
        <h2 style="text-align: center; color: #1976d2; margin-bottom: 10px;">Challenger Principles Explorer</h2>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">Click each card to learn about the Challenger principles.</p>
    `;
    container.appendChild(header);

    // Create cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.style.cssText = 'display: flex; justify-content: center; gap: 20px; margin-bottom: 30px; flex-wrap: wrap;';
    container.appendChild(cardsContainer);

    // Create principle cards
    principles.forEach((principle, index) => {
        const card = document.createElement('div');
        card.id = `card-${principle.id}`;
        card.style.cssText = `
            width: 250px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            color: white;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        card.innerHTML = `
            <h3 style="margin: 0 0 10px 0; font-size: 1.3em;">${principle.title}</h3>
            <div id="content-${principle.id}" style="display: none;">
                <p style="font-size: 0.9em; line-height: 1.4; margin-bottom: 10px;">${principle.description}</p>
                <p style="font-size: 0.85em; font-style: italic; margin-bottom: 10px;"><strong>Example:</strong> ${principle.example}</p>
                <p style="font-size: 0.85em; font-weight: bold; color: #ffd700;">${principle.outcome}</p>
            </div>
            <div id="icon-${principle.id}" style="text-align: center; font-size: 2em;">❓</div>
        `;
        
        card.addEventListener('click', () => {
            const content = document.getElementById(`content-${principle.id}`);
            const icon = document.getElementById(`icon-${principle.id}`);
            
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.style.display = 'none';
                clickedPrinciples.add(principle.id);
                
                // Check if all cards clicked
                if (clickedPrinciples.size === principles.length) {
                    setTimeout(showQuiz, 500);
                }
            }
        });

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 12px rgba(0,0,0,0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });

        cardsContainer.appendChild(card);
    });

    // Create quiz container (hidden initially)
    const quizContainer = document.createElement('div');
    quizContainer.id = 'quiz-container';
    quizContainer.style.cssText = 'display: none; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 12px;';
    container.appendChild(quizContainer);

    function showQuiz() {
        quizContainer.style.display = 'block';
        showQuestion(0);
    }

    function showQuestion(index) {
        if (index >= quizQuestions.length) {
            showResults();
            return;
        }

        const q = quizQuestions[index];
        quizContainer.innerHTML = `
            <h3 style="color: #1976d2; margin-bottom: 15px;">Question ${index + 1} of ${quizQuestions.length}</h3>
            <p style="font-size: 1.1em; margin-bottom: 20px;">${q.question}</p>
            <div id="options"></div>
            <div id="feedback" style="margin-top: 15px; padding: 10px; border-radius: 8px; display: none;"></div>
            <button id="next-btn" style="display: none; margin-top: 15px; padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer;">Next</button>
        `;

        const optionsContainer = document.getElementById('options');
        q.options.forEach(option => {
            const btn = document.createElement('button');
            btn.textContent = option;
            btn.style.cssText = `
                display: block;
                width: 100%;
                padding: 12px;
                margin-bottom: 10px;
                background: white;
                border: 2px solid #ddd;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1em;
                transition: background 0.2s;
            `;
            btn.addEventListener('mouseenter', () => btn.style.background = '#e3f2fd');
            btn.addEventListener('mouseleave', () => btn.style.background = 'white');
            btn.addEventListener('click', () => checkAnswer(option, q, index));
            optionsContainer.appendChild(btn);
        });
    }

    function checkAnswer(selected, question, index) {
        const feedback = document.getElementById('feedback');
        const nextBtn = document.getElementById('next-btn');
        const options = document.getElementById('options');
        
        // Disable all options
        options.querySelectorAll('button').forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'not-allowed';
            if (btn.textContent === question.correct) {
                btn.style.background = '#c8e6c9';
                btn.style.borderColor = '#4caf50';
            } else if (btn.textContent === selected && selected !== question.correct) {
                btn.style.background = '#ffcdd2';
                btn.style.borderColor = '#f44336';
            }
        });

        feedback.style.display = 'block';
        if (selected === question.correct) {
            score++;
            feedback.style.background = '#c8e6c9';
            feedback.textContent = question.correctFeedback;
        } else {
            feedback.style.background = '#ffcdd2';
            feedback.textContent = question.incorrectFeedback;
        }

        nextBtn.style.display = 'block';
        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        });
    }

    function showResults() {
        quizContainer.innerHTML = `
            <h3 style="color: #1976d2; margin-bottom: 15px;">Quiz Complete!</h3>
            <p style="font-size: 1.2em; margin-bottom: 20px;">Your score: ${score} out of ${quizQuestions.length}</p>
            <button id="retry-btn" style="padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer;">Retry Quiz</button>
        `;
        
        document.getElementById('retry-btn').addEventListener('click', () => {
            currentQuestionIndex = 0;
            score = 0;
            showQuestion(0);
        });
    }
});
