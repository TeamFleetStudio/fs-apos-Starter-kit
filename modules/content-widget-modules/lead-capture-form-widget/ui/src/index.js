export default () => {
  // Initialize all lead capture forms
  const forms = document.querySelectorAll('.lead-capture-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const widget = form.closest('.lead-capture-form-widget');
      const submitBtn = form.querySelector('.lead-capture-submit-btn');
      const formData = new FormData(form);
      const action = form.getAttribute('action') || '/api/lead-capture';
      
      // Set loading state
      widget.classList.add('is-submitting');
      widget.classList.remove('is-success', 'is-error');
      submitBtn.disabled = true;
      
      try {
        const response = await fetch(action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(formData))
        });
        
        if (response.ok) {
          widget.classList.remove('is-submitting');
          widget.classList.add('is-success');
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        widget.classList.remove('is-submitting');
        widget.classList.add('is-error');
        console.error('Form submission error:', error);
      } finally {
        submitBtn.disabled = false;
      }
    });
  });
};
