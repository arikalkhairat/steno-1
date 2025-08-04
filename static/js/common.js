// Utility functions
function showAlert(elementId, message, type) {
  const alert = document.getElementById(elementId);
  alert.className = `alert alert-${type}`;
  alert.innerHTML = message;
  alert.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      alert.style.display = 'none';
    }, 5000);
  }
}

function showProgress(elementId) {
  const progress = document.getElementById(elementId);
  progress.style.display = 'block';
  const fill = progress.querySelector('.progress-fill');
  fill.style.width = '100%';
}

function hideProgress(elementId) {
  const progress = document.getElementById(elementId);
  progress.style.display = 'none';
  const fill = progress.querySelector('.progress-fill');
  fill.style.width = '0%';
}

function showResult(elementId) {
  const result = document.getElementById(elementId);
  result.style.display = 'block';
}

function hideResult(elementId) {
  const result = document.getElementById(elementId);
  result.style.display = 'none';
}

function showProcessDetails(processId) {
  const processDetails = document.getElementById(processId);
  processDetails.style.display = 'block';
}

function hideProcessDetails(processId) {
  const processDetails = document.getElementById(processId);
  processDetails.style.display = 'none';
}

function addLogEntry(logId, message, type = 'info') {
  const log = document.getElementById(logId);
  const timestamp = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.innerHTML = `
        <span class="log-timestamp">[${timestamp}]</span>
        <span>${message}</span>
    `;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function clearLog(logId) {
  const log = document.getElementById(logId);
  log.innerHTML = '';
}

function addCalculationStep(containerId, title, formula, result) {
  const container = document.getElementById(containerId);
  const step = document.createElement('div');
  step.className = 'calculation-step';
  step.innerHTML = `
        <h5>${title}</h5>
        <div class="calculation-formula">${formula}</div>
        <div class="calculation-result">Hasil: ${result}</div>
    `;
  container.appendChild(step);
}

function displayQRAnalysis(containerId, qrInfo) {
  const container = document.getElementById(containerId);
  const analysis = document.createElement('div');
  analysis.className = 'qr-analysis';
  analysis.innerHTML = `
        <h5><i class="fas fa-chart-bar"></i> Analisis QR Code</h5>
        <div class="qr-info-grid">
            <div class="qr-info-item">
                <div class="qr-info-value">${qrInfo.width || 'N/A'}</div>
                <div class="qr-info-label">Lebar (px)</div>
            </div>
            <div class="qr-info-item">
                <div class="qr-info-value">${qrInfo.height || 'N/A'}</div>
                <div class="qr-info-label">Tinggi (px)</div>
            </div>
            <div class="qr-info-item">
                <div class="qr-info-value">${qrInfo.data ? qrInfo.data.length : 'N/A'}</div>
                <div class="qr-info-label">Panjang Data</div>
            </div>
            <div class="qr-info-item">
                <div class="qr-info-value">${(qrInfo.width * qrInfo.height) || 'N/A'}</div>
                <div class="qr-info-label">Total Pixel</div>
            </div>
        </div>
    `;
  container.appendChild(analysis);
}

function displayImageComparison(containerId, processedImages) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<h5><i class="fas fa-images"></i> Perbandingan Gambar</h5>';

  processedImages.forEach((img, index) => {
    const comparison = document.createElement('div');
    comparison.className = 'image-comparison';
    comparison.innerHTML = `
            <div class="image-item">
                <h6>Gambar Asli ${index + 1}</h6>
                <img src="/static/generated/${img.original}" alt="Original ${index + 1}">
            </div>
            <div class="image-item">
                <h6>Gambar Watermark ${index + 1}</h6>
                <img src="/static/generated/${img.watermarked}" alt="Watermarked ${index + 1}">
            </div>
        `;
    container.appendChild(comparison);
  });
}

function displayDetailedProcess(logData, qrInfo, processedImages) {
  const container = document.getElementById('detailedSteps');

  // Parse log data to extract detailed information
  const lines = logData.split('\n');
  let currentImageIndex = 0;
  let imageCapacity = 0;
  let qrWidth = 290, qrHeight = 290; // Default QR size
  let resizedQR = false;
  let newQRSize = { width: qrWidth, height: qrHeight };
  let bitsEmbedded = 0;

  // Extract information from log
  lines.forEach(line => {
    if (line.includes('Menyisipkan watermark QR Code ke gambar 1/')) {
      currentImageIndex = 1;
    }
    if (line.includes('QR code diresize dari') && currentImageIndex === 1) {
      const match = line.match(/diresize dari (\d+)x(\d+) ke (\d+)x(\d+)/);
      if (match) {
        resizedQR = true;
        newQRSize = { width: parseInt(match[3]), height: parseInt(match[4]) };
      }
    }
    if (line.includes('Kapasitas citra penampung') && currentImageIndex === 1) {
      const match = line.match(/(\d+) bits/);
      if (match) {
        imageCapacity = parseInt(match[1]);
      }
    }
    if (line.includes('Total bit untuk disisipkan:') && currentImageIndex === 1) {
      const match = line.match(/(\d+)/);
      if (match) {
        bitsEmbedded = parseInt(match[1]);
      }
    }
    if (line.includes('Ukuran QR Code:') && currentImageIndex === 1) {
      const match = line.match(/(\d+)x(\d+)/);
      if (match) {
        newQRSize = { width: parseInt(match[1]), height: parseInt(match[2]) };
      }
    }
  });

  // Calculate estimated dimensions from capacity
  const estimatedDim = Math.floor(Math.sqrt(imageCapacity));

  container.innerHTML = '';

  // Step 1: Image Analysis
  const step1 = document.createElement('div');
  step1.className = 'process-step';
  step1.innerHTML = `
        <div class="step-header">
            <span class="step-badge">STEP 1</span>
            <span class="step-title">Analisis Gambar Cover</span>
        </div>
        <p>Menganalisis gambar yang akan dijadikan media penyimpanan watermark.</p>
        
        <div class="capacity-analysis">
            <div class="capacity-item">
                <div class="capacity-value">RGB</div>
                <div class="capacity-label">Format Warna</div>
            </div>
            <div class="capacity-item">
                <div class="capacity-value">${estimatedDim}</div>
                <div class="capacity-label">Est. Lebar (px)</div>
            </div>
            <div class="capacity-item">
                <div class="capacity-value">${estimatedDim}</div>
                <div class="capacity-label">Est. Tinggi (px)</div>
            </div>
            <div class="capacity-item">
                <div class="capacity-value">${imageCapacity.toLocaleString()}</div>
                <div class="capacity-label">Kapasitas (bit)</div>
            </div>
        </div>
        
        <div class="formula-explanation">
            <div class="formula-title">📐 Kapasitas Penyimpanan</div>
            <div class="formula-content">
                Kapasitas = Lebar × Tinggi × 1 bit (LSB Blue channel)<br>
                Kapasitas = ${estimatedDim} × ${estimatedDim} = ${imageCapacity.toLocaleString()} bit<br>
                <br>
                Hanya menggunakan Blue channel LSB untuk steganography<br>
                Sehingga kapasitas = jumlah pixel = lebar × tinggi
            </div>
        </div>
    `;
  container.appendChild(step1);

  // Step 2: QR Code Analysis
  const step2 = document.createElement('div');
  step2.className = 'process-step';
  let resizeHtml = '';
  if (resizedQR) {
    resizeHtml = `
            <div class="resize-info">
                <div class="title">⚠️ QR Code Diresize Otomatis</div>
                <p>QR Code diresize dari ${qrWidth}×${qrHeight} menjadi ${newQRSize.width}×${newQRSize.height} untuk menyesuaikan kapasitas gambar cover.</p>
                <p><strong>Alasan:</strong> Total bit yang dibutuhkan (${(qrWidth * qrHeight) + 40}) melebihi kapasitas gambar (${imageCapacity}).</p>
            </div>
        `;
  }

  step2.innerHTML = `
        <div class="step-header">
            <span class="step-badge">STEP 2</span>
            <span class="step-title">Persiapan QR Code</span>
        </div>
        <p>Menganalisis dan mempersiapkan QR Code untuk disisipkan.</p>
        
        ${resizeHtml}
        
        <div class="capacity-analysis">
            <div class="capacity-item">
                <div class="capacity-value">${newQRSize.width}</div>
                <div class="capacity-label">Lebar QR (px)</div>
            </div>
            <div class="capacity-item">
                <div class="capacity-value">${newQRSize.height}</div>
                <div class="capacity-label">Tinggi QR (px)</div>
            </div>
            <div class="capacity-item">
                <div class="capacity-value">${(newQRSize.width * newQRSize.height).toLocaleString()}</div>
                <div class="capacity-label">Bit QR Data</div>
            </div>
            <div class="capacity-item">
                <div class="capacity-value">40</div>
                <div class="capacity-label">Bit Header</div>
            </div>
        </div>
        
        <div class="formula-explanation">
            <div class="formula-title">📊 Kebutuhan Bit Total</div>
            <div class="formula-content">
                Bit QR = Lebar × Tinggi = ${newQRSize.width} × ${newQRSize.height} = ${(newQRSize.width * newQRSize.height).toLocaleString()} bit<br>
                Bit Header = 40 bit (informasi dimensi QR)<br>
                <br>
                <strong>Total Bit = ${(newQRSize.width * newQRSize.height).toLocaleString()} + 40 = ${((newQRSize.width * newQRSize.height) + 40).toLocaleString()} bit</strong><br>
                <br>
                Rasio Penggunaan = ${(((newQRSize.width * newQRSize.height) + 40) / imageCapacity * 100).toFixed(1)}% dari kapasitas
            </div>
        </div>
    `;
  container.appendChild(step2);

  // Step 3: Header Creation
  const step3 = document.createElement('div');
  step3.className = 'process-step';
  step3.innerHTML = `
        <div class="step-header">
            <span class="step-badge">STEP 3</span>
            <span class="step-title">Pembuatan Header</span>
        </div>
        <p>Membuat header yang berisi informasi dimensi QR Code untuk ekstraksi.</p>
        
        <div class="bit-visualization">
            <div class="bit-row">
                <span class="bit-label">Lebar QR (dec):</span>
                <span class="bit-value">${newQRSize.width}</span>
            </div>
            <div class="bit-row">
                <span class="bit-label">Lebar QR (bin):</span>
                <span class="bit-value header">${newQRSize.width.toString(2).padStart(20, '0')}</span>
                <span>(20 bit)</span>
            </div>
            <div class="bit-row">
                <span class="bit-label">Tinggi QR (dec):</span>
                <span class="bit-value">${newQRSize.height}</span>
            </div>
            <div class="bit-row">
                <span class="bit-label">Tinggi QR (bin):</span>
                <span class="bit-value header">${newQRSize.height.toString(2).padStart(20, '0')}</span>
                <span>(20 bit)</span>
            </div>
            <div class="bit-row">
                <span class="bit-label">Total Header:</span>
                <span class="bit-value header">40 bit</span>
            </div>
        </div>
        
        <div class="formula-explanation">
            <div class="formula-title">📋 Format Header</div>
            <div class="formula-content">
                Header disimpan di awal untuk memberitahu decoder:<br>
                • Bit 1-20: Lebar QR Code (20 bit)<br>
                • Bit 21-40: Tinggi QR Code (20 bit)<br>
                <br>
                Format: [20-bit width][20-bit height][QR data bits...]
            </div>
        </div>
    `;
  container.appendChild(step3);

  // Step 4: LSB Embedding
  const step4 = document.createElement('div');
  step4.className = 'process-step';
  step4.innerHTML = `
        <div class="step-header">
            <span class="step-badge">STEP 4</span>
            <span class="step-title">Proses LSB Embedding</span>
        </div>
        <p>Menyisipkan bit watermark ke dalam LSB (Least Significant Bit) channel biru.</p>
        
        <div class="formula-explanation">
            <div class="formula-title">🔧 Contoh Modifikasi Pixel</div>
            <div class="formula-content">
                <strong>Algoritma LSB:</strong><br>
                1. Ambil pixel asli dari gambar cover<br>
                2. Konversi nilai Blue ke biner<br>
                3. Ganti bit terakhir (LSB) dengan bit watermark<br>
                4. Konversi kembali ke desimal<br>
                <br>
                <strong>Contoh:</strong><br>
                Pixel Asli: R=120, G=85, B=200<br>
                Bit watermark: 1<br>
                <br>
                Blue: 200 → 11001000₂<br>
                LSB lama: <span class="lsb-highlight">0</span><br>
                LSB baru: <span class="lsb-highlight">1</span><br>
                Blue baru: 11001001₂ → 201<br>
                <br>
                Pixel Hasil: R=120, G=85, B=201
            </div>
        </div>
        
        <div class="example-pixel">
            <div class="pixel-channel red">
                <div class="pixel-value">Red: 120</div>
                <div class="pixel-binary">01111000</div>
                <small>Tidak diubah</small>
            </div>
            <div class="pixel-channel green">
                <div class="pixel-value">Green: 85</div>
                <div class="pixel-binary">01010101</div>
                <small>Tidak diubah</small>
            </div>
            <div class="pixel-channel blue">
                <div class="pixel-value">Blue: 200→201</div>
                <div class="pixel-binary">1100100<span class="lsb-highlight">0→1</span></div>
                <small>LSB dimodifikasi</small>
            </div>
        </div>
        
        <div class="formula-explanation">
            <div class="formula-title">📊 Statistik Embedding</div>
            <div class="formula-content">
                Total bit diproses: ${bitsEmbedded.toLocaleString()} bit<br>
                Pixel dimodifikasi: ${bitsEmbedded.toLocaleString()} pixel<br>
                Perubahan maksimum per pixel: ±1 (sangat kecil)<br>
                <br>
                Dampak visual: Hampir tidak terdeteksi mata manusia
            </div>
        </div>
    `;
  container.appendChild(step4);

  // Step 5: Quality Analysis
  const step5 = document.createElement('div');
  step5.className = 'process-step';
  step5.innerHTML = `
        <div class="step-header">
            <span class="step-badge">STEP 5</span>
            <span class="step-title">Analisis Kualitas</span>
        </div>
        <p>Mengukur dampak penyisipan terhadap kualitas gambar menggunakan MSE dan PSNR.</p>
        
        <div class="formula-explanation">
            <div class="formula-title">📊 Mean Squared Error (MSE)</div>
            <div class="formula-content">
                MSE = (1/N) × Σ(Original - Watermarked)²<br>
                <br>
                N = Total pixel dalam gambar<br>
                Untuk setiap pixel: (R₁-R₂)² + (G₁-G₂)² + (B₁-B₂)²<br>
                <br>
                <strong>Contoh perhitungan 1 pixel:</strong><br>
                Original: R=120, G=85, B=200<br>
                Watermarked: R=120, G=85, B=201<br>
                <br>
                MSE pixel = [(120-120)² + (85-85)² + (200-201)²] / 3<br>
                MSE pixel = [0 + 0 + 1] / 3 = 0.333
            </div>
        </div>
        
        <div class="formula-explanation">
            <div class="formula-title">📈 Peak Signal-to-Noise Ratio (PSNR)</div>
            <div class="formula-content">
                PSNR = 20 × log₁₀(MAX²/MSE)<br>
                MAX = 255 (nilai maksimum pixel)<br>
                <br>
                PSNR = 20 × log₁₀(255²/MSE)<br>
                PSNR = 20 × log₁₀(65025/MSE)<br>
                <br>
                <strong>Interpretasi Kualitas:</strong><br>
                • PSNR > 40 dB: Excellent (Sangat Baik Sekali)<br>
                • PSNR > 30 dB: Very Good (Sangat Baik)<br>
                • PSNR > 20 dB: Good (Baik)<br>
                • PSNR < 20 dB: Poor (Kurang Baik)
            </div>
        </div>
    `;
  container.appendChild(step5);

  // Show the detailed process
  document.getElementById('detailedProcess').style.display = 'block';
}

// File upload label updates
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.file-upload-input').forEach(input => {
    input.addEventListener('change', function () {
      const label = this.nextElementSibling.querySelector('span');
      if (this.files[0]) {
        label.textContent = this.files[0].name;
      } else {
        label.textContent = this.dataset.placeholder || 'Pilih file...';
      }
    });
  });
}); 
