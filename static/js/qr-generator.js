// Enhanced QR Generator Functionality
function initializeQREnhancements() {
  const qrDataInput = document.getElementById('qrData');
  const optionsToggle = document.getElementById('optionsToggle');
  const optionsContent = document.getElementById('optionsContent');
  const borderSize = document.getElementById('borderSize');
  const borderValue = document.getElementById('borderValue');
  const errorCorrection = document.getElementById('errorCorrection');
  const qrSize = document.getElementById('qrSize');
  const fillColor = document.getElementById('fillColor');
  const backColor = document.getElementById('backColor');

  let debounceTimer;

  // Initialize border range display
  if (borderSize && borderValue) {
    borderSize.addEventListener('input', function () {
      borderValue.textContent = this.value;
      if (qrDataInput && qrDataInput.value.trim()) {
        debouncedQRUpdate();
      }
    });
  }

  // Advanced options toggle (only if elements exist)
  if (optionsToggle && optionsContent) {
    optionsToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      optionsContent.classList.toggle('active');
    });
  }

  // Real-time input handling with debounce
  if (qrDataInput) {
    qrDataInput.addEventListener('input', function () {
      updateCharacterCounter(this.value);
      updateLiveSuggestions(this.value);
      debouncedQRUpdate();
    });
  }

  // Listen to all option changes
  [qrSize].forEach(element => {
    if (element) {
      element.addEventListener('change', function () {
        if (qrDataInput && qrDataInput.value.trim()) {
          debouncedQRUpdate();
        }
      });
    }
  });

  function debouncedQRUpdate() {
    clearTimeout(debounceTimer);
    const data = qrDataInput.value.trim();

    if (!data) {
      resetPreview();
      return;
    }

    setPreviewStatus('generating', 'Membuat...');

    debounceTimer = setTimeout(() => {
      generateRealtimePreview(data);
    }, 300);
  }

  function updateCharacterCounter(text) {
    const charCount = document.getElementById('charCount');
    const charStatus = document.getElementById('charStatus');
    const counterFill = document.getElementById('counterFill');
    const length = text.length;

    if (charCount) {
      charCount.textContent = length;
    }

    // Remove existing classes
    if (counterFill) {
      counterFill.className = 'counter-fill';
    }
    if (charStatus) {
      charStatus.className = 'char-status';
    }

    let status, statusText, percentage;

    if (length <= 50) {
      status = 'optimal';
      statusText = 'Optimal';
      percentage = (length / 50) * 100;
    } else if (length <= 100) {
      status = 'good';
      statusText = 'Baik';
      percentage = ((length - 50) / 50) * 100;
    } else if (length <= 200) {
      status = 'acceptable';
      statusText = 'Dapat Diterima';
      percentage = ((length - 100) / 100) * 100;
    } else {
      status = 'problematic';
      statusText = 'Bermasalah';
      percentage = 100;
    }

    if (counterFill) {
      counterFill.classList.add(status);
      counterFill.style.width = Math.min(percentage, 100) + '%';
    }
    if (charStatus) {
      charStatus.classList.add(status);
      charStatus.textContent = statusText;
    }
  }

  function updateLiveSuggestions(text) {
    const suggestions = document.getElementById('liveSuggestions');
    const length = text.length;

    if (!suggestions) {
      return;
    }

    if (length === 0) {
      suggestions.innerHTML = '';
      return;
    }

    let suggestionText = '';

    if (length <= 50) {
      suggestionText = '<i class="fas fa-check-circle" style="color: var(--success-color);"></i> Panjang ideal untuk steganografi';
    } else if (length <= 100) {
      suggestionText = '<i class="fas fa-info-circle" style="color: #fbbf24;"></i> Masih dalam batas yang baik';
    } else if (length <= 200) {
      suggestionText = '<i class="fas fa-exclamation-triangle" style="color: var(--warning-color);"></i> Mungkin akan mengurangi kualitas steganografi';
    } else {
      suggestionText = '<i class="fas fa-times-circle" style="color: var(--error-color);"></i> Terlalu panjang, dapat menyebabkan masalah embedding';
    }

    suggestions.innerHTML = suggestionText;
  }

  function setPreviewStatus(status, text) {
    const previewStatus = document.getElementById('previewStatus');
    if (previewStatus) {
      previewStatus.className = `preview-status ${status}`;
      previewStatus.textContent = text;
    }
  }

  function resetPreview() {
    const container = document.getElementById('qrPreviewContainer');
    if (container) {
      container.innerHTML = `
              <div class="preview-placeholder">
                  <i class="fas fa-qrcode"></i>
                  <p>QR Code akan muncul di sini</p>
              </div>
          `;
    }
    setPreviewStatus('ready', 'Siap');
    resetAnalysis();
    resetCapacityAnalysis();
  }

  function resetAnalysis() {
    ['qrVersion', 'qrDimensions', 'qrCapacity', 'qrDensity'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = '-';
      }
    });
  }

  function resetCapacityAnalysis() {
    const usagePercentage = document.getElementById('usagePercentage');
    const usageFill = document.getElementById('usageFill');

    if (usagePercentage) {
      usagePercentage.textContent = '0%';
    }
    if (usageFill) {
      usageFill.style.width = '0%';
    }

    ['capacityL', 'capacityM', 'capacityQ', 'capacityH'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = '-';
      }
    });

    document.querySelectorAll('.level-item').forEach(item => {
      item.classList.remove('active');
    });

    updateSteganographyCompatibility(0, 'unknown');
  }

  async function generateRealtimePreview(data) {
    try {
      const formData = new FormData();
      formData.append('qrData', data);
      formData.append('errorCorrection', 'M'); // Default to M level
      formData.append('qrSize', qrSize ? qrSize.value : '10');
      formData.append('borderSize', borderSize ? borderSize.value : '4');
      formData.append('fillColor', '#000000'); // Default black
      formData.append('backColor', '#ffffff'); // Default white
      formData.append('preview', 'true');

      const response = await fetch('/generate_qr_realtime', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        displayPreview(result);
        updateAnalysis(result.analysis);
        updateCapacityAnalysis(result.capacity);
        setPreviewStatus('ready', 'Selesai');
      } else {
        setPreviewStatus('error', 'Error');
        console.error('QR Generation Error:', result.message);
      }
    } catch (error) {
      setPreviewStatus('error', 'Error');
      console.error('Network Error:', error);
    }
  }

  function displayPreview(result) {
    const container = document.getElementById('qrPreviewContainer');
    if (container) {
      container.innerHTML = `<img src="${result.qr_url}?t=${Date.now()}" alt="QR Code Preview">`;
    }
  }

  function updateAnalysis(analysis) {
    const qrVersion = document.getElementById('qrVersion');
    const qrDimensions = document.getElementById('qrDimensions');
    const qrCapacity = document.getElementById('qrCapacity');
    const qrDensity = document.getElementById('qrDensity');

    if (qrVersion) {
      qrVersion.textContent = analysis.version || '-';
    }
    if (qrDimensions) {
      qrDimensions.textContent = analysis.dimensions ? `${analysis.dimensions.width}×${analysis.dimensions.height}` : '-';
    }
    if (qrCapacity) {
      qrCapacity.textContent = analysis.capacity ? `${analysis.capacity} chars` : '-';
    }
    if (qrDensity) {
      qrDensity.textContent = analysis.density ? `${analysis.density}%` : '-';
    }
  }

  function updateCapacityAnalysis(capacity) {
    const currentLength = qrDataInput ? qrDataInput.value.length : 0;

    // Update capacity levels (only if elements exist)
    ['L', 'M', 'Q', 'H'].forEach(level => {
      const maxCapacity = capacity[level.toLowerCase()] || 0;
      const capacityElement = document.getElementById(`capacity${level}`);
      if (capacityElement) {
        capacityElement.textContent = `${maxCapacity} chars`;
      }

      // Highlight active level (only if elements exist)
      const levelItem = document.querySelector(`[data-level="${level}"]`);
      if (levelItem) {
        // Default to 'M' level since we removed errorCorrection selector
        if (level === 'M') {
          levelItem.classList.add('active');
        } else {
          levelItem.classList.remove('active');
        }
      }
    });

    // Update usage meter (only if elements exist)
    const currentCapacity = capacity['m'] || 1; // Use M level as default
    const usagePercentage = Math.min((currentLength / currentCapacity) * 100, 100);

    const usagePercentageElement = document.getElementById('usagePercentage');
    if (usagePercentageElement) {
      usagePercentageElement.textContent = `${Math.round(usagePercentage)}%`;
    }

    const usageFill = document.getElementById('usageFill');
    if (usageFill) {
      usageFill.style.width = `${usagePercentage}%`;

      // Color code the usage bar
      usageFill.className = 'meter-fill';
      if (usagePercentage <= 50) {
        usageFill.style.background = 'var(--success-color)';
      } else if (usagePercentage <= 75) {
        usageFill.style.background = '#fbbf24';
      } else if (usagePercentage <= 90) {
        usageFill.style.background = 'var(--warning-color)';
      } else {
        usageFill.style.background = 'var(--error-color)';
      }
    }

    // Update steganography compatibility
    updateSteganographyCompatibility(currentLength, usagePercentage);
  }

  function updateSteganographyCompatibility(textLength, usagePercentage) {
    const indicator = document.getElementById('stegoIndicator');
    const text = document.getElementById('stegoText');
    const details = document.getElementById('stegoDetails');

    let status, statusText, detailText;

    if (textLength === 0) {
      status = 'unknown';
      statusText = 'Menunggu input...';
      detailText = '';
    } else if (textLength <= 50 && usagePercentage <= 50) {
      status = 'excellent';
      statusText = 'Sangat Baik untuk Steganografi';
      detailText = 'QR Code berukuran kecil dengan data minimal akan mudah disembunyikan dan tidak terdeteksi.';
    } else if (textLength <= 100 && usagePercentage <= 75) {
      status = 'good';
      statusText = 'Baik untuk Steganografi';
      detailText = 'QR Code masih dalam ukuran yang dapat disembunyikan dengan baik dalam gambar.';
    } else if (textLength <= 200 && usagePercentage <= 90) {
      status = 'fair';
      statusText = 'Cukup untuk Steganografi';
      detailText = 'QR Code berukuran sedang, mungkin sedikit terlihat dalam gambar dengan resolusi rendah.';
    } else {
      status = 'poor';
      statusText = 'Kurang Ideal untuk Steganografi';
      detailText = 'QR Code berukuran besar akan sulit disembunyikan dan dapat memengaruhi kualitas gambar.';
    }

    if (indicator) {
      indicator.className = `status-indicator ${status}`;
    }
    if (text) {
      text.textContent = statusText;
    }
    if (details) {
      details.textContent = detailText;
    }
  }

  // Initialize with empty state
  resetPreview();
}

// Generate QR Code Form Handler
document.addEventListener('DOMContentLoaded', function () {
  initializeQREnhancements();

  // Generate QR Code Form
  document.getElementById('generateForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Membuat QR Code...';
    submitBtn.disabled = true;

    showProgress('generateProgress');
    hideResult('generateResult');
    showProcessDetails('generateProcess');
    clearLog('generateLog');

    const qrData = document.getElementById('qrData').value;
    const qrSize = document.getElementById('qrSize').value;
    const borderSize = document.getElementById('borderSize').value;

    // Create form data with enhanced parameters
    const formData = new FormData();
    formData.append('qrData', qrData);
    formData.append('errorCorrection', 'M'); // Default to M level
    formData.append('qrSize', qrSize);
    formData.append('borderSize', borderSize);
    formData.append('fillColor', '#000000'); // Default black
    formData.append('backColor', '#ffffff'); // Default white
    formData.append('preview', 'false'); // Final generation, not preview

    // Add process steps
    addLogEntry('generateLog', '🚀 Memulai proses pembuatan QR Code...', 'info');
    addLogEntry('generateLog', `📝 Data input: "${qrData}"`, 'info');
    addLogEntry('generateLog', `📏 Panjang data: ${qrData.length} karakter`, 'info');
    addLogEntry('generateLog', `⚙️ Error Correction: M`, 'info');
    addLogEntry('generateLog', `📐 Ukuran: ${qrSize}x`, 'info');

    try {
      const response = await fetch('/generate_qr_realtime', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        addLogEntry('generateLog', '✅ QR Code berhasil dibuat!', 'success');
        addLogEntry('generateLog', `💾 File tersimpan: ${result.qr_filename}`, 'success');
        addLogEntry('generateLog', `📊 Version: ${result.analysis.version}`, 'info');
        addLogEntry('generateLog', `📏 Dimensi: ${result.analysis.dimensions.width}×${result.analysis.dimensions.height}`, 'info');
        addLogEntry('generateLog', `📈 Kapasitas: ${result.analysis.capacity} chars`, 'info');

        showAlert('generateAlert', `
                    <i class="fas fa-check-circle"></i> 
                    ${result.message}
                `, 'success');

        const qrPreview = document.getElementById('qrPreview');
        if (qrPreview) {
          qrPreview.innerHTML = `
                      <img src="${result.qr_url}" alt="QR Code">
                      <p><strong>Data:</strong> ${qrData}</p>
                      <div class="qr-details">
                          <div class="detail-item">
                              <span class="detail-label">Version:</span>
                              <span class="detail-value">${result.analysis.version}</span>
                          </div>
                          <div class="detail-item">
                              <span class="detail-label">Dimensi:</span>
                              <span class="detail-value">${result.analysis.dimensions.width}×${result.analysis.dimensions.height}</span>
                          </div>
                          <div class="detail-item">
                              <span class="detail-label">Error Correction:</span>
                              <span class="detail-value">M</span>
                          </div>
                          <div class="detail-item">
                              <span class="detail-label">Penggunaan:</span>
                              <span class="detail-value">${result.analysis.density}%</span>
                          </div>
                      </div>
                  `;
        }

        const qrDownload = document.getElementById('qrDownload');
        if (qrDownload) {
          qrDownload.innerHTML = `
                      <a href="${result.qr_url}" download="${result.qr_filename}" class="download-link">
                          <i class="fas fa-download"></i> Download QR Code
                      </a>
                  `;
        }

        showResult('generateResult');
      } else {
        addLogEntry('generateLog', `❌ Error: ${result.message}`, 'error');
        showAlert('generateAlert', `
                    <i class="fas fa-exclamation-circle"></i> 
                    ${result.message}
                `, 'error');
      }
    } catch (error) {
      addLogEntry('generateLog', `❌ Error tidak terduga: ${error.message}`, 'error');
      showAlert('generateAlert', `
                <i class="fas fa-exclamation-triangle"></i> 
                Error: ${error.message}
            `, 'error');
    } finally {
      hideProgress('generateProgress');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}); 
