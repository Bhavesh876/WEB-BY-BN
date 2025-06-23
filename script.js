/*
* DigitalCraft Agency Website - JavaScript Functionality
* This file contains all the interactive functionality for the DigitalCraft Agency website.
*/

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ===== Navbar Shrink on Scroll =====
  const mainNav = document.getElementById('mainNav');
  const backToTopBtn = document.getElementById('backToTop');

  // Function to handle scroll events
  function handleScroll() {
    if (window.scrollY > 50) {
      mainNav.classList.add('navbar-shrink');
      backToTopBtn.classList.add('active');
    } else {
      mainNav.classList.remove('navbar-shrink');
      backToTopBtn.classList.remove('active');
    }
  }

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);

  // ===== Smooth Scrolling for Anchor Links =====
  document.querySelectorAll('a.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Back to Top Button =====
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== Testimonial Carousel =====
  const testimonialRow = document.getElementById('testimonials-row');
  const prevTestimonialBtn = document.getElementById('prev-testimonial');
  const nextTestimonialBtn = document.getElementById('next-testimonial');

  if (testimonialRow && prevTestimonialBtn && nextTestimonialBtn) {
    let position = 0;
    const testimonials = testimonialRow.querySelectorAll('.col-md-4');
    const totalTestimonials = testimonials.length;
    let visibleTestimonials = 3;

    // Adjust visible testimonials based on screen width
    function updateVisibleTestimonials() {
      if (window.innerWidth < 768) {
        visibleTestimonials = 1;
      } else if (window.innerWidth < 992) {
        visibleTestimonials = 2;
      } else {
        visibleTestimonials = 3;
      }
    }

    // Update initial state
    updateVisibleTestimonials();
    window.addEventListener('resize', updateVisibleTestimonials);

    // Function to move testimonials
    function moveTestimonials(direction) {
      if (direction === 'next') {
        position = (position + 1) % (totalTestimonials - visibleTestimonials + 1);
      } else {
        position = (position - 1 + (totalTestimonials - visibleTestimonials + 1)) % (totalTestimonials - visibleTestimonials + 1);
      }
      
      testimonialRow.style.transform = `translateX(-${position * (100 / visibleTestimonials)}%)`;
    }

    // Add event listeners to buttons
    prevTestimonialBtn.addEventListener('click', () => moveTestimonials('prev'));
    nextTestimonialBtn.addEventListener('click', () => moveTestimonials('next'));

    // Auto-slide testimonials
    let testimonialInterval = setInterval(() => moveTestimonials('next'), 5000);

    // Pause auto-slide on hover
    testimonialRow.addEventListener('mouseenter', () => {
      clearInterval(testimonialInterval);
    });

    testimonialRow.addEventListener('mouseleave', () => {
      testimonialInterval = setInterval(() => moveTestimonials('next'), 5000);
    });
  }

  // ===== Portfolio Filtering =====
  const filterButtons = document.querySelectorAll('.filter-buttons .btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        // Filter portfolio items
        portfolioItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category').includes(filterValue)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ===== Contact Form Validation =====
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const formElements = this.elements;
      
      // Check required fields
      for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        
        if (element.hasAttribute('required') && element.value.trim() === '') {
          element.classList.add('is-invalid');
          isValid = false;
        } else {
          element.classList.remove('is-invalid');
        }
        
        // Email validation
        if (element.type === 'email' && element.value.trim() !== '') {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(element.value)) {
            element.classList.add('is-invalid');
            isValid = false;
          }
        }
      }
      
      if (isValid) {
        // Normally this would submit to a server
        // For this demo, we'll just show the success message
        document.getElementById('contactSuccess').classList.remove('d-none');
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          document.getElementById('contactSuccess').classList.add('d-none');
        }, 5000);
      } else {
        document.getElementById('contactError').classList.remove('d-none');
        
        // Hide error message after 5 seconds
        setTimeout(() => {
          document.getElementById('contactError').classList.add('d-none');
        }, 5000);
      }
    });
    
    // Clear validation styling on input
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
          this.classList.remove('is-invalid');
        }
      });
    });
  }

  // ===== Stats Counter Animation =====
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length > 0) {
    const options = {
      threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const count = parseInt(target.getAttribute('data-count'));
          let current = 0;
          const increment = Math.ceil(count / 50);
          const duration = 2000;
          const step = Math.floor(duration / (count / increment));
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= count) {
              target.textContent = count;
              clearInterval(timer);
            } else {
              target.textContent = current;
            }
          }, step);
          
          observer.unobserve(target);
        }
      });
    }, options);
    
    statNumbers.forEach(stat => {
      observer.observe(stat);
    });
  }

  // ===== Bootstrap Modal for Blog Posts =====
  const blogModals = document.querySelectorAll('.modal');
  
  if (blogModals.length > 0) {
    blogModals.forEach(modal => {
      modal.addEventListener('shown.bs.modal', function() {
        // Scroll to top when modal is shown
        this.querySelector('.modal-body').scrollTop = 0;
      });
    });
  }

  // ===== Add Active Class to Current Page in Navigation =====
  const currentPage = window.location.pathname.split('/').pop();
  
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ===== Animate on Scroll Initialization =====
  // Add data-aos attributes to HTML elements for animation effects
  function initAOS() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (animatedElements.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            
            // Add animation classes based on data-aos attribute
            const animation = el.getAttribute('data-aos');
            el.classList.add(animation, 'aos-animate');
            
            // Get delay if it exists
            const delay = el.getAttribute('data-aos-delay');
            if (delay) {
              el.style.transitionDelay = `${delay}ms`;
            }
            
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.1 });
      
      animatedElements.forEach(el => {
        // Add base transition class
        el.classList.add('aos-init');
        el.style.transition = 'all 0.8s ease';
        
        // Initial state for fade-up
        if (el.getAttribute('data-aos') === 'fade-up') {
          el.style.opacity = '0';
          el.style.transform = 'translateY(50px)';
        }
        
        // Initial state for fade-down
        else if (el.getAttribute('data-aos') === 'fade-down') {
          el.style.opacity = '0';
          el.style.transform = 'translateY(-50px)';
        }
        
        // Initial state for fade-left
        else if (el.getAttribute('data-aos') === 'fade-left') {
          el.style.opacity = '0';
          el.style.transform = 'translateX(50px)';
        }
        
        // Initial state for fade-right
        else if (el.getAttribute('data-aos') === 'fade-right') {
          el.style.opacity = '0';
          el.style.transform = 'translateX(-50px)';
        }
        
        // Initial state for zoom-in
        else if (el.getAttribute('data-aos') === 'zoom-in') {
          el.style.opacity = '0';
          el.style.transform = 'scale(0.9)';
        }
        
        observer.observe(el);
      });
    }
  }
  
  // Initialize animations
  initAOS();

  // Add animated class for elements with .aos-animate
  document.addEventListener('scroll', function() {
    const animatedElements = document.querySelectorAll('.aos-animate');
    
    animatedElements.forEach(el => {
      // Animation styles for fade-up
      if (el.getAttribute('data-aos') === 'fade-up') {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
      
      // Animation styles for fade-down
      else if (el.getAttribute('data-aos') === 'fade-down') {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
      
      // Animation styles for fade-left
      else if (el.getAttribute('data-aos') === 'fade-left') {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      }
      
      // Animation styles for fade-right
      else if (el.getAttribute('data-aos') === 'fade-right') {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      }
      
      // Animation styles for zoom-in
      else if (el.getAttribute('data-aos') === 'zoom-in') {
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      }
    });
  });
});
