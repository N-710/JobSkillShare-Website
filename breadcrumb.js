/* =========================================================
   JOBSKILLSHARE - FINAL DYNAMIC BREADCRUMB SYSTEM
========================================================= */

(function () {

    /* =====================================================
       PROGRAMS AND THEIR COURSES
       Filenames are lowercase for matching.
    ===================================================== */

    const programs = {

        "it.html": {
            name: "IT Support Certificate Program",
            courses: [
                "it-1.html",
                "it-2.html",
                "it-active.html",
                "it-people.html",
                "it-resume.html"
            ]
        },

        "cyber.html": {
            name: "Cybersecurity Analyst Certificate Program",
            courses: [
                "cyber-networking.html",
                "comptia-lin.html",
                "comptia-sec1.html",
                "comptia-sec2.html",
                "cyber-technical.html"
            ]
        },

        "systems.html": {
            name: "Systems Engineer Certificate Program",
            courses: [
                "network-sa.html",
                "windows-server.html",
                "cloud-admin.html",
                "comptia-lin.html",
                "power-shell.html"
            ]
        },

        "azure.html": {
            name: "Azure Cloud Engineer Certificate Program",
            courses: [
                "mic-azure.html",
                "azure-devops.html"
            ]
        },

        "aws.html": {
            name: "AWS Cloud Engineer Certificate Program",
            courses: [
                "aws-ca.html",
                "aws-ca-adv.html",
                "aws-devops.html"
            ]
        },

        "cisco.html": {
            name: "Cisco Network Engineer Certificate Program",
            courses: [
                "network-sa.html",
                "cisco-networking.html",
                "cisco-ccna.html"
            ]
        },

        "freelance.html": {
            name: "Become a Freelancer Skills-to-Income Program",
            courses: [
                "freelancing.html",
                "freelancing-playbook.html"
            ]
        },

        "ai.html": {
            name: "AI Engineering Certificate Program",
            courses: [
                "python-ai.html"
            ]
        }

    };


    /* =====================================================
       GET PAGE FILENAME
    ===================================================== */

    function getPageName(url) {

        if (!url) return "";

        try {

            const parsed = new URL(url, window.location.href);

            return decodeURIComponent(
                parsed.pathname.split("/").pop()
            ).toLowerCase();

        } catch (error) {

            return "";

        }

    }


    const currentPage = getPageName(window.location.href);


    /* =====================================================
       IMPORTANT:
       SAVE WHERE USER CLICKS FROM

       This runs on EVERY page.

       Example:
       Courses.html → AWS-CA.html

       saves:
       courses.html
    ===================================================== */

    document.addEventListener("click", function (event) {

        const link = event.target.closest("a");

        if (!link) return;

        const href = link.getAttribute("href");

        if (!href) return;

        /*
           Ignore anchors, javascript links,
           mailto, tel and external URLs.
        */

        if (
            href.startsWith("#") ||
            href.startsWith("javascript:") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
        ) {
            return;
        }


        try {

            const targetURL =
                new URL(href, window.location.href);

            /*
               Only track pages from the same website.
            */

            if (targetURL.origin !== window.location.origin) {
                return;
            }


            const targetPage =
                getPageName(targetURL.href);


            if (!targetPage) return;


            /*
               Remember exactly which page the user
               is navigating FROM.
            */

            sessionStorage.setItem(
                "breadcrumbFromPage",
                currentPage
            );


            /*
               If currently on a program page,
               remember that program as well.
            */

            if (programs[currentPage]) {

                sessionStorage.setItem(
                    "breadcrumbProgramPage",
                    currentPage
                );

                sessionStorage.setItem(
                    "breadcrumbProgramName",
                    programs[currentPage].name
                );

            }

        } catch (error) {

            console.warn(
                "Breadcrumb navigation tracking failed:",
                error
            );

        }

    });


    /* =====================================================
       WAIT UNTIL PAGE HTML EXISTS
    ===================================================== */

    document.addEventListener("DOMContentLoaded", function () {

        const breadcrumb =
            document.getElementById("dynamicBreadcrumb");


        /*
           Some pages like Courses.html may not have
           a breadcrumb.

           DO NOT return before the click-tracking code
           above — that was one problem with the old version.
        */

        if (!breadcrumb) return;

/* =========================================================
   MAIN COURSES PAGE
   Always: Home › Courses
========================================================= */

if (currentPage === "courses.html") {

    breadcrumb.innerHTML = `
        <a href="index.html">Home</a>
        <span>›</span>
        <strong>Courses</strong>
    `;

    sessionStorage.removeItem("breadcrumbFromPage");
    sessionStorage.removeItem("breadcrumbProgramPage");
    sessionStorage.removeItem("breadcrumbProgramName");
    sessionStorage.removeItem("breadcrumbProgramSource");

    return;
}


/* =========================================================
   MAIN PROGRAMS PAGE
   Always: Home › Certificate Programs
========================================================= */

if (currentPage === "programs.html") {

    breadcrumb.innerHTML = `
        <a href="index.html">Home</a>
        <span>›</span>
        <strong>Certificate Programs</strong>
    `;

    sessionStorage.removeItem("breadcrumbFromPage");
    sessionStorage.removeItem("breadcrumbProgramPage");
    sessionStorage.removeItem("breadcrumbProgramName");
    sessionStorage.removeItem("breadcrumbProgramSource");

    return;
}
        /* =================================================
           GET PAGE TITLE
        ================================================= */

        const heading =
            document.querySelector("h1");

        const currentTitle =
            heading
                ? heading.textContent.trim()
                : document.title;


        /* =================================================
           GET SAVED SOURCE PAGE
        ================================================= */

        let fromPage =
            sessionStorage.getItem(
                "breadcrumbFromPage"
            ) || "";


        /*
           Fallback to document.referrer only when there
           is no saved click source.
        */

        if (!fromPage && document.referrer) {

            fromPage =
                getPageName(document.referrer);

        }


        /* =================================================
           FIND CURRENT PROGRAM PAGE
        ================================================= */

        const isProgramPage =
            Boolean(programs[currentPage]);


        /* =================================================
           FIND PROGRAMS CURRENT COURSE BELONGS TO
        ================================================= */

        function getProgramsForCourse(coursePage) {

            const matches = [];

            for (
                const [programPage, data]
                of Object.entries(programs)
            ) {

                if (
                    data.courses.includes(coursePage)
                ) {

                    matches.push({
                        page: programPage,
                        name: data.name
                    });

                }

            }

            return matches;

        }


        const coursePrograms =
            getProgramsForCourse(currentPage);

        const isCoursePage =
            coursePrograms.length > 0;


        /* =================================================
           WAS PREVIOUS PAGE A PROGRAM?
        ================================================= */

        const previousProgram =
            programs[fromPage]
                ? {
                    page: fromPage,
                    name: programs[fromPage].name,
                    courses: programs[fromPage].courses
                }
                : null;


        /* =================================================
           START BREADCRUMB
        ================================================= */

        let html = `
            <a href="index.html">Home</a>
            <span>›</span>
        `;


        /* =================================================
           CASE 1
           COURSES → COURSE

           THIS HAS HIGHEST PRIORITY.

           Home › Courses › Course
        ================================================= */

        if (
            fromPage === "courses.html"
        ) {

            html += `
                <a href="Courses.html">
                    Courses
                </a>

                <span>›</span>

                <strong>
                    ${currentTitle}
                </strong>
            `;

        }


        /* =================================================
           CASE 2
           PROGRAMS → PROGRAM

           Home › Certificate Programs › Program
        ================================================= */

        else if (
            fromPage === "programs.html" &&
            isProgramPage
        ) {

            html += `
                <a href="Programs.html">
                    Certificate Programs
                </a>

                <span>›</span>

                <strong>
                    ${currentTitle}
                </strong>
            `;

        }


        /* =================================================
           CASE 3
           PROGRAM → COURSE

           Automatically handles courses in
           multiple programs.

           Example:

           cyber.html → compTIA-Lin.html

           Systems.html → compTIA-Lin.html
        ================================================= */

        else if (
            previousProgram &&
            isCoursePage &&
            previousProgram.courses.includes(
                currentPage
            )
        ) {

            html += `
                <a href="Programs.html">
                    Certificate Programs
                </a>

                <span>›</span>

                <a href="${previousProgram.page}">
                    ${previousProgram.name}
                </a>

                <span>›</span>

                <strong>
                    ${currentTitle}
                </strong>
            `;

        }


        /* =================================================
           CASE 4
           HOMEPAGE → PROGRAM

           Home › Program
        ================================================= */

        else if (
            fromPage === "index.html" &&
            isProgramPage
        ) {

            html += `
                <strong>
                    ${currentTitle}
                </strong>
            `;

        }


        /* =================================================
           CASE 5
           HOMEPAGE → COURSE

           Home › Course
        ================================================= */

        else if (
            fromPage === "index.html" &&
            isCoursePage
        ) {

            html += `
                <strong>
                    ${currentTitle}
                </strong>
            `;

        }


        /* =================================================
           CASE 6
           DIRECT OPEN / UNKNOWN SOURCE

           Home › Current Page
        ================================================= */

        else {

            html += `
                <strong>
                    ${currentTitle}
                </strong>
            `;

        }


        /* =================================================
           DISPLAY
        ================================================= */

        breadcrumb.innerHTML = html;


        /* =================================================
           CLEAR SOURCE AFTER IT HAS BEEN USED

           Prevents stale breadcrumb routes carrying
           over to unrelated navigation.
        ================================================= */

        sessionStorage.removeItem(
            "breadcrumbFromPage"
        );

    });

})();