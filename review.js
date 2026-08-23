document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("programSearch");
  const dropdown = document.getElementById("dropdownList");
  const items = Array.from(document.querySelectorAll(".dropdown-item"));
  const reviewForm = document.getElementById("reviewForm");
  const reviewName = document.getElementById("reviewName");
  const reviewEmail = document.getElementById("reviewEmail");
  const reviewText = document.getElementById("reviewText");
  const stars = Array.from(document.querySelectorAll(".star"));
  const ratingBox = document.querySelector(".rating-box");
  const grid = document.getElementById("reviewsGrid");
  const programRadios = Array.from(
    document.querySelectorAll('input[name="program"]')
  );
  const ratingRadios = Array.from(
    document.querySelectorAll('input[name="rating"]')
  );
  const searchInput = document.getElementById("reviewSearch");
  const sortSelect = document.getElementById("reviewSort");
  const clearBtn = document.getElementById("clearFiltersBtn");
  const selectedLabel = document.getElementById("selectedProgramLabel");
  const noResultsMsg = document.getElementById("noResultsMsg");
  const popup = document.getElementById("reviewPopup");
  const popupClose = document.getElementById("reviewPopupClose");
  const viewSubmittedReview = document.getElementById(
    "viewSubmittedReview"
  );

  const STORAGE_KEY = "jssLearnerReviews";

  let selectedRating = 0;
  let cards = [];
  let latestSubmittedCard = null;


  /* =====================================================
      PROGRAM / COURSE SEARCH DROPDOWN
  ===================================================== */

  input.addEventListener("focus", () => {
    dropdown.style.display = "block";
  });


  input.addEventListener("input", function () {

    const value = input.value.trim().toLowerCase();

    dropdown.style.display = "block";

    items.forEach(item => {

      if (
        item.textContent
          .toLowerCase()
          .includes(value)
      ) {

        item.style.display = "block";

      } else {

        item.style.display = "none";

      }

    });

  });


  items.forEach(item => {

    item.addEventListener("click", function () {

      input.value = this.textContent.trim();

      dropdown.style.display = "none";

    });

  });


  document.addEventListener("click", e => {

    if (!e.target.closest(".search-dropdown")) {

      dropdown.style.display = "none";

    }

  });


  /* =====================================================
      STAR RATING
  ===================================================== */

  function highlightStars(rating) {

    stars.forEach(star => {

      const active =
        Number(star.dataset.value) <= rating;


      star.classList.toggle(
        "fa-solid",
        active
      );


      star.classList.toggle(
        "fa-regular",
        !active
      );


      star.classList.toggle(
        "active",
        active
      );


      star.setAttribute(
        "aria-checked",
        Number(star.dataset.value) === selectedRating
          ? "true"
          : "false"
      );

    });

  }


  function chooseRating(value) {

    selectedRating =
      Number(value);

    highlightStars(
      selectedRating
    );

  }


  stars.forEach(star => {

    star.addEventListener(
      "mouseenter",
      function () {

        highlightStars(
          Number(this.dataset.value)
        );

      }
    );


    star.addEventListener(
      "click",
      function () {

        chooseRating(
          this.dataset.value
        );

      }
    );


    star.addEventListener(
      "keydown",
      function (e) {

        if (
          e.key === "Enter" ||
          e.key === " "
        ) {

          e.preventDefault();

          chooseRating(
            this.dataset.value
          );

        }

      }
    );

  });


  ratingBox.addEventListener(
    "mouseleave",
    () => {

      highlightStars(
        selectedRating
      );

    }
  );


  /* =====================================================
      HELPERS
  ===================================================== */

  function escapeHTML(value) {

    return String(value)

      .replace(
        /&/g,
        "&amp;"
      )

      .replace(
        /</g,
        "&lt;"
      )

      .replace(
        />/g,
        "&gt;"
      )

      .replace(
        /\"/g,
        "&quot;"
      )

      .replace(
        /'/g,
        "&#039;"
      );

  }


  function getInitials(name) {

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(
        part =>
          part
            .charAt(0)
            .toUpperCase()
      )
      .join("");

  }


  /* =====================================================
      DETERMINE PROGRAM CATEGORY
  ===================================================== */

  function getProgramCategory(course) {

    const value =
      course.toLowerCase();


    if (
      value.includes("cyber") ||
      value.includes("security") ||
      value.includes("comptia")
    ) {

      return "CyberSecurity";

    }


    if (
      value.includes("cisco")
    ) {

      return "Cisco Network Engineer";

    }


    if (
      value.includes("azure")
    ) {

      return "Azure Cloud Engineer";

    }


    if (
      value.includes("aws")
    ) {

      return "AWS Cloud Engineer";

    }


    if (
      value.includes(
        "systems engineer"
      ) ||

      value.includes(
        "system administration"
      ) ||

      value.includes(
        "network & system"
      )
    ) {

      return "Systems Engineer";

    }


    if (
      value.includes(
        "technician"
      )
    ) {

      return "IT Support Technician";

    }


    if (
      value.includes(
        "it support"
      ) ||

      value.includes(
        "google"
      )
    ) {

      return "IT Support";

    }


    const exact =
      programRadios.find(
        r =>
          r.value !== "all" &&
          r.value.toLowerCase() === value
      );


    return exact
      ? exact.value
      : course;

  }


  /* =====================================================
      CREATE REVIEW CARD
  ===================================================== */

  function createReviewCard(review) {

    const card =
      document.createElement(
        "div"
      );


    card.className =
      "review-card user-submitted-review";


    card.dataset.program =
      review.program;


    card.dataset.rating =
      String(review.rating);


    card.dataset.date =
      review.date;


    const starText =

      "★".repeat(
        review.rating
      ) +

      "☆".repeat(
        5 - review.rating
      );


    const tag =

      review.program
        .replace(
          /[^a-zA-Z0-9]/g,
          ""
        ) ||

      "Program";


    card.innerHTML = `

      <div class="review-header">

        <div class="review-left">

          <div class="review-avatar">

            ${escapeHTML(
              review.initials
            )}

          </div>


          <div>

            <h4>
              ${escapeHTML(
                review.name
              )}
            </h4>

            <span>
              Submitted
              ${escapeHTML(
                review.displayDate
              )}
            </span>

          </div>

        </div>


        <div class="review-stars">

          ${starText}

        </div>

      </div>


      <h5>

        ${escapeHTML(
          review.course
        )}

      </h5>


      <p>

        ${escapeHTML(
          review.text
        )}

      </p>


      <div class="review-tags">

        <span>
          #LearnerReview
        </span>

        <span>
          #${escapeHTML(tag)}
        </span>

      </div>

    `;


    return card;

  }


  /* =====================================================
      LOCAL STORAGE
  ===================================================== */

  function getSavedReviews() {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            STORAGE_KEY
          )
        );


      return Array.isArray(saved)
        ? saved
        : [];

    }

    catch {

      return [];

    }

  }


  function saveReview(review) {

    const saved =
      getSavedReviews();


    saved.push(
      review
    );


    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(
        saved
      )

    );

  }


  function loadSavedReviews() {

    getSavedReviews()
      .forEach(review => {

        grid.prepend(
          createReviewCard(
            review
          )
        );

      });

  }


  /* =====================================================
      REFRESH CARD LIST
  ===================================================== */

  function refreshCards() {

    cards =
      Array.from(
        grid.querySelectorAll(
          ".review-card"
        )
      );


    cards.forEach(
      (card, i) => {

        if (
          !card.dataset.originalIndex
        ) {

          card.dataset.originalIndex =
            String(i);

        }

      }
    );

  }


  /* =====================================================
      SEARCH REVIEW CONTENT
  ===================================================== */

  function getCardSearchText(card) {

    const name =
      card
        .querySelector("h4")
        ?.textContent || "";


    const title =
      card
        .querySelector("h5")
        ?.textContent || "";


    const body =
      card
        .querySelector("p")
        ?.textContent || "";


    const tags =

      Array.from(
        card.querySelectorAll(
          ".review-tags span"
        )
      )

        .map(
          t =>
            t.textContent
        )

        .join(" ");


    return [

      name,

      title,

      body,

      tags,

      card.dataset.program || ""

    ]

      .join(" ")

      .toLowerCase();

  }


  /* =====================================================
      SORT REVIEWS
  ===================================================== */

  function applySort() {

    const newest =
      sortSelect.value ===
      "newest";


    [...cards]

      .sort(
        (a, b) => {

          const da =
            a.dataset.date || "";


          const db =
            b.dataset.date || "";


          if (
            da === db
          ) {

            return (

              Number(
                a.dataset.originalIndex || 0
              )

              -

              Number(
                b.dataset.originalIndex || 0
              )

            );

          }


          return newest

            ? (
              da < db
                ? 1
                : -1
            )

            : (
              da > db
                ? 1
                : -1
            );

        }
      )


      .forEach(
        card => {

          grid.appendChild(
            card
          );

        }
      );

  }


  /* =====================================================
      FILTER REVIEWS
  ===================================================== */

  function applyFilters() {

    const selectedProgram =

      document.querySelector(
        'input[name="program"]:checked'
      )?.value

      || "all";


    const selectedFilterRating =

      parseFloat(

        document.querySelector(
          'input[name="rating"]:checked'
        )?.value

        || "0"

      );


    const query =

      searchInput
        .value
        .trim()
        .toLowerCase();


    let visibleCount = 0;


    cards.forEach(
      card => {

        const matchesProgram =

          selectedProgram === "all"

          ||

          card.dataset.program ===
          selectedProgram;


        const matchesRating =

          selectedFilterRating === 0

          ||

          parseFloat(
            card.dataset.rating
          ) ===
          selectedFilterRating;


        const matchesSearch =

          query === ""

          ||

          getCardSearchText(
            card
          ).includes(
            query
          );


        const visible =

          matchesProgram

          &&

          matchesRating

          &&

          matchesSearch;


        card.style.display =
          visible
            ? ""
            : "none";


        if (
          visible
        ) {

          visibleCount++;

        }

      }
    );


    noResultsMsg.style.display =

      visibleCount === 0

        ? "block"

        : "none";


    selectedLabel.textContent =

      selectedProgram === "all"

        ? "All Programs"

        : selectedProgram;


    applySort();

  }


  /* =====================================================
      FILTER EVENT LISTENERS
  ===================================================== */

  programRadios.forEach(
    r =>
      r.addEventListener(
        "change",
        applyFilters
      )
  );


  ratingRadios.forEach(
    r =>
      r.addEventListener(
        "change",
        applyFilters
      )
  );


  searchInput.addEventListener(
    "input",
    applyFilters
  );


  sortSelect.addEventListener(
    "change",
    applySort
  );


  clearBtn.addEventListener(
    "click",
    function () {

      document.querySelector(
        'input[name="program"][value="all"]'
      ).checked = true;


      document.querySelector(
        'input[name="rating"][value="0"]'
      ).checked = true;


      searchInput.value =
        "";


      sortSelect.value =
        "newest";


      applyFilters();

    }
  );


  /* =====================================================
      SUCCESS POPUP
  ===================================================== */

  function openPopup() {

    popup.classList.add(
      "show"
    );


    popup.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add(
      "popup-open"
    );


    viewSubmittedReview.focus();

  }


  function closePopup() {

    popup.classList.remove(
      "show"
    );


    popup.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.classList.remove(
      "popup-open"
    );

  }


  popupClose.addEventListener(
    "click",
    closePopup
  );


  popup.addEventListener(
    "click",
    e => {

      if (
        e.target === popup
      ) {

        closePopup();

      }

    }
  );


  document.addEventListener(
    "keydown",
    e => {

      if (
        e.key === "Escape"

        &&

        popup.classList.contains(
          "show"
        )
      ) {

        closePopup();

      }

    }
  );


  viewSubmittedReview.addEventListener(
    "click",
    function () {

      closePopup();


      document
        .getElementById(
          "reviews"
        )
        .scrollIntoView({

          behavior: "smooth",

          block: "start"

        });


      if (
        latestSubmittedCard
      ) {

        latestSubmittedCard
          .classList
          .add(
            "just-submitted"
          );


        setTimeout(
          () => {

            latestSubmittedCard
              ?.classList
              .remove(
                "just-submitted"
              );

          },

          2200
        );

      }

    }
  );


  /* =====================================================
      SUBMIT REVIEW
  ===================================================== */

  reviewForm.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();


      const name =
        reviewName
          .value
          .trim();


      const email =
        reviewEmail
          .value
          .trim();


      const course =
        input
          .value
          .trim();


      const text =
        reviewText
          .value
          .trim();


      /* Validation */

      if (
        !name ||
        !email ||
        !course ||
        !text
      ) {

        alert(
          "Please complete all fields before submitting your review."
        );

        return;

      }


      if (
        selectedRating === 0
      ) {

        alert(
          "Please select a star rating."
        );

        return;

      }


      const now =
        new Date();


      const review = {

        id:
          "review-" +
          Date.now(),

        name:
          name,

        initials:
          getInitials(
            name
          ),

        course:
          course,

        program:
          getProgramCategory(
            course
          ),

        rating:
          selectedRating,

        text:
          text,

        date:
          now.toISOString(),

        displayDate:
          now.toLocaleDateString(

            "en-US",

            {

              month:
                "long",

              day:
                "numeric",

              year:
                "numeric"

            }

          )

      };


      /* Save review */

      saveReview(
        review
      );


      /* Add review to page */

      latestSubmittedCard =
        createReviewCard(
          review
        );


      grid.prepend(
        latestSubmittedCard
      );


      refreshCards();


      /* Reset filters so new review is visible */

      document.querySelector(
        'input[name="program"][value="all"]'
      ).checked =
        true;


      document.querySelector(
        'input[name="rating"][value="0"]'
      ).checked =
        true;


      searchInput.value =
        "";


      sortSelect.value =
        "newest";


      applyFilters();


      /* Reset form */

      reviewForm.reset();


      selectedRating =
        0;


      highlightStars(
        0
      );


      items.forEach(
        item =>
          item.style.display =
          "block"
      );


      /* Show popup */

      openPopup();

    }
  );


  /* =====================================================
      INITIAL PAGE LOAD
  ===================================================== */

  loadSavedReviews();

  refreshCards();

  applyFilters();

});

/* =========================================================
   MOBILE FILTER ACCORDION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const filterBoxes =
        document.querySelectorAll(".reviews-sidebar .filter-box");


    filterBoxes.forEach(function (box) {

        const title =
            box.querySelector(".filter-title");

        if (!title) return;


        title.addEventListener("click", function () {

            /* Only behave like dropdown on mobile */
            if (window.innerWidth > 640) {
                return;
            }


            const isAlreadyOpen =
                box.classList.contains("mobile-open");


            /*
             Close the other dropdown first.
             This keeps the filter area compact.
            */
            filterBoxes.forEach(function (otherBox) {

                otherBox.classList.remove("mobile-open");

            });


            /* Toggle selected dropdown */
            if (!isAlreadyOpen) {

                box.classList.add("mobile-open");

            }

        });

    });


    /*
       Remove mobile accordion state when returning
       to desktop/tablet size.
    */
    window.addEventListener("resize", function () {

        if (window.innerWidth > 640) {

            filterBoxes.forEach(function (box) {

                box.classList.remove("mobile-open");

            });

        }

    });

    

});