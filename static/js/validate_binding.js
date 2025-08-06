document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bindingValidateForm');
  const resultDiv = document.getElementById('bindingResult');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    resultDiv.textContent = 'Memvalidasi...';
    resultDiv.className = 'binding-result';

    const formData = new FormData(form);

    try {
      const response = await fetch('/validate_document_qr', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        resultDiv.textContent = result.message;
        resultDiv.classList.add(result.matched ? 'success' : 'error');
      } else {
        resultDiv.textContent = result.message || 'Validasi gagal';
        resultDiv.classList.add('error');
      }
    } catch (err) {
      resultDiv.textContent = 'Terjadi kesalahan: ' + err.message;
      resultDiv.classList.add('error');
    }
  });
});
