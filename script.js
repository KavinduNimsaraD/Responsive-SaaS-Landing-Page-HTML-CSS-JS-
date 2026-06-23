const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const revealElements = document.querySelectorAll('.reveal');

const toggleMenu = () => {
  const isOpen = navMenu.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
};

menuToggle.addEventListener('click', toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('is-open')) {
      navMenu.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

document.addEventListener('click', (event) => {
  if (!navMenu.classList.contains('is-open')) {
    return;
  }

  const clickedInsideNav = navMenu.contains(event.target);
  const clickedToggle = menuToggle.contains(event.target);

  if (!clickedInsideNav && !clickedToggle) {
    navMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px',
  }
);

revealElements.forEach((element) => observer.observe(element));

const fields = ['name', 'email', 'subject', 'message'];

const setFieldError = (fieldName, message = '') => {
  const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (errorElement) {
    errorElement.textContent = message;
  }
};

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  let isValid = true;
  formStatus.textContent = '';

  fields.forEach((fieldName) => setFieldError(fieldName));

  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());

  if (!values.name.trim()) {
    setFieldError('name', 'Please enter your name.');
    isValid = false;
  }

  if (!values.email.trim()) {
    setFieldError('email', 'Please enter your email address.');
    isValid = false;
  } else if (!validateEmail(values.email.trim())) {
    setFieldError('email', 'Please enter a valid email address.');
    isValid = false;
  }

  if (!values.subject.trim()) {
    setFieldError('subject', 'Please add a subject.');
    isValid = false;
  }

  if (!values.message.trim()) {
    setFieldError('message', 'Please write a message.');
    isValid = false;
  }

  if (!isValid) {
    formStatus.textContent = 'Please fix the highlighted fields and try again.';
    formStatus.style.color = '#ff8d8d';
    return;
  }

  formStatus.textContent = 'Thanks for reaching out. Your message is ready to send.';
  formStatus.style.color = '#8ce6b8';
  form.reset();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
    navMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus();
  }
});
