/* ==========================================================================
   PORTFOLIO SCRIPT
   Handles: sticky navbar, mobile menu, active-link highlighting,
   scroll-reveal animations, animated skill bars, typing effect,
   and full contact form validation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. STICKY NAVBAR SHADOW ON SCROLL
     ------------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // run once on load in case page is refreshed mid-scroll


  /* ------------------------------------------------------------------------
     2. MOBILE NAVIGATION TOGGLE
     ------------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close the mobile menu whenever a nav link is clicked (better UX on phones)
  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });


  /* ------------------------------------------------------------------------
     3. ACTIVE LINK HIGHLIGHTING WHILE SCROLLING
     Uses IntersectionObserver to detect which section is currently
     in the viewport and highlights the matching nav link.
     ------------------------------------------------------------------------ */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          navLinks.forEach((link) => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active-link');
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 } // triggers around the vertical middle of the screen
  );

  sections.forEach((section) => sectionObserver.observe(section));


  /* ------------------------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS
     Elements with the ".reveal" class fade + slide into view the first
     time they enter the viewport.
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate only once per element
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));


  /* ------------------------------------------------------------------------
     5. ANIMATED SKILL PROGRESS BARS
     The bars fill to their target width only once they scroll into view,
     which feels more alive than filling immediately on page load.
     ------------------------------------------------------------------------ */
  const progressBars = document.querySelectorAll('.progress-fill');

  const progressObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('filled');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  progressBars.forEach((bar) => progressObserver.observe(bar));


  /* ------------------------------------------------------------------------
     6. HERO TYPING EFFECT
     Simple character-by-character typewriter effect for the professional
     title in the hero section, cycling through a short list of roles.
     ------------------------------------------------------------------------ */
  const typedRoleEl = document.getElementById('typedRole');
  const roles = [
    'B.Tech Information Technology Student',
    'Aspiring Full-Stack Developer',
    'Problem Solver & Lifelong Learner'
  ];

  let roleIndex = 0;
  let charIndex = roles[0].length; // start fully typed (matches initial HTML text)
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typedRoleEl.textContent = currentRole.substring(0, charIndex);

    let delay = isDeleting ? 40 : 70;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1600; // pause at the end of a full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeLoop, delay);
  }

  // Kick off the cycle after the initial pause so the first title can be read
  setTimeout(() => {
    isDeleting = true;
    typeLoop();
  }, 1800);


  /* ------------------------------------------------------------------------
     7. FOOTER YEAR
     ------------------------------------------------------------------------ */
  document.getElementById('year').textContent = new Date().getFullYear();


  /* ------------------------------------------------------------------------
     8. CONTACT FORM VALIDATION
     ------------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('nameError'),
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
    },
    subject: {
      input: document.getElementById('subject'),
      error: document.getElementById('subjectError'),
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
    },
  };

  // Regular expression used to check that the email looks like: text@text.text
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Marks a field as invalid: shows the red border and the error text.
   * @param {HTMLElement} input - the input/textarea element
   * @param {HTMLElement} errorEl - the <span> that displays the error message
   * @param {string} message - the error text to show
   */
  function markInvalid(input, errorEl, message) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    input.setAttribute('aria-invalid', 'true');
    errorEl.textContent = message;
  }

  /**
   * Marks a field as valid: shows the green border and clears any error text.
   * @param {HTMLElement} input - the input/textarea element
   * @param {HTMLElement} errorEl - the <span> that displays the error message
   */
  function markValid(input, errorEl) {
    input.classList.add('valid');
    input.classList.remove('invalid');
    input.setAttribute('aria-invalid', 'false');
    errorEl.textContent = '';
  }

  /**
   * Validates the Name field.
   * Rule: must not be empty (after trimming whitespace).
   */
  function validateName() {
    const value = fields.name.input.value.trim();
    if (value === '') {
      markInvalid(fields.name.input, fields.name.error, 'Name is required.');
      return false;
    }
    markValid(fields.name.input, fields.name.error);
    return true;
  }

  /**
   * Validates the Email field.
   * Rules: must not be empty AND must match the email regex pattern.
   */
  function validateEmail() {
    const value = fields.email.input.value.trim();
    if (value === '' || !EMAIL_REGEX.test(value)) {
      markInvalid(fields.email.input, fields.email.error, 'Please enter a valid email.');
      return false;
    }
    markValid(fields.email.input, fields.email.error);
    return true;
  }

  /**
   * Validates the Subject field.
   * Rules: must not be empty AND must be at least 5 characters long.
   */
  function validateSubject() {
    const value = fields.subject.input.value.trim();
    if (value === '' || value.length < 5) {
      markInvalid(fields.subject.input, fields.subject.error, 'Subject must contain at least 5 characters.');
      return false;
    }
    markValid(fields.subject.input, fields.subject.error);
    return true;
  }

  /**
   * Validates the Message field.
   * Rules: must not be empty AND must be at least 20 characters long.
   */
  function validateMessage() {
    const value = fields.message.input.value.trim();
    if (value === '' || value.length < 20) {
      markInvalid(fields.message.input, fields.message.error, 'Message must contain at least 20 characters.');
      return false;
    }
    markValid(fields.message.input, fields.message.error);
    return true;
  }

  // Validate each field as the user types/leaves it, for instant feedback
  fields.name.input.addEventListener('input', validateName);
  fields.email.input.addEventListener('input', validateEmail);
  fields.subject.input.addEventListener('input', validateSubject);
  fields.message.input.addEventListener('input', validateMessage);

  // Final validation + submission handling
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // stop the browser's default page-reload submission

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

    if (isFormValid) {
      alert('Message Sent Successfully!');
      form.reset();

      // Remove the valid/invalid styling after reset so the form looks fresh
      Object.values(fields).forEach(({ input, error }) => {
        input.classList.remove('valid', 'invalid');
        input.removeAttribute('aria-invalid');
        error.textContent = '';
      });
    } else {
      // Move keyboard focus to the first invalid field for accessibility
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
    }
  });

});