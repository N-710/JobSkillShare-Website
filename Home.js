document.addEventListener('DOMContentLoaded', function () {

    // ================= Learning Path Helper =================
    const learningInput = document.getElementById('learning-input');
    const findPathBtn = document.getElementById('find-path-btn');
    const helperResult = document.getElementById('helper-result');
    const resultExplanation = document.getElementById('result-explanation');
    const resultPrograms = document.getElementById('result-programs');
    const resultFollowup = document.getElementById('result-followup');
    const helperChips = document.querySelectorAll('.helper-chip');

    if (!learningInput || !findPathBtn || !helperResult) return;

    // ---- Program catalog: matches your actual Programs section ----
    const programCatalog = {
        itSupport: { name: 'IT Support Certificate Program', href: 'IT.html' },
        systemsEngineer: { name: 'Systems Engineer Certificate Program', href: 'systems.html' },
        cloudEngineer: { name: 'AWS Cloud Engineer Certificate Program', href: 'aws.html' },
        cybersecurity: { name: 'Cybersecurity Analyst Certificate Program', href: 'cyber.html' },
        aiEngineering: { name: 'AI Engineering & Automation Certificate Program', href: 'ai.html' },
        freelancer: { name: 'Freelancer Certificate Program', href: 'freeLance.html' }
    };

    // ---- Scenario rules: keyword sets → explanation + program list + follow-up question ----
    const scenarios = [
        {
            id: 'cybersecurity',
            keywords: ['cyber', 'security analyst', 'soc', 'penetration', 'pentest', 'ethical hacking'],
            explanation: "Start with the IT Support Certificate Program to build a solid foundation in networking, security, and system management skills. This will support your career progression toward the Cybersecurity Analyst path, which builds directly on those fundamentals.",
            programs: ['itSupport', 'cybersecurity'],
            followup: "What specific area of cybersecurity interests you most — network defense, SOC analysis, or penetration testing?"
        },
        {
            id: 'cloud',
            keywords: ['cloud', 'aws', 'azure', 'gcp', 'devops'],
            explanation: "If you're aiming for cloud roles, begin with IT Support fundamentals to understand systems and networking, then move into the Cloud Engineer Certificate Program, which covers AWS, Azure, and automation skills employers look for.",
            programs: ['itSupport', 'cloudEngineer'],
            followup: "Are you more interested in AWS, Azure, or general cloud automation?"
        },
        {
            id: 'systemsNetworking',
            keywords: ['system', 'network', 'sysadmin', 'infrastructure', 'server', 'cisco'],
            explanation: "If you are new to IT or recently started, begin with the IT Support Certificate Program because IT support builds the foundation for advanced systems and networking work; Systems Administrator and Systems Engineer are advanced roles, not typical first IT jobs. If you already understand IT systems, continue with the Systems Engineer Certificate Program for Windows Server administration and enterprise infrastructure, then use the Cisco Network Engineer Certificate Program for enterprise networking knowledge. When moving from IT support toward systems administration, take Network & Systems Administration Core Skills as a bridge course.",
            programs: ['itSupport', 'systemsEngineer', 'cybersecurity'],
            followup: "Have you already completed any IT support experience, or would you be starting from scratch?"
        },
        {
            id: 'aiAutomation',
            keywords: ['ai', 'artificial intelligence', 'genai', 'automation', 'machine learning', 'agent', 'python'],
            explanation: "For AI and automation roles, a foundation in IT support and general systems knowledge is helpful, but the core path is the AI Engineering & Automation Certificate Program, which covers Python, data handling, GenAI tools, and building automated agents.",
            programs: ['itSupport', 'aiEngineering'],
            followup: "Do you already have experience with Python, or would you be starting as a complete beginner?"
        },
        {
            id: 'freelancing',
            keywords: ['freelance', 'fiverr', 'upwork', 'remote work', 'gig'],
            explanation: "If your goal is freelancing or remote gig work rather than a traditional job, the Freelancer Certificate Program is the most direct path — it covers building a professional profile, communicating with clients, and delivering work professionally on platforms like Fiverr and Upwork.",
            programs: ['freelancer'],
            followup: "Do you already have a specific skill you plan to freelance in, like IT support, design, or writing?"
        },
        {
            id: 'csStudent',
            keywords: ['cs student', 'computer science', 'university', 'college', 'degree', 'strengthen my career', 'strengthen my resume'],
            explanation: "As a CS student, formal coursework often skips practical, job-ready skills. Start with the IT Support Certificate Program to build a solid foundation in networking, security, and system management skills. This will support your career progression towards advanced IT roles like Cloud Engineer, Cybersecurity Analyst, or AI Engineer once you've established those fundamentals.",
            programs: ['itSupport', 'cybersecurity', 'cloudEngineer'],
            followup: "What specific area of computer science interests you the most?"
        },
        {
            id: 'newToIT',
            keywords: ['new to it', 'beginner', 'no experience', 'helpdesk', 'help desk', 'support'],
            explanation: "Welcome! The best starting point for anyone new to IT is the IT Support Certificate Program. It covers operating systems, hardware, Active Directory, Microsoft 365, and troubleshooting — the core skills nearly every IT job builds on, and it's designed for people with no prior background.",
            programs: ['itSupport'],
            followup: "Are you hoping to work remotely, in-office, or are you open to either?"
        }
    ];

    // Fallback if nothing matches
    const defaultScenario = {
        explanation: "Based on what you've shared, the best starting point is the IT Support Certificate Program. It builds the core foundation — operating systems, networking, troubleshooting, and Microsoft 365 — that nearly every other IT career path builds on, whether you move toward Cloud, Cybersecurity, or Systems Engineering next.",
        programs: ['itSupport'],
        followup: "Could you tell us a bit more about the specific role or skill you're aiming for?"
    };

    // Fill textarea when a chip is clicked
    helperChips.forEach(chip => {
        chip.addEventListener('click', () => {
            learningInput.value = chip.dataset.fill;
            learningInput.focus();
            helperChips.forEach(c => c.classList.remove('chip-active'));
            chip.classList.add('chip-active');
        });
    });

    // Match input text against scenario keyword sets
    function matchScenario(text) {
        const lower = text.toLowerCase();
        for (const scenario of scenarios) {
            if (scenario.keywords.some(keyword => lower.includes(keyword))) {
                return scenario;
            }
        }
        return defaultScenario;
    }

    // Render explanation + clickable program links + follow-up question
    function renderResult(scenario) {
        resultExplanation.textContent = scenario.explanation;

        resultPrograms.innerHTML = scenario.programs
            .map(key => {
                const prog = programCatalog[key];
                if (!prog) return '';
                return `<a href="${prog.href}" class="result-program-link">${prog.name}</a>`;
            })
            .join('');

        resultFollowup.textContent = scenario.followup;
    }

    // Handle submit
    findPathBtn.addEventListener('click', () => {
        const value = learningInput.value.trim();

        if (value === '') {
            learningInput.focus();
            learningInput.style.borderColor = '#FF5F57';
            learningInput.placeholder = 'Please tell us what you want to learn first...';
            setTimeout(() => { learningInput.style.borderColor = '#D8E0EA'; }, 1500);
            return;
        }

        const matched = matchScenario(value);
        renderResult(matched);

        helperResult.classList.add('active');

        setTimeout(() => {
            helperResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
    });

    // Enter key submits (Shift+Enter for newline)
    learningInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            findPathBtn.click();
        }
    });

const logoLink = document.getElementById('logo-link');
if (logoLink) {
    logoLink.addEventListener('click', (e) => {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'Home.html' || currentPage === '') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // On Programs.html or IT Support.html, this does nothing —
        // browser navigates normally to Home.html
    });
}


  
});

/* =========================================================
   MOBILE REVIEW CAROUSEL
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const reviewSlider = document.querySelector(".ls-grid");
    const reviewCards = document.querySelectorAll(".ls-card");
    const reviewDots = document.querySelectorAll(".review-dot");

    if (!reviewSlider || !reviewCards.length || !reviewDots.length) {
        return;
    }

    /* Click dots */

    reviewDots.forEach((dot, index) => {

        dot.addEventListener("click", function () {

            const card = reviewCards[index];

            if (!card) return;

            reviewSlider.scrollTo({
                left: card.offsetLeft,
                behavior: "smooth"
            });

            reviewDots.forEach(d => {
                d.classList.remove("active");
            });

            dot.classList.add("active");

        });

    });


    /* Update active dot while swiping */

    reviewSlider.addEventListener("scroll", function () {

        const sliderPosition = reviewSlider.scrollLeft;

        let closestIndex = 0;
        let closestDistance = Infinity;

        reviewCards.forEach((card, index) => {

            const distance = Math.abs(
                card.offsetLeft - sliderPosition
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }

        });

        reviewDots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === closestIndex
            );

        });

    });

});


document.addEventListener("DOMContentLoaded", function () {

    const helperSuggestion = document.getElementById("helperSuggestion");
    const helperTextarea = document.querySelector(".helper-textarea");

    const helperResult = document.getElementById("helper-result");
    const resultExplanation = document.getElementById("result-explanation");
    const resultPrograms = document.getElementById("result-programs");
    const resultFollowup = document.getElementById("result-followup");

    if (helperSuggestion && helperTextarea) {

        helperSuggestion.addEventListener("change", function () {

            if (this.value !== "") {

                helperTextarea.value = this.value;
                helperTextarea.focus();

                // Hide previous results until Find My Learning Path is clicked
                helperResult.classList.remove("active");

                // Clear previous results
                resultExplanation.textContent = "";
                resultPrograms.innerHTML = "";
                resultFollowup.textContent = "";

                helperTextarea.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        });

        // Clear previous results when the user starts entering a new prompt
        helperTextarea.addEventListener("input", function () {

            helperResult.classList.remove("active");

            resultExplanation.textContent = "";
            resultPrograms.innerHTML = "";
            resultFollowup.textContent = "";

        });

    }

});