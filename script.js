// Game variables
let score = 0;
let level = 1;
let currentNum1 = 0;
let currentNum2 = 0;
let correctAnswer = 0;

// Problems for each level (from easy/common HCF to tricky/larger numbers)
const problems = [
    // Level 1 - Small numbers, both changing
    [8, 15],   // HCF: 1
    [12, 16],  // HCF: 4
    [18, 24],  // HCF: 6
    [9, 21],   // HCF: 3
    [14, 20],  // HCF: 2
    [16, 28],  // HCF: 4

    // Level 2 - Medium numbers, more variation
    [27, 36],  // HCF: 9
    [25, 45],  // HCF: 5
    [30, 42],  // HCF: 6
    [33, 44],  // HCF: 11
    [32, 56],  // HCF: 8
    [39, 65],  // HCF: 13

    // Level 3 - Larger numbers, visual and numeric change
    [48, 81],  // HCF: 3
    [56, 96],  // HCF: 8
    [60, 84],  // HCF: 12
    [63, 90],  // HCF: 9
    [72, 108], // HCF: 36
    [77, 99]   // HCF: 11
];



let currentProblemIndex = 0;

// Start game
document.getElementById('startBtn').addEventListener('click', function () {
    document.getElementById('tutorial').classList.add('hidden');
    document.getElementById('gameScreen').classList.add('active');
    loadProblem();
});

// Load a new problem
function loadProblem() {
    // Reset display
    document.getElementById('hintBox').classList.remove('show');
    document.getElementById('hintBox').innerHTML = '';
    document.getElementById('result').classList.remove('show');
    document.getElementById('nextBtn').classList.remove('show');

    // Get problem
    const problem = problems[currentProblemIndex];
    currentNum1 = problem[0];
    currentNum2 = problem[1];
    correctAnswer = findHCF(currentNum1, currentNum2);

    // Update display
    document.getElementById('label1').textContent = currentNum1 + ' Liters';
    document.getElementById('label2').textContent = currentNum2 + ' Liters';

    // Fill water containers (visual representation)
    const maxHeight = 250;
    const maxNum = Math.max(currentNum1, currentNum2);

    const height1 = (currentNum1 / maxNum) * maxHeight;
    const height2 = (currentNum2 / maxNum) * maxHeight;

    document.getElementById('water1').style.height = height1 + 'px';
    document.getElementById('water2').style.height = height2 + 'px';

    // Generate bucket options
    generateBuckets();

    // Update score display
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
}

// Calculate HCF using simple method
function findHCF(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Get all factors of a number
function getFactors(num) {
    const factors = [];
    for (let i = 1; i <= num; i++) {
        if (num % i === 0) {
            factors.push(i);
        }
    }
    return factors;
}

// Generate bucket size options
function generateBuckets() {
    const container = document.getElementById('bucketOptions');
    container.innerHTML = '';

    // Get factors
    const factors1 = getFactors(currentNum1);
    const factors2 = getFactors(currentNum2);
    const commonFactors = factors1.filter(f => factors2.includes(f));

    // Create options (mix of common and uncommon factors)
    let options = [...commonFactors];

    // Add some wrong options
    const wrongOptions = factors1.filter(f => !commonFactors.includes(f));
    options = options.concat(wrongOptions.slice(0, 2));

    // Shuffle
    options = options.sort(() => Math.random() - 0.5);

    // Create buttons
    options.forEach(size => {
        const btn = document.createElement('button');
        btn.className = 'bucket-btn';
        btn.textContent = size;
        btn.addEventListener('click', () => checkAnswer(size, btn));
        container.appendChild(btn);
    });
}

// Check if answer is correct
function checkAnswer(selected, button) {
    // Disable all buttons
    const allButtons = document.querySelectorAll('.bucket-btn');
    allButtons.forEach(btn => btn.disabled = true);

    const resultDiv = document.getElementById('result');

    if (selected === correctAnswer) {
        // Correct answer
        button.classList.add('correct');
        score += 10;
        resultDiv.className = 'result show correct';
        resultDiv.innerHTML = `
            🎉 Excellent! ${correctAnswer} liters is correct!<br><br>
            ${currentNum1} ÷ ${correctAnswer} = ${currentNum1 / correctAnswer} buckets ✓<br>
            ${currentNum2} ÷ ${correctAnswer} = ${currentNum2 / correctAnswer} buckets ✓
        `;

        // Level up every 3 correct answers
        if ((currentProblemIndex + 1) % 3 === 0) {
            level++;
        }
    } else {
        // Wrong answer
        button.classList.add('wrong');
        resultDiv.className = 'result show wrong';
        resultDiv.innerHTML = `
            ❌ Not quite! The correct answer is ${correctAnswer} liters.<br><br>
            ${correctAnswer} is the BIGGEST number that divides both ${currentNum1} and ${currentNum2} perfectly!
        `;

        // Highlight correct answer
        allButtons.forEach(btn => {
            if (parseInt(btn.textContent) === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }

    // Show next button
    document.getElementById('nextBtn').classList.add('show');
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
}

// Show hint
document.getElementById('hintBtn').addEventListener('click', function () {
    const hintBox = document.getElementById('hintBox');

    if (hintBox.classList.contains('show')) {
        // Show more detailed hint
        const factors1 = getFactors(currentNum1);
        const factors2 = getFactors(currentNum2);
        const commonFactors = factors1.filter(f => factors2.includes(f));

        hintBox.innerHTML = `
            <p><strong>Step-by-step hint:</strong></p>
            <p>1. Factors of ${currentNum1}: ${factors1.join(', ')}</p>
            <p>2. Factors of ${currentNum2}: ${factors2.join(', ')}</p>
            <p>3. Common factors: ${commonFactors.join(', ')}</p>
            <p>4. The BIGGEST common factor is: <strong style="color: green; font-size: 1.2em;">${correctAnswer}</strong></p>
        `;
    } else {
        // Show simple hint
        hintBox.innerHTML = `
            <p><strong>💡 Hint:</strong></p>
            <p>Think: Which bucket size can measure both ${currentNum1}L and ${currentNum2}L with NO water left over?</p>
            <p>Try dividing both numbers by each bucket size!</p>
            <p><em>Click hint again for detailed help...</em></p>
        `;
        hintBox.classList.add('show');
    }
});

// Next problem
document.getElementById('nextBtn').addEventListener('click', function () {
    currentProblemIndex++;

    // Check if we finished all problems
    if (currentProblemIndex >= problems.length) {
        currentProblemIndex = 0; // Start over
    }

    loadProblem();
});