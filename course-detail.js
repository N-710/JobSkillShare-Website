document.addEventListener("DOMContentLoaded", function () {

  /* =======================================================
     NAVBAR SHADOW
  ======================================================= */

  const navbar = document.getElementById("navbar");

  function updateNavbar() {
    if (!navbar) return;

    navbar.classList.toggle(
      "scrolled",
      window.scrollY > 8
    );
  }

  updateNavbar();

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );


  /* =======================================================
     CURRICULUM ACCORDION
  ======================================================= */

  const curriculumItems =
    document.querySelectorAll(".curriculum-item");

  curriculumItems.forEach(function (item) {

    const toggle =
      item.querySelector(".curriculum-toggle");

    if (!toggle) return;

    toggle.addEventListener(
      "click",
      function () {

        const isOpen =
          item.classList.contains("open");

        item.classList.toggle(
          "open",
          !isOpen
        );

        toggle.setAttribute(
          "aria-expanded",
          String(!isOpen)
        );

      }
    );

  });


  /* =======================================================
     FAQ ACCORDION
     ONLY ONE FAQ OPEN AT A TIME
  ======================================================= */

  const faqItems =
    document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {

    const toggle =
      item.querySelector(".faq-toggle");

    const symbol =
      item.querySelector(".faq-plus");

    if (!toggle) return;

    toggle.addEventListener(
      "click",
      function () {

        const willOpen =
          !item.classList.contains("open");


        /* Close all FAQs */

        faqItems.forEach(
          function (otherItem) {

            otherItem.classList.remove(
              "open"
            );

            const otherToggle =
              otherItem.querySelector(
                ".faq-toggle"
              );

            const otherSymbol =
              otherItem.querySelector(
                ".faq-plus"
              );

            if (otherToggle) {

              otherToggle.setAttribute(
                "aria-expanded",
                "false"
              );

            }

            if (otherSymbol) {

              otherSymbol.textContent =
                "+";

            }

          }
        );


        /* Open clicked FAQ */

        if (willOpen) {

          item.classList.add(
            "open"
          );

          toggle.setAttribute(
            "aria-expanded",
            "true"
          );

          if (symbol) {

            symbol.textContent =
              "−";

          }

        }

      }
    );

  });


  /* =======================================================
     LEARNER REVIEWS SLIDER
  ======================================================= */

  const reviewTrack =
    document.getElementById("reviewTrack");

  const reviewSlides =
    Array.from(
      document.querySelectorAll(
        ".review-slide"
      )
    );

  const reviewDots =
    Array.from(
      document.querySelectorAll(
        ".review-slider-dot"
      )
    );


  let currentReviewSlide = 0;

  let reviewTouchStartX = 0;
  let reviewTouchEndX = 0;


  /* -------------------------------------------------------
     SHOW SELECTED REVIEW
  ------------------------------------------------------- */

  function showReviewSlide(index) {

    if (
      !reviewTrack ||
      !reviewSlides.length
    ) {
      return;
    }


    /* Prevent going outside available reviews */

    currentReviewSlide =
      Math.max(
        0,
        Math.min(
          index,
          reviewSlides.length - 1
        )
      );


    /* Move review track */

    reviewTrack.style.transform =
      `translateX(-${currentReviewSlide * 100}%)`;


    /* Update dots */

    reviewDots.forEach(
      function (dot, dotIndex) {

        dot.classList.toggle(
          "active",
          dotIndex === currentReviewSlide
        );

        dot.setAttribute(
          "aria-current",
          dotIndex === currentReviewSlide
            ? "true"
            : "false"
        );

      }
    );

  }


  /* =======================================================
     REVIEW DOT CLICK
  ======================================================= */

  reviewDots.forEach(
    function (dot) {

      dot.addEventListener(
        "click",
        function () {

          const slideIndex =
            Number(
              this.dataset.reviewSlide
            );

          showReviewSlide(
            slideIndex
          );

        }
      );

    }
  );


  /* =======================================================
     MOBILE SWIPE SUPPORT
  ======================================================= */

  if (reviewTrack) {

    reviewTrack.addEventListener(
      "touchstart",
      function (event) {

        reviewTouchStartX =
          event.changedTouches[0]
            .clientX;

      },
      { passive: true }
    );


    reviewTrack.addEventListener(
      "touchend",
      function (event) {

        reviewTouchEndX =
          event.changedTouches[0]
            .clientX;


        const difference =
          reviewTouchStartX -
          reviewTouchEndX;


        /* Ignore very small finger movements */

        if (
          Math.abs(difference) < 45
        ) {
          return;
        }


        /* -----------------------------------------------
           Swipe Left → Next Review
        ----------------------------------------------- */

        if (
          difference > 0 &&
          currentReviewSlide <
          reviewSlides.length - 1
        ) {

          showReviewSlide(
            currentReviewSlide + 1
          );

        }


        /* -----------------------------------------------
           Swipe Right → Previous Review
        ----------------------------------------------- */

        if (
          difference < 0 &&
          currentReviewSlide > 0
        ) {

          showReviewSlide(
            currentReviewSlide - 1
          );

        }

      },
      { passive: true }
    );

  }


  /* =======================================================
     KEYBOARD SUPPORT FOR REVIEW SLIDER
  ======================================================= */

  document.addEventListener(
    "keydown",
    function (event) {

      /*
        Only control reviews when the reviews section
        is reasonably close to the viewport.
      */

      const reviewsSection =
        document.getElementById("reviews");

      if (!reviewsSection) return;


      const rect =
        reviewsSection.getBoundingClientRect();

      const reviewIsVisible =
        rect.top < window.innerHeight &&
        rect.bottom > 0;

      if (!reviewIsVisible) return;


      /* Next review */

      if (
        event.key === "ArrowRight"
      ) {

        if (
          currentReviewSlide <
          reviewSlides.length - 1
        ) {

          showReviewSlide(
            currentReviewSlide + 1
          );

        }

      }


      /* Previous review */

      if (
        event.key === "ArrowLeft"
      ) {

        if (
          currentReviewSlide > 0
        ) {

          showReviewSlide(
            currentReviewSlide - 1
          );

        }

      }

    }
  );


  /* =======================================================
     INITIAL REVIEW
  ======================================================= */

  showReviewSlide(0);


  /* =======================================================
     SMOOTH SAME-PAGE LINKS
  ======================================================= */

  const pageLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );

  pageLinks.forEach(
    function (link) {

      link.addEventListener(
        "click",
        function (event) {

          const id =
            this.getAttribute(
              "href"
            );

          if (
            !id ||
            id === "#"
          ) {
            return;
          }


          const target =
            document.querySelector(
              id
            );

          if (!target) return;


          event.preventDefault();


          target.scrollIntoView({

            behavior:
              "smooth",

            block:
              "start"

          });

        }
      );

    }
  );

});