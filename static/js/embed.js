// Secure Document Embedding - Integrated Workflow Handler
document.addEventListener('DOMContentLoaded', function () {
  // Initialize the integrated embed form
  initializeEmbedForm();

  // Initialize security options
  initSecurityOptions();

  // Initialize QR input mode handling
  initQRInputMode();

  // Initialize real-time QR preview
  initQRPreview();
});

function initializeEmbedForm() {
  const form = document.getElementById('embedForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    await handleIntegratedEmbedding(this);
  });

  // Initialize document file handling
  initDocumentFileHandling();
}

function initDocumentFileHandling() {
  const documentFileInput = document.getElementById('documentFile');
  if (!documentFileInput) return;

  documentFileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      showDocumentPreview(file);
      // Simulate document analysis for image detection
      analyzeDocumentForImages(file);
    } else {
      hideDocumentPreview();
    }
  });
}

function showDocumentPreview(file) {
  const preview = document.getElementById('documentPreview');
  const filename = document.getElementById('previewFilename');
  const size = document.getElementById('previewSize');

  if (!preview || !filename || !size) return;

  // Format file size
  const fileSize = formatFileSize(file.size);

  // Update preview information
  filename.textContent = file.name;
  size.textContent = fileSize;

  // Show preview
  preview.style.display = 'block';
}

function hideDocumentPreview() {
  const preview = document.getElementById('documentPreview');
  if (preview) {
    preview.style.display = 'none';
  }
  hideAllStatusIndicators();
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function analyzeDocumentForImages(file) {
  // Show checking status
  showStatusIndicator('checking');

  try {
    // Create a FormData to send the file for analysis
    const formData = new FormData();
    formData.append('documentFile', file);

    // This is a mock analysis - in a real implementation, you might want to
    // create a separate endpoint for document analysis
    // For now, we'll simulate the analysis based on file type and name

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock analysis logic
    const fileName = file.name.toLowerCase();
    const hasLikelyImages = fileName.includes('image') ||
      fileName.includes('gambar') ||
      fileName.includes('foto') ||
      fileName.includes('picture') ||
      file.size > 500000; // Assume larger files might have images

    if (hasLikelyImages) {
      const mockImageCount = Math.floor(Math.random() * 5) + 1;
      showStatusIndicator('has-images', mockImageCount);
    } else {
      showStatusIndicator('no-images');
    }

  } catch (error) {
    console.error('Error analyzing document:', error);
    showStatusIndicator('error', 0, error.message);
  }
}

function showStatusIndicator(type, imageCount = 0, errorMessage = '') {
  hideAllStatusIndicators();

  const statusMap = {
    'checking': 'statusChecking',
    'has-images': 'statusHasImages',
    'no-images': 'statusNoImages',
    'error': 'statusError'
  };

  const elementId = statusMap[type];
  const element = document.getElementById(elementId);

  if (!element) return;

  if (type === 'has-images' && imageCount > 0) {
    const countElement = document.getElementById('imageCount');
    if (countElement) {
      countElement.textContent = imageCount;
    }
  }

  if (type === 'error' && errorMessage) {
    const errorDesc = document.getElementById('errorDescription');
    if (errorDesc) {
      errorDesc.textContent = errorMessage;
    }
  }

  element.style.display = 'flex';
}

function hideAllStatusIndicators() {
  const indicators = ['statusChecking', 'statusHasImages', 'statusNoImages', 'statusError'];
  indicators.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
    }
  });
}

// Global functions for button actions
function showImageRequirements() {
  // Scroll to requirements section
  const requirements = document.querySelector('.document-requirements');
  if (requirements) {
    requirements.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Add a highlight effect
    requirements.style.transform = 'scale(1.02)';
    requirements.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';

    setTimeout(() => {
      requirements.style.transform = '';
      requirements.style.boxShadow = '';
    }, 2000);
  }
}

function retryDocumentAnalysis() {
  const fileInput = document.getElementById('documentFile');
  const file = fileInput?.files[0];

  if (file) {
    analyzeDocumentForImages(file);
  }
}

function initQRInputMode() {
  const radioButtons = document.querySelectorAll('input[name="qrInputMode"]');
  const qrTextSection = document.getElementById('qrTextSection');
  const qrFileSection = document.getElementById('qrFileSection');
  const qrPreviewSection = document.getElementById('qrPreviewSection');
  const securityValidation = document.getElementById('securityValidation');
  const embedButtonText = document.getElementById('embedButtonText');

  if (!radioButtons.length || !qrTextSection || !qrFileSection || !embedButtonText) {
    console.warn('QR input mode elements not found in DOM');
    return;
  }

  radioButtons.forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.value === 'text') {
        qrTextSection.style.display = 'block';
        qrFileSection.style.display = 'none';
        if (qrPreviewSection) qrPreviewSection.style.display = 'block';
        if (securityValidation) securityValidation.style.display = 'none';
        embedButtonText.textContent = 'Generate & Embed Secure QR';

        // Clear file input
        const qrFileInput = document.getElementById('qrFile');
        if (qrFileInput) qrFileInput.value = '';
      } else {
        qrTextSection.style.display = 'none';
        qrFileSection.style.display = 'block';
        if (qrPreviewSection) qrPreviewSection.style.display = 'none';
        if (securityValidation) securityValidation.style.display = 'block';
        embedButtonText.textContent = 'Validate & Embed QR';

        // Clear text input
        const qrDataInput = document.getElementById('qrData');
        if (qrDataInput) qrDataInput.value = '';
        clearQRPreview();
      }
    });
  });
}

function initQRPreview() {
  const qrDataInput = document.getElementById('qrData');
  const charCount = document.getElementById('charCount');
  const capacityAnalysis = document.getElementById('capacityAnalysis');

  let previewTimeout;

  qrDataInput.addEventListener('input', function () {
    const text = this.value;
    charCount.textContent = text.length;

    // Update capacity analysis
    updateCapacityAnalysis(text);

    // Debounced QR preview generation
    clearTimeout(previewTimeout);
    if (text.trim()) {
      previewTimeout = setTimeout(() => {
        generateQRPreview(text);
      }, 500);
    } else {
      clearQRPreview();
    }
  });
}

function updateCapacityAnalysis(text) {
  const capacityAnalysis = document.getElementById('capacityAnalysis');

  if (!text) {
    capacityAnalysis.textContent = '';
    return;
  }

  let analysis = '';
  if (text.length < 50) {
    analysis = '• Low density QR code';
  } else if (text.length < 200) {
    analysis = '• Medium density QR code';
  } else if (text.length < 500) {
    analysis = '• High density QR code';
  } else {
    analysis = '• Very high density - may affect readability';
  }

  capacityAnalysis.textContent = analysis;
}

async function generateQRPreview(text) {
  const qrPreview = document.getElementById('qrPreview');

  try {
    // Show loading state
    qrPreview.innerHTML = '<div class="qr-loading"><i class="fas fa-spinner fa-spin"></i><span>Generating preview...</span></div>';

    // Make request to generate QR preview
    const response = await fetch('/generate_qr_preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: text })
    });

    const result = await response.json();

    if (result.success) {
      // Display QR image
      qrPreview.innerHTML = `<img src="${result.qr_url}" alt="QR Preview">`;

      // Update QR info
      document.getElementById('qrVersion').textContent = result.analysis?.version || '-';
      document.getElementById('qrSize').textContent = result.analysis?.size || '-';
      document.getElementById('qrErrorCorrection').textContent = result.analysis?.error_correction || '-';
    } else {
      qrPreview.innerHTML = '<div class="qr-error"><i class="fas fa-exclamation-triangle"></i><span>Preview failed</span></div>';
    }
  } catch (error) {
    console.error('QR preview error:', error);
    qrPreview.innerHTML = '<div class="qr-error"><i class="fas fa-exclamation-triangle"></i><span>Preview unavailable</span></div>';
  }
}

function clearQRPreview() {
  const qrPreview = document.getElementById('qrPreview');
  qrPreview.innerHTML = '<i class="fas fa-qrcode"></i><span>QR preview will appear here</span>';

  // Reset QR info
  document.getElementById('qrVersion').textContent = '-';
  document.getElementById('qrSize').textContent = '-';
  document.getElementById('qrErrorCorrection').textContent = '-';
}

function initSecurityOptions() {
  const securityToggle = document.getElementById('enableSecurity');
  const securityConfig = document.getElementById('securityConfig');
  const securityTitle = document.getElementById('securityTitle');
  const securitySubtitle = document.getElementById('securitySubtitle');
  const securityIcon = document.getElementById('securityIcon');

  securityToggle.addEventListener('change', function () {
    if (this.checked) {
      securityConfig.style.display = 'block';
      securityTitle.textContent = 'Security Level: High';
      securitySubtitle.textContent = 'QR will be cryptographically bound to document';
      securityIcon.innerHTML = '<i class="fas fa-shield-alt"></i>';
    } else {
      securityConfig.style.display = 'none';
      securityTitle.textContent = 'Security Level: None';
      securitySubtitle.textContent = 'Standard QR code without binding';
      securityIcon.innerHTML = '<i class="fas fa-qrcode"></i>';
    }
  });

  // Expiry time change handler
  const expirySelect = document.getElementById('expiryHours');
  expirySelect.addEventListener('change', function () {
    updateSecurityStatus(this.value);
  });
}

function updateSecurityStatus(expiryHours) {
  const securitySubtitle = document.getElementById('securitySubtitle');
  const hours = parseInt(expiryHours);

  let timeText;
  if (hours === 1) {
    timeText = '1 hour';
  } else if (hours < 24) {
    timeText = `${hours} hours`;
  } else if (hours === 24) {
    timeText = '1 day';
  } else if (hours < 168) {
    timeText = `${Math.round(hours / 24)} days`;
  } else {
    timeText = '1 week';
  }

  securitySubtitle.textContent = `QR binding expires in ${timeText}`;
}

async function handleIntegratedEmbedding(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  // Update button state
  submitBtn.innerHTML = '<span class="loading"></span> Processing...';
  submitBtn.disabled = true;

  // Show progress container
  showProgressContainer();
  hideResults();

  // Clear any previous alerts
  clearAlert();

  try {
    // Validate form
    const validation = validateEmbedForm(form);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Prepare form data
    const formData = new FormData(form);

    // Set progress to step 1
    updateProgressStep(1, 'Preparing request...');

    // Get input mode and prepare data accordingly
    const qrInputMode = document.querySelector('input[name="qrInputMode"]:checked').value;

    if (qrInputMode === 'text') {
      const qrData = document.getElementById('qrData').value.trim();
      if (!qrData) {
        throw new Error('Please enter QR code data');
      }
    } else {
      const qrFile = document.getElementById('qrFile').files[0];
      if (!qrFile) {
        throw new Error('Please select a QR code file');
      }
    }

    // Update progress to step 2
    updateProgressStep(2, 'Generating QR code...');

    // Make request to integrated endpoint
    const response = await fetch('/embed_document_secure', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      // Update progress to completion
      updateProgressStep(4, 'Complete!');

      // Display results
      await displayIntegratedResults(result);

      // Show success message
      showAlert('Document embedding completed successfully!', 'success');
    } else {
      // Handle specific error types
      if (result.security_error) {
        await handleSecurityError(result);
      } else if (result.error_type === 'NO_IMAGES_FOUND') {
        showNoImagesFoundError(result);
      } else {
        showAlert(result.message || 'Embedding process failed', 'error');
      }

      hideProgressContainer();
    }

  } catch (error) {
    console.error('Embedding error:', error);
    showAlert(error.message || 'An error occurred during processing', 'error');
    hideProgressContainer();
  } finally {
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

function validateEmbedForm(form) {
  const documentFile = document.getElementById('documentFile').files[0];
  if (!documentFile) {
    return { valid: false, message: 'Please select a document file' };
  }

  const qrInputMode = document.querySelector('input[name="qrInputMode"]:checked').value;

  if (qrInputMode === 'text') {
    const qrData = document.getElementById('qrData').value.trim();
    if (!qrData) {
      return { valid: false, message: 'Please enter QR code data' };
    }
  } else {
    const qrFile = document.getElementById('qrFile').files[0];
    if (!qrFile) {
      return { valid: false, message: 'Please select a QR code file' };
    }
  }

  return { valid: true };
}

function showProgressContainer() {
  const progressContainer = document.getElementById('progressContainer');
  progressContainer.style.display = 'block';

  // Reset all steps
  const steps = document.querySelectorAll('.step');
  steps.forEach(step => {
    step.classList.remove('active', 'completed');
  });
}

function hideProgressContainer() {
  const progressContainer = document.getElementById('progressContainer');
  progressContainer.style.display = 'none';
}

function updateProgressStep(stepNumber, message) {
  const progressText = document.getElementById('progressText');
  const steps = document.querySelectorAll('.step');

  progressText.textContent = message;

  // Update step indicators
  steps.forEach((step, index) => {
    const stepNum = index + 1;
    if (stepNum < stepNumber) {
      step.classList.add('completed');
      step.classList.remove('active');
    } else if (stepNum === stepNumber) {
      step.classList.add('active');
      step.classList.remove('completed');
    } else {
      step.classList.remove('active', 'completed');
    }
  });

  // Update progress bar
  const progressFill = document.querySelector('.progress-fill');
  const percentage = (stepNumber / 4) * 100;
  progressFill.style.width = `${percentage}%`;
}

async function displayIntegratedResults(result) {
  const embedResult = document.getElementById('embedResult');
  embedResult.style.display = 'block';

  // Hide progress container
  hideProgressContainer();

  // Display document download
  displayDocumentDownload(result.document);

  // Display QR information
  displayQRInformation(result.qr);

  // Display security information if available
  if (result.security && result.security.security_level !== 'none') {
    displaySecurityInformation(result.security);
  }

  // Display quality metrics
  if (result.quality_metrics) {
    displayQualityMetrics(result.quality_metrics);
  }

  // Display processed images
  if (result.processed_images && result.processed_images.length > 0) {
    displayProcessedImages(result.processed_images, result.public_dir);
  }
}

function displayDocumentDownload(documentInfo) {
  const downloadSection = document.getElementById('embedDownload');
  downloadSection.innerHTML = `
        <div class="download-item">
            <div class="download-icon">
                <i class="fas fa-download"></i>
            </div>
            <div class="download-info">
                <div class="download-name">${documentInfo.filename}</div>
                <div class="download-type">${documentInfo.type.toUpperCase()} Document</div>
            </div>
            <a href="${documentInfo.download_url}" class="btn btn-download" download>
                <i class="fas fa-download"></i> Download
            </a>
        </div>
    `;
}

function displayQRInformation(qrInfo) {
  const qrResultInfo = document.getElementById('qrResultInfo');
  const qrGenerated = qrInfo.generated ? 'Generated from text' : 'Uploaded file';
  const qrData = qrInfo.data || 'N/A';

  qrResultInfo.innerHTML = `
        <div class="info-grid">
            <div class="info-item">
                <label>Source:</label>
                <span>${qrGenerated}</span>
            </div>
            <div class="info-item">
                <label>Data:</label>
                <span class="qr-data">${qrData.length > 100 ? qrData.substring(0, 100) + '...' : qrData}</span>
            </div>
            ${qrInfo.url ? `
            <div class="info-item full-width">
                <label>Preview:</label>
                <img src="${qrInfo.url}" alt="Generated QR Code" class="qr-result-image">
            </div>
            ` : ''}
        </div>
    `;
}

function displaySecurityInformation(securityInfo) {
  const securityResultSection = document.getElementById('securityResultSection');
  const securityResultInfo = document.getElementById('securityResultInfo');

  securityResultSection.style.display = 'block';

  let securityContent = `
        <div class="security-status-display">
            <div class="security-level security-level-${securityInfo.security_level}">
                <i class="fas fa-shield-alt"></i>
                <span>Security Level: ${securityInfo.security_level.charAt(0).toUpperCase() + securityInfo.security_level.slice(1)}</span>
            </div>
    `;

  if (securityInfo.binding_id) {
    securityContent += `
            <div class="security-details">
                <div class="security-item">
                    <label>Binding ID:</label>
                    <span class="binding-id">${securityInfo.binding_id}</span>
                </div>
                <div class="security-item">
                    <label>Expires:</label>
                    <span>${new Date(securityInfo.expiry_time * 1000).toLocaleString()}</span>
                </div>
            </div>
        `;
  }

  securityContent += '</div>';
  securityResultInfo.innerHTML = securityContent;
}

function displayQualityMetrics(metrics) {
  const embedMetrics = document.getElementById('embedMetrics');

  if (!embedMetrics) {
    console.warn('Embed metrics element not found');
    return;
  }

  if (metrics && metrics.mse !== undefined && metrics.mse !== null &&
    metrics.psnr !== undefined && metrics.psnr !== null) {
    embedMetrics.innerHTML = `
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-label">MSE (Mean Squared Error)</div>
                    <div class="metric-value">${metrics.mse.toFixed(6)}</div>
                    <div class="metric-description">Lower is better (less distortion)</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">PSNR (Peak Signal-to-Noise Ratio)</div>
                    <div class="metric-value">${metrics.psnr.toFixed(2)} dB</div>
                    <div class="metric-description">Higher is better (${getQualityRating(metrics.psnr)})</div>
                </div>
            </div>
        `;
  } else {
    embedMetrics.innerHTML = '<p>Quality metrics not available</p>';
  }
}

function displayProcessedImages(processedImages, publicDir) {
  const processedImagesContainer = document.getElementById('processedImages');

  if (!processedImagesContainer) {
    console.warn('Processed images container not found');
    return;
  }

  if (!processedImages || processedImages.length === 0) {
    processedImagesContainer.innerHTML = `
      <div class="no-images-message">
        <i class="fas fa-images"></i>
        <p>Tidak ada gambar yang diproses</p>
      </div>
    `;
    return;
  }

  // Debug logging
  console.log('Processing images:', processedImages);
  console.log('Public dir:', publicDir);

  let imagesHtml = '<div class="image-comparison-grid">';

  processedImages.forEach((imageInfo, index) => {
    // Debug log for each image
    console.log(`Image ${index}:`, imageInfo);

    // Construct proper image URLs based on the structure from main.py
    // The paths are returned as "public_dir_name/filename"
    let originalUrl, watermarkedUrl;

    if (imageInfo.original) {
      // Paths from main.py are like "processed_xyz/original_0.png"
      originalUrl = `/static/generated/${imageInfo.original}`;
    }

    if (imageInfo.watermarked) {
      // Paths from main.py are like "processed_xyz/watermarked_0.png"  
      watermarkedUrl = `/static/generated/${imageInfo.watermarked}`;
    }

    console.log(`Image ${index} URLs - Original: ${originalUrl}, Watermarked: ${watermarkedUrl}`);

    // Add error handling for missing images
    imagesHtml += `
            <div class="image-comparison-item">
                <div class="image-pair">
                    <div class="image-container">
                        ${originalUrl ? `
                        <img src="${originalUrl}" 
                             alt="Original Image ${index + 1}"
                             onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk3YTNiNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KICA8L3N2Zz4='; this.parentElement.querySelector('.image-label').innerHTML = 'Original (Not Found)';">
                        ` : '<div class="image-placeholder">Original image not available</div>'}
                        <div class="image-label original-label">
                            <i class="fas fa-image"></i> Gambar Asli
                        </div>
                    </div>
                    <div class="image-container watermarked-container">
                        ${watermarkedUrl ? `
                        <img src="${watermarkedUrl}" 
                             alt="Gambar dengan QR Watermark ${index + 1}"
                             onload="console.log('Watermarked image ${index} loaded successfully'); this.parentElement.classList.add('watermark-success');"
                             onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk3YTNiNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KICA8L3N2Zz4='; this.parentElement.querySelector('.image-label').innerHTML = 'Watermarked (Not Found)';">
                        ` : '<div class="image-placeholder">Watermarked image not available</div>'}
                        <div class="image-label watermarked-label">
                            <i class="fas fa-shield-alt"></i> Dengan QR Watermark (LSB Steganografi)
                        </div>
                    </div>
                </div>
                <div class="image-metrics">
                    <div class="metric">
                        <span><i class="fas fa-hashtag"></i> Gambar</span>
                        <span>${index + 1}</span>
                    </div>
                    <div class="metric">
                        <span><i class="fas fa-check-circle"></i> Status</span>
                        <span class="success-badge">✓ LSB Embedding Berhasil</span>
                    </div>
                    <div class="metric">
                        <span><i class="fas fa-eye-slash"></i> Metode</span>
                        <span class="method-badge">LSB Steganografi</span>
                    </div>
                </div>
                <div class="steganography-info">
                    <div class="info-header">
                        <i class="fas fa-info-circle"></i>
                        <span>Informasi Steganografi</span>
                    </div>
                    <div class="info-content">
                        <p><strong>QR Code</strong> telah disematkan secara tersembunyi menggunakan teknik <strong>LSB (Least Significant Bit)</strong>. Gambar hasil terlihat identik dengan mata biasa, namun mengandung data QR yang dapat diekstrak kembali untuk validasi.</p>
                        <div class="steganography-features">
                            <div class="feature-item">
                                <i class="fas fa-check"></i>
                                <span>Invisible watermarking</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check"></i>
                                <span>Data QR tersembunyi</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-check"></i>
                                <span>Kualitas gambar terjaga</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });

  imagesHtml += '</div>';
  processedImagesContainer.innerHTML = imagesHtml;

  // Add functionality to check if images loaded successfully
  setTimeout(() => {
    validateImageDisplay(processedImages);
  }, 1000);
}

function validateImageDisplay(processedImages) {
  console.log('Validating image display...');

  const imageContainers = document.querySelectorAll('.image-comparison-item');
  let successCount = 0;
  let totalImages = processedImages.length * 2; // original + watermarked

  imageContainers.forEach((container, index) => {
    const images = container.querySelectorAll('img');
    images.forEach((img, imgIndex) => {
      if (img.complete && img.naturalWidth > 0) {
        successCount++;
        console.log(`Image ${index}-${imgIndex} loaded successfully`);
      } else {
        console.warn(`Image ${index}-${imgIndex} failed to load:`, img.src);
      }
    });
  });

  console.log(`Image display validation: ${successCount}/${totalImages} images loaded successfully`);

  if (successCount < totalImages) {
    showAlert(`Beberapa gambar mungkin tidak dapat ditampilkan. Periksa koneksi jaringan dan coba muat ulang halaman.`, 'warning');
  }
}

function getQualityRating(psnr) {
  if (psnr >= 40) return 'Excellent';
  if (psnr >= 30) return 'Good';
  if (psnr >= 20) return 'Fair';
  return 'Poor';
}

async function handleSecurityError(result) {
  const errorDetails = result.security_error;

  let errorMessage = 'Security validation failed:\n';
  errorMessage += errorDetails.error_message || 'Unknown security error';

  if (result.recommendations && result.recommendations.length > 0) {
    errorMessage += '\n\nRecommendations:\n';
    result.recommendations.forEach(rec => {
      errorMessage += `• ${rec}\n`;
    });
  }

  showAlert(errorMessage, 'error');
}

function hideResults() {
  const embedResult = document.getElementById('embedResult');
  embedResult.style.display = 'none';

  const securityResultSection = document.getElementById('securityResultSection');
  securityResultSection.style.display = 'none';
}

function showNoImagesFoundError(result) {
  const alertElement = document.getElementById('embedAlert');
  alertElement.className = 'alert alert-warning';

  // Create detailed error message with recommendations
  let errorHTML = `
    <div class="error-header">
      <i class="fas fa-exclamation-triangle"></i>
      <strong>Dokumen Tidak Mengandung Gambar</strong>
    </div>
    <div class="error-content">
      <p>${result.message}</p>
  `;

  // Add recommendations if available
  if (result.recommendations && result.recommendations.length > 0) {
    errorHTML += `
      <div class="error-recommendations">
        <h5><i class="fas fa-lightbulb"></i> Rekomendasi:</h5>
        <ul>
    `;

    result.recommendations.forEach(recommendation => {
      errorHTML += `<li><i class="fas fa-arrow-right"></i> ${recommendation}</li>`;
    });

    errorHTML += `
        </ul>
      </div>
    `;
  }

  errorHTML += `</div>`;

  alertElement.innerHTML = errorHTML;
  alertElement.style.display = 'block';
}

function showAlert(message, type = 'info') {
  const alertElement = document.getElementById('embedAlert');
  alertElement.className = `alert alert-${type}`;
  alertElement.textContent = message;
  alertElement.style.display = 'block';
}

function clearAlert() {
  const alertElement = document.getElementById('embedAlert');
  alertElement.style.display = 'none';
}
