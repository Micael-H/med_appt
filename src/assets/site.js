// Small enhancements for static pages. No credentials are stored or transmitted.
document.documentElement.classList.add('js');
const toggle = document.querySelector('.nav-toggle');
const navigation = document.getElementById('primary-navigation');
if (toggle && navigation) {
  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', () => setOpen(false));
}
document.querySelectorAll('[data-static-form]').forEach(form => {
  const status = form.querySelector('[data-form-status]');
  form.addEventListener('submit', event => {
    event.preventDefault();
    // Browser-native required/type/minlength validation runs before submit.
    form.reset();
    if (status) {
      status.hidden = false;
      status.textContent = 'Layout test completed. No data was sent and no account was created. Authentication will be added in a later module.';
    }
  });
  form.addEventListener('reset', () => {
    if (status) { status.hidden = true; status.textContent = ''; }
  });
  // Enable inputs only after their no-network submit handler is installed.
  form.querySelector('[data-static-fields]')?.removeAttribute('disabled');
});
