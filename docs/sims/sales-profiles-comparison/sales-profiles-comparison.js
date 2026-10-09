// Sales Profiles Comparison
// CANVAS_HEIGHT: 700

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('main');
    
    // Profile data
    const profiles = [
        {
            id: 'relationship',
            title: 'Relationship Builder',
            description: 'Focuses on building personal connections and rapport. High likability and customer satisfaction. Historically considered ideal but underperforms in complex consultative sales.',
            performance: 15,
            strength: 'Strong customer relationships',
            weakness: 'Avoids disruption, misses teaching opportunities'
        },
        {
            id: 'hardworker',
            title: 'Hard Worker',
            description: 'Succeeds through sheer effort and persistence. Makes more calls, attends more meetings, follows up diligently. Achieves respectable results but struggles to scale.',
            performance: 25,
            strength: 'High effort and dedication',
            weakness: 'Effort without insight has diminishing returns'
        },
        {
            id: 'lonewolf',
            title: 'Lone Wolf',
            description: 'Relies on exceptional individual capability and deep product knowledge. Technically brilliant but approach is idiosyncratic and non-scalable.',
            performance: 30,
            strength: 'Individual excellence',
            weakness: 'Approach doesn\'t transfer to others'
        },
        {
            id: 'reactive',
            title: 'Reactive Problem Solver',
            description: 'Excels at addressing customer requests and resolving issues. Responsive and service-oriented but struggles to drive proactive value.',
            performance: 20,
            strength: 'Reliable problem resolution',
            weakness: 'Reactive rather than proactive'
        },
        {
            id: 'challenger',
            title: 'Challenger',
            description: 'Combines deep customer knowledge with teaching, tailoring, and taking control. Nearly five times more likely to achieve high performance in complex sales.',
            performance: 70,
            strength: 'Teaches new perspectives, drives change',
            weakness: 'Requires skill development'
        }
    ];

    // Quiz questions
    const quizQuestions = [
        {
            question: 'Which profile is nearly five times more likely to achieve high performance in complex sales?',
            options: ['Relationship Builder', 'Hard Worker', 'Lone Wolf', 'Reactive Problem Solver', 'Challenger'],
            correct: 'Challenger',
            correctFeedback: 'Exactly! Challengers are nearly five times more likely to achieve high performance.',
            incorrectFeedback: 'Not quite. Challengers significantly outperform in complex sales.'
        },
        {
            question: 'Which profile focuses on building personal connections but underperforms in complex sales?',
            options: ['Relationship Builder', 'Hard Worker', 'Lone Wolf', 'Reactive Problem Solver', 'Challenger'],
            correct: 'Relationship Builder',
            correctFeedback: 'Right! Relationship Builders are likable but struggle with the disruption required in complex sales.',
            incorrectFeedback: 'Not quite. Relationship Builders focus on relationships but underperform in complex sales.'
        },
        {
            question: 'Which profile\'s approach is idiosyncratic and difficult to replicate across a team?',
            options: ['Relationship Builder', 'Hard Worker', 'Lone Wolf', 'Reactive Problem Solver', 'Challenger'],
            correct: 'Lone Wolf',
            correctFeedback: 'Correct! Lone Wolves are brilliant individually but their approach doesn\'t scale.',
            incorrectFeedback: 'Not quite. The Lone Wolf approach is idiosyncratic and non-scalable.'
        }
    ];

    let clickedProfiles = new Set();
    let currentQuestionIndex = 0;
    let score = 0;

    // Create header
    const header = document.createElement('div');
    header.innerHTML = `
        <h2 style="text-align: center; color: #1976d2; margin-bottom: 10px;">Sales Profiles Comparison</h2>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">Click each card to learn about the sales profiles.</p>
    `;
    container.appendChild(header);

    // Create cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.style.cssText = 'display: flex; justify-content: center; gap: 15px; margin-bottom: 30px; flex-wrap: wrap;';
    container.appendChild(cardsContainer);

    // Create profile cards
    profiles.forEach((profile, index) => {
        const card = document.createElement('div');
        card.id = `card-${profile.id}`;
        const bgColor = profile.id === 'challenger' ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' : 
                       'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        card.style.cssText = `
            width: 220px;
            padding: 15px;
            background: ${bgColor};
            border-radius: 12px;
            color: white;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        card.innerHTML = `
            <h3 style="margin: 0 0 10px 0; font-size: 1.1em;">${profile.title}</h3>
            <div id="content-${profile.id}" style="display: none;">
                <p style="font-size: 0.85em; line-height: 1.4; margin-bottom: 8px;">${profile.description}</p>
                <p style="font-size: 0.8em; margin-bottom: 5px;"><strong>High Performance Rate:</strong> ${profile.performance}%</p>
                <p style="font-size: 0.8em; margin-bottom: 5px;"><strong>Strength:</strong> ${profile.strength}</p>
                <p style="font-size: 0.8em;"><strong>Weakness:</strong> ${profile.weakness}</p>
            </div>
            <div id="icon-${profile.id}" style="text-align: center; font-size: 2em;">❓</div>
        `;
        
        card.addEventListener('click', () => {
            const content = document.getElementById(`content-${profile.id}`);
            const icon = document.getElementById(`icon-${profile.id}`);
            
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.style.display = 'none';
                clickedProfiles.add(profile.id);
                
                // Check if all cards clicked
                if (clickedProfiles.size === profiles.length) {
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
