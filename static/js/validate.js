// Global variables to store extracted QR data for binding validation
let extractedQRData = [];
let currentDocumentFile = null;

// Validate Document Form Handler
document.addEventListener('DOMContentLoaded', function () {
  // Validate Document Form
  document.getElementById('validateForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Memvalidasi Dokumen...';
    submitBtn.disabled = true;

    showProgress('validateProgress');
    hideResult('validateResult');
    showProcessDetails('validateProcess');
    clearLog('validateLog');
    
    // Reset status and statistics
    updateProgressText('Memulai validasi dokumen...', 'processing');
    updateQRStatus('processing', 'Memproses dokumen...');
    
    // Hide panels that will be shown later
    document.getElementById('bindingValidationPanel').classList.add('hidden');
    document.getElementById('bindingResults').classList.add('hidden');
    document.getElementById('securityAnalysis').classList.add('hidden');
    document.getElementById('validationStatistics').classList.add('hidden');

    const formData = new FormData(this);
    const docxFile = document.getElementById('docxFileValidate').files[0];

    // Store current document for binding validation
    currentDocumentFile = docxFile;

    // Add process steps
    addLogEntry('validateLog', '🚀 Memulai proses validasi dokumen...', 'info');
    addLogEntry('validateLog', `📄 Dokumen: ${docxFile.name} (${(docxFile.size / 1024).toFixed(1)} KB)`, 'info');
    addLogEntry('validateLog', '🔍 Mengekstrak gambar dari dokumen...', 'info');
    addLogEntry('validateLog', '🔓 Mencari watermark QR Code tersembunyi...', 'info');

    try {
      const response = await fetch('/extract_document', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        const startTime = Date.now();
        addLogEntry('validateLog', '✅ Proses ekstraksi berhasil!', 'success');
        addLogEntry('validateLog', `🔍 QR Code ditemukan: ${result.extracted_qrs ? result.extracted_qrs.length : 0}`, 'success');

        // Store extracted QR data for binding validation
        extractedQRData = result.extracted_qrs || [];
        
        // Update progress text
        updateProgressText('Ekstraksi selesai, memproses hasil...', 'processing');
        
        // Calculate processing time
        const processingTime = Date.now() - startTime;
        
        // Update statistics
        updateValidationStatistics(extractedQRData, processingTime);
        
        // Update QR status
        if (extractedQRData.length > 0) {
          updateQRStatus('success', `${extractedQRData.length} QR Code ditemukan`);
        } else {
          updateQRStatus('pending', 'Tidak ada QR Code ditemukan');
        }

        showAlert('validateAlert', `
                    <i class="fas fa-check-circle"></i> 
                    ${result.message}
                `, 'success');

        let qrsHtml = '';
        if (result.extracted_qrs && result.extracted_qrs.length > 0) {
          result.extracted_qrs.forEach((qr, index) => {
            addLogEntry('validateLog', `📋 QR Code ${index + 1}: ${qr.filename}`, 'success');
            qrsHtml += `
                            <div class="extracted-qr">
                                <img src="${qr.url}" alt="Extracted QR ${index + 1}">
                                <div class="extracted-qr-info">
                                    <div class="qr-title">QR Code ${index + 1}</div>
                                    <div class="qr-filename">${qr.filename}</div>
                                </div>
                                <a href="${qr.url}" download="${qr.filename}" class="download-link">
                                    <i class="fas fa-download"></i> Download
                                </a>
                            </div>
                        `;
          });

          // Show binding validation panel if QR codes found
          document.getElementById('bindingValidationPanel').classList.remove('hidden');
          addLogEntry('validateLog', '🔗 QR Code ditemukan! Panel validasi binding tersedia.', 'info');
          updateProgressText('QR Code berhasil diekstrak', 'success');
        } else {
          addLogEntry('validateLog', '⚠️ Tidak ada QR Code watermark yang ditemukan', 'warning');
          qrsHtml = '<div class="no-qr-found"><i class="fas fa-exclamation-triangle"></i><p>Tidak ada QR Code watermark yang ditemukan dalam dokumen.</p></div>';

          // Hide binding validation panel
          document.getElementById('bindingValidationPanel').classList.add('hidden');
          updateProgressText('Validasi selesai - tidak ada QR Code', 'info');
        }

        document.getElementById('extractedQRs').innerHTML = qrsHtml;
        showResult('validateResult');
      } else {
        updateProgressText('Validasi gagal', 'error');
        updateQRStatus('error', 'Validasi gagal');
        
        if (result.error_type === 'NO_IMAGES_FOUND') {
          addLogEntry('validateLog', '⚠️ Dokumen tidak mengandung gambar', 'warning');
          showAlert('validateAlert', `
                        <i class="fas fa-info-circle"></i> 
                        ${result.message}
                    `, 'info');
        } else {
          addLogEntry('validateLog', `❌ Error: ${result.message}`, 'error');
          showAlert('validateAlert', `
                        <i class="fas fa-exclamation-circle"></i> 
                        ${result.message}
                    `, 'error');
        }
      }
    } catch (error) {
      updateProgressText('Terjadi kesalahan', 'error');
      updateQRStatus('error', 'Error sistem');
      addLogEntry('validateLog', `❌ Error tidak terduga: ${error.message}`, 'error');
      showAlert('validateAlert', `
                <i class="fas fa-exclamation-triangle"></i> 
                Error: ${error.message}
            `, 'error');
    } finally {
      hideProgress('validateProgress');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
});

// Binding Validation Function
async function validateBinding() {
  if (!extractedQRData || extractedQRData.length === 0) {
    showAlert('validateAlert', '<i class="fas fa-exclamation-triangle"></i> Tidak ada QR Code untuk divalidasi!', 'error');
    return;
  }

  if (!currentDocumentFile) {
    showAlert('validateAlert', '<i class="fas fa-exclamation-triangle"></i> Dokumen tidak tersedia untuk validasi!', 'error');
    return;
  }

  const validateBtn = document.querySelector('button[onclick="validateBinding()"]');
  const originalText = validateBtn.innerHTML;
  validateBtn.innerHTML = '<span class="loading"></span> Memvalidasi Binding...';
  validateBtn.disabled = true;

  // Show progress and clear previous results
  showProgress('validateProgress');
  document.getElementById('bindingResults').classList.add('hidden');
  document.getElementById('securityAnalysis').classList.add('hidden');
  
  // Update progress status
  updateProgressText('Memvalidasi binding QR-Dokumen...', 'processing');
  updateQRStatus('processing', 'Validasi binding sedang berjalan...');

  // Add binding validation steps to log
  addLogEntry('validateLog', '🔗 Memulai validasi binding QR-Dokumen...', 'info');
  addLogEntry('validateLog', `📋 QR Code yang akan divalidasi: ${extractedQRData.length}`, 'info');

  const deepValidation = document.getElementById('deepValidation').checked;
  const checkExpiry = document.getElementById('checkExpiry').checked;
  
  // Start timing
  const bindingStartTime = Date.now();

  try {
    // Process each extracted QR for binding validation
    let validationResults = [];

    for (let i = 0; i < extractedQRData.length; i++) {
      const qr = extractedQRData[i];
      addLogEntry('validateLog', `🔍 Memvalidasi QR Code ${i + 1}...`, 'info');

      // Create form data for binding validation
      const formData = new FormData();

      // Fetch QR image as blob and add to form data
      try {
        const qrResponse = await fetch(qr.url);
        const qrBlob = await qrResponse.blob();
        formData.append('qrFile', qrBlob, qr.filename);
        formData.append('documentFile', currentDocumentFile);
        formData.append('deepValidation', deepValidation);
        formData.append('checkExpiry', checkExpiry);

        // Call binding validation endpoint
        const response = await fetch('/validate_qr_binding', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          addLogEntry('validateLog', `✅ QR Code ${i + 1}: ${result.validation_result.message || 'Validasi berhasil'}`, 'success');
          validationResults.push({
            index: i + 1,
            qr: qr,
            validation: result.validation_result,
            success: true
          });
        } else {
          addLogEntry('validateLog', `❌ QR Code ${i + 1}: ${result.message || 'Validasi gagal'}`, 'error');
          validationResults.push({
            index: i + 1,
            qr: qr,
            error: result.message,
            success: false
          });
        }
      } catch (qrError) {
        addLogEntry('validateLog', `❌ QR Code ${i + 1}: Error memproses - ${qrError.message}`, 'error');
        validationResults.push({
          index: i + 1,
          qr: qr,
          error: qrError.message,
          success: false
        });
      }
    }

    // Calculate total binding validation time
    const bindingProcessingTime = Date.now() - bindingStartTime;
    
    // Display validation results
    displayBindingResults(validationResults, bindingProcessingTime);

    // Generate security analysis
    generateSecurityAnalysis(validationResults);

    addLogEntry('validateLog', `🏁 Validasi binding selesai dalam ${(bindingProcessingTime/1000).toFixed(1)}s. Hasil: ${validationResults.filter(r => r.success).length}/${validationResults.length} berhasil`, 'info');

  } catch (error) {
    addLogEntry('validateLog', `❌ Error validasi binding: ${error.message}`, 'error');
    showAlert('validateAlert', `<i class="fas fa-exclamation-triangle"></i> Error: ${error.message}`, 'error');
  } finally {
    hideProgress('validateProgress');
    validateBtn.innerHTML = originalText;
    validateBtn.disabled = false;
  }
}

// Display Binding Validation Results
function displayBindingResults(results) {
  let html = '';

  results.forEach(result => {
    if (result.success && result.validation) {
      const validation = result.validation;
      let statusClass = 'binding-status-unknown';
      let statusIcon = 'fas fa-question-circle';
      let statusText = 'Status Tidak Diketahui';

      if (validation.valid && validation.binding_verified) {
        statusClass = 'binding-status-valid';
        statusIcon = 'fas fa-shield-check';
        statusText = 'Binding Valid';
      } else if (validation.valid && validation.is_legacy) {
        statusClass = 'binding-status-legacy';
        statusIcon = 'fas fa-exclamation-triangle';
        statusText = 'QR Legacy (Tanpa Binding)';
      } else {
        statusClass = 'binding-status-invalid';
        statusIcon = 'fas fa-times-circle';
        statusText = 'Binding Tidak Valid';
      }

      html += `
        <div class="binding-result-card ${statusClass}">
          <div class="binding-result-header">
            <div class="qr-thumbnail">
              <img src="${result.qr.url}" alt="QR ${result.index}">
            </div>
            <div class="binding-result-info">
              <h4>QR Code ${result.index}</h4>
              <div class="binding-status">
                <i class="${statusIcon}"></i>
                <span>${statusText}</span>
              </div>
            </div>
          </div>
          
          <div class="binding-result-details">
            <div class="detail-item">
              <strong>Pesan:</strong> ${validation.message || 'Tidak ada pesan'}
            </div>
            
            ${validation.document_fingerprint ? `
              <div class="detail-item">
                <strong>Fingerprint Dokumen:</strong> <code>${validation.document_fingerprint}</code>
              </div>
            ` : ''}
            
            ${validation.security_level ? `
              <div class="detail-item">
                <strong>Level Keamanan:</strong> ${validation.security_level}
              </div>
            ` : ''}
            
            ${validation.issued_at ? `
              <div class="detail-item">
                <strong>Dibuat:</strong> ${new Date(validation.issued_at * 1000).toLocaleString('id-ID')}
              </div>
            ` : ''}
            
            ${validation.expires_at ? `
              <div class="detail-item">
                <strong>Berlaku Sampai:</strong> ${new Date(validation.expires_at * 1000).toLocaleString('id-ID')}
              </div>
            ` : ''}
            
            ${validation.recommendations && validation.recommendations.length > 0 ? `
              <div class="detail-item">
                <strong>Rekomendasi:</strong>
                <ul class="recommendations-list">
                  ${validation.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="binding-result-card binding-status-error">
          <div class="binding-result-header">
            <div class="qr-thumbnail">
              <img src="${result.qr.url}" alt="QR ${result.index}">
            </div>
            <div class="binding-result-info">
              <h4>QR Code ${result.index}</h4>
              <div class="binding-status">
                <i class="fas fa-exclamation-circle"></i>
                <span>Error Validasi</span>
              </div>
            </div>
          </div>
          
          <div class="binding-result-details">
            <div class="detail-item error-message">
              <strong>Error:</strong> ${result.error || 'Error tidak diketahui'}
            </div>
          </div>
        </div>
      `;
    }
  });

  document.getElementById('bindingValidationContent').innerHTML = html;
  document.getElementById('bindingResults').classList.remove('hidden');
  
  // Update validation statistics with binding results
  const processingTime = 0; // This will be calculated in the calling function
  const averageConfidence = results.filter(r => r.success && r.validation && r.validation.confidence)
    .reduce((sum, r) => sum + r.validation.confidence, 0) / Math.max(results.filter(r => r.success).length, 1);
  
  updateValidationStatistics(extractedQRData, processingTime, averageConfidence);
}

// Generate Security Analysis
function generateSecurityAnalysis(results) {
  const totalQRs = results.length;
  const validBindings = results.filter(r => r.success && r.validation && r.validation.valid && r.validation.binding_verified).length;
  const legacyQRs = results.filter(r => r.success && r.validation && r.validation.valid && r.validation.is_legacy).length;
  const invalidBindings = results.filter(r => !r.success || (r.validation && !r.validation.valid)).length;

  let securityScore = 0;
  let securityLevel = 'Rendah';
  let securityColor = '#ef4444';

  if (validBindings === totalQRs) {
    securityScore = 100;
    securityLevel = 'Sangat Tinggi';
    securityColor = '#10b981';
  } else if (validBindings > 0) {
    securityScore = Math.round((validBindings / totalQRs) * 100);
    securityLevel = securityScore > 70 ? 'Tinggi' : 'Sedang';
    securityColor = securityScore > 70 ? '#10b981' : '#f59e0b';
  } else if (legacyQRs > 0) {
    securityScore = 30;
    securityLevel = 'Legacy';
    securityColor = '#f59e0b';
  }

  const html = `
    <div class="security-analysis-content">
      <div class="security-score-card">
        <div class="security-score" style="color: ${securityColor};">
          <div class="score-number">${securityScore}%</div>
          <div class="score-label">Skor Keamanan</div>
        </div>
        <div class="security-level" style="background-color: ${securityColor};">
          ${securityLevel}
        </div>
      </div>
      
      <div class="security-metrics">
        <div class="metric-item">
          <div class="metric-value">${totalQRs}</div>
          <div class="metric-label">Total QR Code</div>
        </div>
        <div class="metric-item">
          <div class="metric-value" style="color: #10b981;">${validBindings}</div>
          <div class="metric-label">Binding Valid</div>
        </div>
        <div class="metric-item">
          <div class="metric-value" style="color: #f59e0b;">${legacyQRs}</div>
          <div class="metric-label">QR Legacy</div>
        </div>
        <div class="metric-item">
          <div class="metric-value" style="color: #ef4444;">${invalidBindings}</div>
          <div class="metric-label">Tidak Valid</div>
        </div>
      </div>
      
      <div class="security-recommendations">
        <h4><i class="fas fa-lightbulb"></i> Rekomendasi Keamanan</h4>
        <div class="recommendations">
          ${validBindings === totalQRs ?
      '<div class="recommendation success"><i class="fas fa-check"></i> Dokumen memiliki tingkat keamanan optimal dengan semua QR code ter-binding dengan benar.</div>' :
      validBindings > 0 ?
        '<div class="recommendation warning"><i class="fas fa-exclamation-triangle"></i> Beberapa QR code tidak ter-binding. Pertimbangkan untuk memperbarui QR code yang tidak aman.</div>' :
        legacyQRs > 0 ?
          '<div class="recommendation warning"><i class="fas fa-info-circle"></i> Dokumen menggunakan QR code legacy. Disarankan upgrade ke sistem binding untuk keamanan lebih baik.</div>' :
          '<div class="recommendation error"><i class="fas fa-times"></i> Dokumen tidak memiliki QR code yang valid. Periksa integritas dokumen.</div>'
    }
          
          ${totalQRs > 1 && validBindings !== totalQRs ?
      '<div class="recommendation info"><i class="fas fa-shield-alt"></i> Untuk keamanan optimal, pastikan semua QR code menggunakan sistem binding terbaru.</div>' : ''
    }
        </div>
      </div>
    </div>
  `;

  document.getElementById('securityAnalysisContent').innerHTML = html;
  document.getElementById('securityAnalysis').classList.remove('hidden');
  
  // Update progress text to show completion
  updateProgressText('Validasi binding selesai', 'success');
  updateQRStatus('success', `${validBindings}/${totalQRs} binding valid`);
}

// Function to update validation statistics
function updateValidationStatistics(qrData, processingTimeMs, averageConfidence = 0) {
  const totalQRs = qrData.length;
  const validQRs = qrData.filter(qr => qr.valid || qr.binding_valid).length;
  const processingTime = (processingTimeMs / 1000).toFixed(1);
  const confidence = Math.round(averageConfidence ||
    (qrData.length > 0 ? qrData.reduce((sum, qr) => sum + (qr.confidence || 0), 0) / qrData.length : 0));

  // Update statistics display
  document.getElementById('qrCount').textContent = totalQRs;
  document.getElementById('validQrCount').textContent = validQRs;
  document.getElementById('processingTime').textContent = processingTime + 's';
  document.getElementById('confidenceScore').textContent = confidence + '%';

  // Show statistics panel
  const statsPanel = document.getElementById('validationStatistics');
  if (statsPanel) {
    statsPanel.classList.remove('hidden');
  }

  // Add animation to stat cards
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = 'translateY(-2px)';
      card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';

      setTimeout(() => {
        card.style.transform = '';
        card.style.boxShadow = '';
      }, 200);
    }, index * 100);
  });
}

// Function to update progress text
function updateProgressText(message, type = 'info') {
  const progressText = document.getElementById('progressText');
  if (progressText) {
    progressText.textContent = message;

    // Add color based on type
    progressText.className = 'progress-text';
    if (type === 'success') {
      progressText.style.color = '#10b981';
    } else if (type === 'error') {
      progressText.style.color = '#ef4444';
    } else if (type === 'processing') {
      progressText.style.color = '#3b82f6';
    } else {
      progressText.style.color = '#64748b';
    }
  }
}

// Function to update QR status badge
function updateQRStatus(status, message) {
  const qrStatus = document.getElementById('qrStatus');
  if (qrStatus) {
    const badge = qrStatus.querySelector('.status-badge');
    if (badge) {
      badge.className = `status-badge status-${status}`;
      badge.textContent = message;
    }
  }
}
