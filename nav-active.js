document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll(".nav-links a");

    function clearActiveLinks() {
        navLinks.forEach(link => {
            link.classList.remove("active");
        });
    }

    function setActiveLink(page) {
        clearActiveLinks();

        const activeLink = document.querySelector(
            `.nav-links a[data-page="${page}"]`
        );

        if (activeLink) {
            activeLink.classList.add("active");
        }
    }


    /* =========================================
       GET CURRENT PAGE
    ========================================= */

    let currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    if (currentPage === "") {
        currentPage = "index.html";
    }


    /* =========================================
       HOME PAGE
    ========================================= */

    if (currentPage === "index.html") {

        setActiveLink("home");

        const communitySection =
            document.getElementById("community");

        if (communitySection) {

            const observer = new IntersectionObserver(
                function (entries) {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {
                            setActiveLink("community");
                        } else {
                            setActiveLink("home");
                        }

                    });

                },
                {
                    threshold: 0.30
                }
            );

            observer.observe(communitySection);
        }
    }


    /* =========================================
       PROGRAMS MAIN PAGE
    ========================================= */

    else if (currentPage === "programs.html") {

        setActiveLink("programs");

    }


    /* =========================================
       COURSES MAIN PAGE
    ========================================= */

    else if (currentPage === "courses.html") {

        setActiveLink("courses");

    }


    /* =========================================
       REVIEWS MAIN PAGE
    ========================================= */

    else if (currentPage === "review.html") {

        setActiveLink("reviews");

    }


    /* =========================================
       DETAIL PAGES
    ========================================= */

    else {

        clearActiveLinks();

    }

});