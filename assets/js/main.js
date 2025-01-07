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
      populateJobs(jobs);             // Populate job listings
      populateLocationFilters(jobs);  // Populate location filters dynamically
      populateIndustryFilters(jobs);  // Populate industry filters dynamically
      populateDegreeFilters(jobs);    // Populate degree filters dynamically

      // Listen for changes in checkboxes
      const filterSidebar = document.getElementById('filter-sidebar');
      filterSidebar.addEventListener('change', () => filterJobs(jobs));

      const searchButton = document.getElementById('search-button');
      searchButton.addEventListener('click', () => searchJobs(jobs));
    })
    .catch(error => console.error('Error loading jobs:', error));

  function populateDegreeFilters(jobs) {
      const degreeFilterContainer = document.getElementById('degree-filters');
      const uniqueDegrees = [...new Set(jobs.map(job => job.degree_requirement))]; // Get unique degrees
  
      degreeFilterContainer.innerHTML = ''; // Clear existing content
  
      uniqueDegrees.forEach((degree, index) => {
        const degreeCheckbox = document.createElement('div');
        degreeCheckbox.className = 'form-check';
        degreeCheckbox.innerHTML = `
          <input class="form-check-input" type="checkbox" value="${degree}" id="degree${index}">
          <label class="form-check-label" for="degree${index}">${degree}</label>
        `;
        degreeFilterContainer.appendChild(degreeCheckbox);
      });
    }

  function populateJobs(jobs) {
      const jobList = document.getElementById('job-list');
      if (jobList) {
        jobList.innerHTML = '';
  
        jobs.forEach(job => {
          const jobItem = document.createElement('div');
          jobItem.className = 'job-item';
          jobItem.innerHTML = `
            <a href="${job.job_url_path}" style="text-decoration: none; color: inherit;">
              <div class="card mb-3">
                <div class="row g-0">
                  <div class="col-md-2 d-flex align-items-center justify-content-center">
                    <img src="${job.logo_path}" class="img-fluid rounded-start" alt="Company Logo" style="transform: scale(1.5);">
                  </div>
                  <div class="col-md-10">
                    <div class="card-body">
                      <h5 class="card-title">${job.title}</h5>
                      <p class="card-text">${job.company}</p>
                      <p class="card-text">
                        <small class="job-details">
                          <div style="display: inline-block; padding: 4px 8px; border-radius: 16px; background: linear-gradient(192deg, #419f44db, #259a38); color: black; margin-right: 8px;">
                            <i class="bi bi-geo-alt"></i> ${job.location}
                          </div>
                          <div style="display: inline-block; padding: 4px 8px; border-radius: 16px; background: linear-gradient(45deg, #FF7043, #FFCA28); color: white; margin-right: 8px;">
                            <i class="bi bi-mortarboard"></i> ${job.degree_requirement}
                          </div>
                          <div style="display: inline-block; padding: 4px 8px; border-radius: 16px; background: linear-gradient(45deg, #673AB7, #9C27B0); color: white; margin-right: 8px;">
                            <i class="bi bi-currency-pound"></i> ${job.salary}
                          </div>
                          <div style="display: inline-block; padding: 4px 8px; border-radius: 16px; background: linear-gradient(356deg, #514caf, #3f909b); color: white; margin-right: 8px;">
                            <i class="bi bi-briefcase"></i> ${job.job_type}
                          </div>
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          `;
          jobList.appendChild(jobItem);
        });
      }
    }

  // Dynamically populate location filters based on jobs.json
  function populateLocationFilters(jobs) {
    const locationFilterContainer = document.getElementById('location-filters');
    const uniqueLocations = [...new Set(jobs.map(job => job.location))]; // Get unique locations

    locationFilterContainer.innerHTML = ''; // Clear existing content

    uniqueLocations.forEach((location, index) => {
      const locationCheckbox = document.createElement('div');
      locationCheckbox.className = 'form-check';
      locationCheckbox.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${location}" id="location${index}">
        <label class="form-check-label" for="location${index}">${location}</label>
      `;
      locationFilterContainer.appendChild(locationCheckbox);
    });
  }

  // Dynamically populate industry filters based on jobs.json
  function populateIndustryFilters(jobs) {
    const industryFilterContainer = document.getElementById('industry-filters');
    const uniqueIndustries = [...new Set(jobs.map(job => job.industry))]; // Get unique industries

    industryFilterContainer.innerHTML = ''; // Clear existing content

    uniqueIndustries.forEach((industry, index) => {
      const industryCheckbox = document.createElement('div');
      industryCheckbox.className = 'form-check';
      industryCheckbox.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${industry}" id="industry${index}">
        <label class="form-check-label" for="industry${index}">${industry}</label>
      `;
      industryFilterContainer.appendChild(industryCheckbox);
    });
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

    // If no filters are selected, show all jobs
    if (selectedDegrees.length === 0 && selectedIndustries.length === 0 && selectedLocations.length === 0) {
      populateJobs(jobs);
      return;
    }

    const filteredJobs = jobs.filter(job => {
      const degreeMatch = selectedDegrees.length === 0 || selectedDegrees.includes(job.degree_requirement);
      const industryMatch = selectedIndustries.length === 0 || selectedIndustries.includes(job.industry);
      const locationMatch = selectedLocations.length === 0 || selectedLocations.includes(job.location);

      return degreeMatch && industryMatch && locationMatch;
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

document.addEventListener('DOMContentLoaded', function () {
  const JOBS_PER_PAGE = 6; // Number of jobs per page
  let currentPage = 1; // Track the current page

  fetch('jobs/jobs.json')
    .then(response => response.json())
    .then(data => {
      const jobs = data.jobs;
      const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

      // Initial load of jobs and pagination
      displayJobs(jobs, currentPage, JOBS_PER_PAGE);
      createPaginationControls(totalPages);

      // Listen for pagination clicks
      const paginationContainer = document.getElementById('pagination-container');
      paginationContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('page-link')) {
          const selectedPage = parseInt(e.target.dataset.page, 10);
          currentPage = selectedPage;
          displayJobs(jobs, currentPage, JOBS_PER_PAGE);
          updatePaginationControls(totalPages, currentPage);
        }
      });
    })
    .catch(error => console.error('Error loading jobs:', error));

  function displayJobs(jobs, page, jobsPerPage) {
    const startIndex = (page - 1) * jobsPerPage;
    const endIndex = page * jobsPerPage;
    const paginatedJobs = jobs.slice(startIndex, endIndex);
    const jobList = document.getElementById('job-list');
    jobList.innerHTML = '';

    paginatedJobs.forEach(job => {
      const jobItem = document.createElement('div');
      jobItem.className = 'job-item';
      jobItem.innerHTML = `
        <a href="${job.job_url_path}" style="text-decoration: none; color: inherit;">
          <div class="card mb-3">
            <div class="row g-0">
              <div class="col-md-2 d-flex align-items-center justify-content-center">
                <img src="${job.logo_path}" class="img-fluid rounded-start" alt="Company Logo" style="transform: scale(1.5);">
              </div>
              <div class="col-md-10">
                <div class="card-body">
                  <h5 class="card-title">${job.title}</h5>
                  <p class="card-text">${job.company}</p>
                  <p class="card-text">
                    <small class="job-details">
                      <div style="display: inline-block; padding: 4px 8px; border-radius: 16px; background: linear-gradient(192deg, #419f44db, #259a38); color: black; margin-right: 8px;">
                        <i class="bi bi-geo-alt"></i> ${job.location}
                      </div>
                      <div style="display: inline-block; padding: 4px 8px; border-radius: 16px; background: linear-gradient(45deg, #FF7043, #FFCA28); color: white; margin-right: 8px;">
                        <i class="bi bi-mortarboard"></i> ${job.degree_requirement}
                      </div>
                      <div style="display: inline-block; padding: 4px 8px; border-radius: 16px; background: linear-gradient(45deg, #673AB7, #9C27B0); color: white; margin-right: 8px;">
                        <i class="bi bi-currency-pound"></i> ${job.salary}
                      </div>
                      <div style="display: inline-block; padding: 4px 8px; border-radius: 16px; background: linear-gradient(356deg, #514caf, #3f909b); color: white; margin-right: 8px;">
                        <i class="bi bi-briefcase"></i> ${job.job_type}
                      </div>
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </a>
      `;
      jobList.appendChild(jobItem);
    });
  }

  function createPaginationControls(totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const paginationList = document.createElement('ul');
    paginationList.className = 'pagination';

    for (let i = 1; i <= totalPages; i++) {
      const paginationItem = document.createElement('li');
      paginationItem.className = 'page-item';
      paginationItem.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
      paginationList.appendChild(paginationItem);
    }

    paginationContainer.appendChild(paginationList);
    updatePaginationControls(totalPages, 1); // Highlight the first page by default
  }

  function updatePaginationControls(totalPages, currentPage) {
    const paginationLinks = document.querySelectorAll('.page-link');
    paginationLinks.forEach(link => {
      const page = parseInt(link.dataset.page, 10);
      if (page === currentPage) {
        link.parentElement.classList.add('active');
      } else {
        link.parentElement.classList.remove('active');
      }
    });
  }
});




  

})();  