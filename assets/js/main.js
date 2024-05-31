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

  document.addEventListener('DOMContentLoaded', function() {
    fetch('jobs/jobs.json')
      .then(response => response.json())
      .then(data => {
        const jobs = data.jobs;
        populateFilters(jobs);
        populateJobs(jobs);
  
        const locationFilter = document.getElementById('location-filter');
        const degreeFilter = document.getElementById('degree-filter');
        const typeFilter = document.getElementById('type-filter');
  
        if (locationFilter) {
          locationFilter.addEventListener('change', () => filterJobs(jobs));
        }
        if (degreeFilter) {
          degreeFilter.addEventListener('change', () => filterJobs(jobs));
        }
        if (typeFilter) {
          typeFilter.addEventListener('change', () => filterJobs(jobs));
        }
      })
      .catch(error => console.error('Error loading jobs:', error));
  
    function populateFilters(jobs) {
      const locationSet = new Set(jobs.map(job => job.location));
      const degreeSet = new Set(jobs.map(job => job.degree_requirement));
      const typeSet = new Set(jobs.map(job => job.job_type));
  
      const locationFilter = document.getElementById('location-filter');
      const degreeFilter = document.getElementById('degree-filter');
      const typeFilter = document.getElementById('type-filter');
  
      if (locationFilter) {
        locationSet.forEach(location => {
          const option = document.createElement('option');
          option.value = location;
          option.text = location;
          locationFilter.appendChild(option);
        });
      }
  
      if (degreeFilter) {
        degreeSet.forEach(degree => {
          const option = document.createElement('option');
          option.value = degree;
          option.text = degree;
          degreeFilter.appendChild(option);
        });
      }
  
      if (typeFilter) {
        typeSet.forEach(type => {
          const option = document.createElement('option');
          option.value = type;
          option.text = type;
          typeFilter.appendChild(option);
        });
      }
    }
  
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
                    <p class="card-text"><small class="text-muted">${job.location} | ${job.degree_requirement} | £${job.salary}</small></p>
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
      const locationFilter = document.getElementById('location-filter').value;
      const degreeFilter = document.getElementById('degree-filter').value;
      const typeFilter = document.getElementById('type-filter').value;
  
      const filteredJobs = jobs.filter(job => {
        return (locationFilter === '' || job.location === locationFilter) &&
               (degreeFilter === '' || job.degree_requirement === degreeFilter) &&
               (typeFilter === '' || job.job_type === typeFilter);
      });
  
      populateJobs(filteredJobs);
    }
  });

})();
