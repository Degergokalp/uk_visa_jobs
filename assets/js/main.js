(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      if (document.querySelector('.mobile-nav-active')) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll('.swiper').forEach(function(swiper) {
      let config = JSON.parse(swiper.querySelector('.swiper-config').innerHTML.trim());
      new Swiper(swiper, config);
    });
  }
  window.addEventListener('load', initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);
  document.addEventListener('DOMContentLoaded', function () {
    const applyFiltersButton = document.getElementById('apply-filters-button');
    const viewFiltersButton = document.getElementById('view-filters');
    const closeFiltersButton = document.getElementById('close-filters');
    const filterSidebar = document.getElementById('filter-sidebar');

    viewFiltersButton.addEventListener('click', function (event) {
        event.preventDefault();
        filterSidebar.classList.add('active');
    });

    closeFiltersButton.addEventListener('click', function () {
      
        filterSidebar.classList.remove('active');
    });
    applyFiltersButton.addEventListener('click', function () {
      
        filterSidebar.classList.remove('active');
    });
});

  document.addEventListener('DOMContentLoaded', function() {
    fetch('jobs/jobs.json')
      .then(response => response.json())
      .then(data => {
        const jobs = data.jobs;
        populateJobs(jobs);
  
        const applyFiltersButton = document.getElementById('apply-filters-button');
        const searchButton = document.getElementById('search-button');
  
        applyFiltersButton.addEventListener('click', () => filterJobs(jobs));
        searchButton.addEventListener('click', () => searchJobs(jobs));
      })
      .catch(error => console.error('Error loading jobs:', error));
  
    function populateJobs(jobs) {
      const jobList = document.getElementById('job-list');
      if (jobList) {
        jobList.innerHTML = '';
  
        jobs.forEach(job => {
          const jobItem = document.createElement('div');
          jobItem.className = 'job-item';
          jobItem.innerHTML = `
            <div class="card mb-3">
              <div class="row g-0">
                <div class="col-md-2 d-flex align-items-center justify-content-center">
                  <img src="assets/img/logo.png" class="img-fluid rounded-start" alt="Company Logo">
                </div>
                <div class="col-md-10">
                  <div class="card-body">
                    <h5 class="card-title">${job.title}</h5>
                    <p class="card-text">${job.company}</p>
                    <p class="card-text">
                      <small class="job-details">
                        <i class="bi bi-geo-alt"></i> ${job.location}
                        <i class="bi bi-mortarboard"></i> ${job.degree_requirement}
                        <i class="bi bi-currency-dollar"></i> ${job.salary}
                        <i class="bi bi-briefcase"></i> ${job.job_type}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          `;
          jobList.appendChild(jobItem);
        });
      }
    }
  
    function filterJobs(jobs) {
      const selectedDegrees = Array.from(document.querySelectorAll('#filter-sidebar input[type="checkbox"]:checked'))
        .filter(input => input.id.startsWith('degree'))
        .map(input => input.nextElementSibling.textContent);
  
      const selectedIndustries = Array.from(document.querySelectorAll('#filter-sidebar input[type="checkbox"]:checked'))
        .filter(input => input.id.startsWith('industry'))
        .map(input => input.nextElementSibling.textContent);
  
      const selectedLocations = Array.from(document.querySelectorAll('#filter-sidebar input[type="checkbox"]:checked'))
        .filter(input => input.id.startsWith('location'))
        .map(input => input.nextElementSibling.textContent);
  
      const selectedSuitables = Array.from(document.querySelectorAll('#filter-sidebar input[type="checkbox"]:checked'))
        .filter(input => input.id.startsWith('suitable'))
        .map(input => input.nextElementSibling.textContent);
  
      const filteredJobs = jobs.filter(job => {
        const degreeMatch = selectedDegrees.length === 0 || selectedDegrees.includes(job.degree_requirement);
        const industryMatch = selectedIndustries.length === 0 || selectedIndustries.includes(job.job_type); // Adjusted for job_type instead of job_industry
        const locationMatch = selectedLocations.length === 0 || selectedLocations.includes(job.location);
        const suitableMatch = selectedSuitables.length === 0 || selectedSuitables.includes(job.company); // Adjusted to use 'company' as a suitable match example
  
        return degreeMatch && industryMatch && locationMatch && suitableMatch;
      });
  
      populateJobs(filteredJobs);
    }
  
    function searchJobs(jobs) {
      const searchInput = document.getElementById('search-input').value.toLowerCase();
      const filteredJobs = jobs.filter(job => {
        return job.title.toLowerCase().includes(searchInput) || job.company.toLowerCase().includes(searchInput);
      });
  
      populateJobs(filteredJobs);
    }
  });
  

})();  