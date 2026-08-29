document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       MOBILE MENU
    ===================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");
    const navActions = document.querySelector(".nav-actions");

    if (menuToggle) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("mobile-open");

            navActions.classList.toggle("mobile-open");

            menuToggle.innerHTML = isOpen ? "✕" : "☰";

        });

    }


    /* =====================================
       CURRICULUM LINK
    ===================================== */

    const curriculumLink =
        document.querySelector(".curriculum-link");

    if (curriculumLink) {

        curriculumLink.addEventListener("click", function (event) {

            const target =
                document.querySelector("#curriculum");

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    }


    /* =====================================
       CTA HOVER EFFECT
    ===================================== */

    const primaryCTA =
        document.querySelector(".primary-cta");

    if (primaryCTA) {

        primaryCTA.addEventListener("mouseenter", function () {

            this.querySelector("span").style.transform =
                "translateX(5px)";

        });

        primaryCTA.addEventListener("mouseleave", function () {

            this.querySelector("span").style.transform =
                "translateX(0)";

        });

    }

// ================= JUMP-TO LINKS HIGHLIGHT =================

try {

    const jumpLinks = document.querySelectorAll('.jumpto-link');
    const nav = document.getElementById('jumpToNav');

    const sections = Array.from(jumpLinks)
        .map(link => {

            const id = link
                .getAttribute('href')
                .replace('#', '');

            const el = document.getElementById(id);

            if (!el) {
                console.warn(
                    'Jump-To: no section found with id="' +
                    id +
                    '" for link "' +
                    link.textContent.trim() +
                    '".'
                );
            }

            return el;

        })
        .filter(Boolean);


    /* =========================================
       SET ACTIVE LINK
    ========================================= */

    function setActive(id) {

        jumpLinks.forEach(link => {

            const linkId = link
                .getAttribute('href')
                .replace('#', '');

            link.classList.toggle(
                'active',
                linkId === id
            );

        });

    }


    /* =========================================
       FIND CURRENT SECTION
    ========================================= */

    function onScroll() {

        if (!nav || !sections.length) return;

        const navHeight = nav.offsetHeight;

        /*
         * Active detection line.
         *
         * This is slightly below the sticky navigation,
         * so the section currently passing underneath the
         * navigation becomes active.
         */

        const detectionPoint =
            navHeight + 120;


        let current = sections[0].id;


        sections.forEach(section => {

            const top =
                section.getBoundingClientRect().top;


            if (top <= detectionPoint) {

                current = section.id;

            }

        });


        setActive(current);

    }


    /* =========================================
       SMOOTH SCROLL STATE
    ========================================= */

    let isJumpScrolling = false;

    let jumpTarget = null;


    /* =========================================
       JUMP-TO CLICK
    ========================================= */

    jumpLinks.forEach(link => {

        link.addEventListener('click', function (e) {

            e.preventDefault();
            e.stopPropagation();


            const href =
                link.getAttribute('href');


            if (!href || !href.startsWith('#')) {
                return;
            }


            const id =
                href.substring(1);


            const target =
                document.getElementById(id);


            if (!target) {
                console.warn(
                    'Jump-To: target section not found:',
                    id
                );

                return;
            }


            /* ---------------------------------
               IMPORTANT:
               Immediately activate the clicked
               link AND its underline.
            --------------------------------- */

            setActive(id);


            /* ---------------------------------
               Tell scroll spy to temporarily
               leave the active link alone.
            --------------------------------- */

            isJumpScrolling = true;

            jumpTarget = target;


            const navHeight =
                nav.offsetHeight;


            const offset =
                navHeight + 90;


            const targetTop =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                offset;


            window.scrollTo({

                top: Math.max(0, targetTop),

                behavior: 'smooth'

            });

        });

    });


    /* =========================================
       SCROLL HANDLER
    ========================================= */

    window.addEventListener(
        'scroll',
        function () {

            /*
             * If we're currently performing a
             * Jump-To smooth scroll, don't let
             * the scroll spy change the active
             * link.
             */

            if (isJumpScrolling && jumpTarget) {

                const navHeight =
                    nav.offsetHeight;

                const targetPosition =
                    navHeight + 90;


                const targetTop =
                    jumpTarget
                        .getBoundingClientRect()
                        .top;


                /*
                 * Once the target section reaches
                 * approximately the position where
                 * the click should place it, release
                 * the scroll lock.
                 */

                if (
                    Math.abs(
                        targetTop - targetPosition
                    ) < 8
                ) {

                    isJumpScrolling = false;

                    setActive(
                        jumpTarget.id
                    );

                    jumpTarget = null;

                }

                return;
            }


            /* Normal manual scrolling */

            onScroll();

        },
        {
            passive: true
        }
    );


    /* =========================================
       INITIAL STATE
    ========================================= */

    onScroll();


} catch (err) {

    console.error(
        'Jump-To Links script failed:',
        err
    );

}

});

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", function () {

        const isOpen = navLinks.classList.toggle("active");

        menuToggle.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    });

    navLinks.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

});

/* =========================================
   SKILLS CAROUSEL
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const track = document.querySelector(".skills-track-wrap");
    const cards = document.querySelectorAll(".skill-card");

    const prevBtn = document.getElementById("skillsPrev");
    const nextBtn = document.getElementById("skillsNext");

    if (!track || !cards.length || !prevBtn || !nextBtn) return;

    let currentCard = 0;

    function isMobile() {
        return window.innerWidth <= 900;
    }

    function updateMobileSlider() {

        if (!isMobile()) return;

        cards.forEach((card, index) => {
            card.style.transform =
                `translateX(-${currentCard * 100}%)`;
        });

        prevBtn.disabled = currentCard === 0;
        nextBtn.disabled = currentCard === cards.length - 1;
    }

    prevBtn.addEventListener("click", function () {

        if (!isMobile()) return;

        if (currentCard > 0) {
            currentCard--;
            updateMobileSlider();
        }

    });

    nextBtn.addEventListener("click", function () {

        if (!isMobile()) return;

        if (currentCard < cards.length - 1) {
            currentCard++;
            updateMobileSlider();
        }

    });

    window.addEventListener("resize", function () {

        if (isMobile()) {
            updateMobileSlider();
        } else {
            cards.forEach(card => {
                card.style.transform = "";
            });
        }

    });

    updateMobileSlider();

});