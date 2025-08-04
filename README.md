# 🎯 QR Code Watermarking Tool - Complete Documentation

## 📋 Deskripsi Aplikasi

**QR Code Watermarking Tool** adalah aplikasi web berbasis Flask yang menggunakan teknik **LSB (Least Significant Bit) Steganography** untuk menyisipkan watermark QR Code yang invisible ke dalam dokumen digital (.docx dan .pdf). Tool ini dirancang untuk:

- 🛡️ **Authentikasi Dokumen**: Verifikasi keaslian sertifikat, ijazah, kontrak
- 🔐 **Perlindungan Copyright**: Melindungi materi edukasi dan publikasi digital
- 📚 **Academic Integrity**: Memastikan integritas paper dan publikasi penelitian
- 🏢 **Corporate Security**: Proteksi dokumen resmi dan rahasia perusahaan

### 🔬 Teknologi Inti

- **LSB Steganography**: Menyisipkan data di bit paling tidak signifikan dari piksel gambar
- **QR Code Generation**: Menggunakan library qrcode dengan analisis kapasitas mendalam
- **Document Processing**: Mendukung DOCX (python-docx) dan PDF (PyMuPDF)
- **Real-time Analysis**: Analisis kompatibilitas dan kualitas secara real-time
- **Enhanced UI/UX**: Interface modern dengan preview dan konfigurasi advanced
- **Document Security**: HMAC-based document binding untuk keamanan tingkat tinggi

## 🚀 Fitur Utama

### 📱 QR Code Generator Enhanced
- **Real-time Preview**: QR code dibuat langsung saat mengetik
- **Character Counter**: Indikator warna berdasarkan panjang data
  - 🟢 1-50 karakter: Optimal untuk steganografi
  - 🟡 51-100 karakter: Masih bagus
  - 🟠 101-200 karakter: Dapat diterima
  - 🔴 200+ karakter: Mungkin bermasalah
- **Analisis Kapasitas**: Breakdown kapasitas untuk semua level error correction
- **Konfigurasi Advanced**: Error correction, sizing, warna custom
- **Steganografi Assessment**: Penilaian kompatibilitas untuk embedding

### 🖼️ LSB Steganography Advanced
- **Smart QR Sizing**: Otomatis resize QR sesuai kapasitas gambar
- **Quality Prediction**: Estimasi MSE/PSNR sebelum embedding
- **Capacity Analysis**: Analisis mendalam kapasitas gambar
- **Compatibility Check**: Verifikasi kompatibilitas QR-gambar
- **Batch Processing**: Pemrosesan multiple gambar

### 📄 Document Processing
- **Multi-format Support**: DOCX dan PDF
- **Batch Watermarking**: Semua gambar dalam dokumen di-watermark
- **Quality Metrics**: Perhitungan MSE dan PSNR
- **Image Comparison**: Preview perbandingan gambar original vs watermarked
- **Automatic Cleanup**: Manajemen file temporary otomatis

### 🔒 Security Features
- **Document Binding**: QR codes cryptographically bound to specific documents
- **HMAC Authentication**: SHA-256 + document metadata fingerprinting
- **Time-based Expiration**: Configurable expiration times for QR codes
- **Backward Compatibility**: Legacy QR codes continue to work
- **Rate Limiting**: Pencegahan abuse API
- **Input Validation**: Validasi komprehensif semua input
- **Security Storage**: Sistem penyimpanan kunci yang aman
- **Error Handling**: Penanganan error yang robust
- **Logging**: Sistem logging untuk debugging dan monitoring

## 📋 Requirements & Installation

### System Requirements
- **Python**: 3.8+ (Recommended: 3.10+)
- **RAM**: Minimal 4GB, Recommended 8GB+
- **Storage**: Minimal 2GB free space
- **Browser**: Modern browser with JavaScript ES6+ support

### Dependencies
```txt
Flask==2.3.3
python-docx==0.8.11
qrcode==7.4.2
Pillow==10.0.0
pyzbar==0.1.9
numpy==1.24.3
PyMuPDF==1.23.5
hashlib
hmac
secrets
pathlib
base64
```

### 🖥️ Installation

#### Windows (Otomatis)
```bash
# Double-click install.bat atau jalankan:
install.bat

# Setelah selesai, jalankan:
run.bat
```

#### Linux/Mac (Manual)
```bash
# 1. Clone atau download project
git clone [repository-url]
cd steno

# 2. Buat virtual environment
python3 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# atau
.venv\Scripts\activate     # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Jalankan aplikasi
python app.py
```

#### Ubuntu/Debian (One-liner)
```bash
curl -sSL https://your-repo-url/install.sh | bash
```

### 🌐 Mengakses Aplikasi
Setelah instalasi, buka browser dan akses:
- **Local**: `http://localhost:5000` (atau port 5001-5005)
- **Network**: `http://[your-ip]:5000`

## 🎯 Cara Menggunakan

### 1. Generate QR Code
1. **Masukkan Data**: Ketik text yang ingin di-encode di textarea
2. **Monitor Analysis**: Lihat real-time character count dan analisis
3. **Sesuaikan Settings**: Gunakan advanced options jika perlu
   - Error Correction Level (L/M/Q/H)
   - QR Size (5x-20x)
   - Border Size (1-10 px)
   - Custom Colors
4. **Download**: Klik "Generate QR Code" untuk download

### 2. Embed Watermark ke Dokumen
1. **Upload Files**: 
   - Dokumen (.docx/.pdf)
   - QR Code (.png)
2. **Process**: Klik "Embed Watermark"
3. **Review Results**: 
   - Lihat perbandingan gambar original vs watermarked
   - Check MSE/PSNR metrics
   - Download dokumen hasil
4. **Verify**: Simpan dokumen di folder documents

### 3. Extract Watermark dari Dokumen
1. **Upload Document**: Upload dokumen yang sudah di-watermark
2. **Extract**: Klik "Extract Watermark" 
3. **Verify**: QR Code yang diekstrak akan ditampilkan
4. **Read Data**: Data dalam QR akan ditampilkan jika berhasil

### 4. Advanced Security Features
- **Document Pre-Registration**: Pre-register documents for later QR generation
- **Secure QR Generation**: Generate QR codes bound to specific documents
- **Binding Validation**: Verify QR-document binding integrity
- **Security Information**: Extract security metadata from QR codes

## 🔧 Technical Architecture

### Backend Structure
```
app.py                 # Main Flask application
├── Enhanced Endpoints
│   ├── /generate_qr          # Enhanced QR generation
│   ├── /generate_qr_realtime # Real-time preview
│   ├── /analyze_qr           # Analysis-only endpoint
│   ├── /qr_config            # Configuration options
│   ├── /embed_document       # Document watermarking
│   ├── /pre_register_document # Document pre-registration
│   ├── /generate_secure_qr   # Secure QR generation
│   ├── /validate_qr_binding  # Binding validation
│   └── /qr_security_info     # Security information
├── Security Features
│   ├── Rate limiting
│   ├── Input validation
│   ├── Response caching
│   └── Error handling
└── File Management
    ├── Automatic cleanup
    ├── Directory structure
    └── Permission handling
```

### Core Modules
```
qr_utils.py           # Enhanced QR utilities
├── generate_qr_with_analysis()    # Comprehensive QR generation
├── analyze_qr_requirements()      # Smart QR analysis
├── estimate_steganography_capacity() # LSB compatibility
├── get_capacity_info()            # Capacity breakdown
└── quick_qr_analysis()            # Fast assessment

lsb_steganography.py  # Advanced LSB implementation
├── analyze_image_capacity()       # Image capacity analysis
├── optimize_qr_for_image()        # QR size optimization
├── check_qr_compatibility()       # Compatibility checking
├── enhanced_resize_qr()           # Smart QR resizing
└── batch_analyze_images()         # Batch processing

main.py               # Document processing core
├── embed_watermark_to_docx()      # DOCX watermarking
├── embed_watermark_to_pdf()       # PDF watermarking
├── extract_watermark_from_docx()  # DOCX extraction
└── extract_watermark_from_pdf()   # PDF extraction

secure_qr_utils.py    # Security features
├── SecureQRGenerator()            # Secure QR generation
├── SecureQRValidator()            # QR validation
├── generate_secure_qr()           # Quick secure QR
├── validate_secure_qr()           # Quick validation
└── get_qr_security_info()        # Security info extraction

document_security.py   # Document security core
├── DocumentBinder()               # Document binding
├── BindingStorage()               # Storage management
├── quick_document_fingerprint()   # Quick fingerprinting
└── quick_binding_verification()   # Quick verification
```

## 🔐 Security Features Deep Dive

### Document-Specific Binding
- Each QR code is cryptographically linked to a specific document
- Uses SHA-256 + document metadata for fingerprinting
- HMAC authentication ensures integrity

### Time-Based Expiration
- QR codes can have configurable expiration times
- Expired QR codes are automatically rejected
- Default expiration: 24 hours

### Backward Compatibility
- Existing QR codes continue to work (legacy mode)
- New security features are opt-in
- Gradual migration path available

### Security Levels
- **Legacy**: Traditional QR codes without binding
- **Secure**: QR codes with document binding
- **Compromised**: Invalid or mismatched bindings

### Security Data Structures

#### Document Fingerprint
```json
{
  "version": "1.0",
  "timestamp": 1704067200,
  "file_info": {
    "name": "contract.docx",
    "size": 25600,
    "extension": ".docx",
    "modified_time": 1704066000
  },
  "content_hash": "sha256_hash_of_file_content",
  "document_metadata": {
    "type": ".docx",
    "paragraph_count": 25,
    "image_count": 2,
    "author": "John Doe"
  },
  "fingerprint_id": "a1b2c3d4e5f6g7h8",
  "fingerprint_hash": "full_sha256_hash"
}
```

#### Secure QR Data Structure
```json
{
  "version": "1.0",
  "type": "secure",
  "data": "Original QR data content",
  "binding": "base64_encoded_binding_token",
  "created_at": 1704067200
}
```

## 🧪 Testing

Aplikasi memiliki satu file test komprehensif untuk semua kebutuhan testing:

### Menjalankan Test:
```bash
# Test semua komponen
python test_application.py

# Test spesifik
python test_application.py --test-type structure  # File structure
python test_application.py --test-type api        # API endpoints  
python test_application.py --test-type security   # Security features
python test_application.py --test-type qr         # QR functionality
python test_application.py --test-type images     # Image processing

# Generate laporan detail
python test_application.py --report
```

### Security Testing:
```bash
# Test security features
python test_security.py

# Test specific security components
python -m unittest test_security.TestDocumentBinder
python -m unittest test_security.TestSecurityIntegration
```

### Test Coverage:
- ✅ **Struktur File**: Verifikasi file dan direktori penting
- ✅ **Module Import**: Test import semua module core
- ✅ **API Endpoints**: Test semua endpoint Flask dengan berbagai parameter
- ✅ **QR Functionality**: Test generate, analyze, dan validasi QR
- ✅ **LSB Steganography**: Test embed/extract gambar dengan quality metrics
- ✅ **Security Features**: Test enkripsi, hash, dan validasi keamanan
- ✅ **Integration**: Test integrasi antar komponen
- ✅ **Performance**: Test performa dan rate limiting

## 📊 Performance & Quality Metrics

### Performance Benchmarks
- **QR Generation**: <300ms untuk QR standard
- **Document Processing**: 2-5 detik per dokumen (tergantung size)
- **Real-time Analysis**: <100ms response time
- **Image Embedding**: 1-3 detik per gambar
- **Memory Usage**: <512MB untuk dokumen standard

### Quality Metrics
- **MSE (Mean Squared Error)**: Biasanya <0.05 untuk embedding berkualitas
- **PSNR**: Target >40dB untuk kualitas visual yang baik
- **Steganografi Score**: 0-100, target >70 untuk embedding optimal
- **QR Readability**: Maintained setelah resize dan embedding

### Rate Limits
- **QR Generation**: 30 requests/minute per IP
- **Real-time Preview**: 50 requests/minute per IP
- **Analysis Only**: 100 requests/minute per IP
- **Config Endpoint**: No limit

## 🗂️ Struktur Project

```
steno/
├── 🖥️ Core Application
│   ├── app.py                    # Main Flask server
│   ├── main.py                   # Document processing core
│   ├── qr_utils.py               # Enhanced QR utilities
│   ├── lsb_steganography.py      # Advanced LSB algorithms
│   ├── secure_qr_utils.py        # Security features
│   ├── document_security.py      # Document security core
│   └── qr_config_assistant.py    # QR configuration helper
│
├── 🌐 Web Interface
│   ├── templates/
│   │   ├── base.html             # Base layout template
│   │   ├── generate.html         # QR generator page
│   │   ├── embed.html            # Embed watermark page
│   │   ├── validate.html         # Validate document page
│   │   └── index.html.backup     # Original monolithic file
│   └── static/
│       ├── css/
│       │   └── styles.css        # All CSS styles
│       ├── js/
│       │   ├── common.js         # Shared utility functions
│       │   ├── qr-generator.js   # QR generator functionality
│       │   ├── embed.js          # Embed watermark functionality
│       │   ├── validate.js       # Document validation functionality
│       │   └── security.js       # Security features
│       ├── uploads/              # Temporary uploads
│       └── generated/            # Generated files
│
├── 🏛️ Storage
│   ├── public/documents/         # Permanent document storage
│   ├── binding_storage/          # Security binding records
│   └── security_backups/         # Security key backups
│
├── 📋 Configuration
│   ├── requirements.txt          # Python dependencies
│   ├── .gitignore               # Git ignore rules
│   └── README.md                # This documentation
│
├── 🔧 Scripts
│   ├── install.bat              # Windows installer
│   ├── run.bat                  # Windows runner
│   └── test_application.py      # Comprehensive test suite
│
└── 🔐 Security
    ├── security_key.bin         # Security key file
    └── test_security.py         # Security test suite
```

## 🔬 Technical Deep Dive

### LSB Steganography Process

#### 1. QR Code Generation
```python
# Enhanced QR generation with analysis
result = generate_qr_with_analysis(
    data="Secret message",
    output_path="qr.png",
    error_correction='M',
    box_size=10
)

# Returns comprehensive metadata
metadata = result['metadata']
steganography_score = metadata['steganography_score']
```

#### 2. Image Capacity Analysis
```python
# Analyze cover image capacity
capacity = analyze_image_capacity("cover.png")

print(f"Total capacity: {capacity['total_pixels']} pixels")
print(f"Available for QR: {capacity['available_for_qr']} bits")
print(f"Efficiency score: {capacity['efficiency_score']}")
```

#### 3. LSB Embedding Process
```python
# Smart QR-to-image embedding
embed_qr_to_image(
    cover_image_path="cover.png",
    qr_image_path="qr.png", 
    output_stego_path="stego.png",
    resize_qr_if_needed=True  # Auto-resize for optimal quality
)
```

#### 4. Quality-Aware Extraction
```python
# Extract with quality verification
extract_qr_from_image(
    stego_image_path="stego.png",
    output_qr_path="extracted_qr.png"
)
```

### Document Processing Workflow

#### DOCX Processing
1. **Image Extraction**: Extract semua gambar dari dokumen
2. **Capacity Analysis**: Analisis kapasitas setiap gambar
3. **QR Optimization**: Resize QR optimal untuk setiap gambar
4. **LSB Embedding**: Embed QR dengan LSB steganography
5. **Document Reconstruction**: Replace gambar asli dengan watermarked
6. **Quality Validation**: Calculate MSE/PSNR metrics

#### PDF Processing  
1. **PyMuPDF Integration**: Extract images using PyMuPDF
2. **Format Standardization**: Convert semua ke PNG untuk consistency
3. **Advanced Embedding**: Same LSB process sebagai DOCX
4. **PDF Reconstruction**: Rebuild PDF dengan gambar watermarked
5. **Metadata Preservation**: Maintain PDF properties dan structure

### Security Workflow

#### Document Pre-Registration
```python
from secure_qr_utils import SecureQRGenerator

generator = SecureQRGenerator()

# Pre-register document
result = generator.pre_register_document(
    document_path="contract.docx",
    qr_data="Contract #12345 - Valid until 2024-12-31",
    expiry_hours=72  # 3 days
)

if result["success"]:
    registration_id = result["registration_id"]
    binding_token = result["binding_token"]
    print(f"Document registered: {registration_id}")
```

#### Secure QR Generation
```python
# Generate QR bound directly to document
result = generator.generate_bound_qr(
    data="Important Document Data",
    document_path="document.docx",
    output_path="bound_qr.png",
    expiry_hours=24,
    error_correction='M',
    box_size=10
)

if result["success"]:
    fingerprint_id = result["document_binding"]["fingerprint_id"]
    print(f"QR bound to document: {fingerprint_id}")
```

#### Validation and Verification
```python
from secure_qr_utils import validate_secure_qr

validation = validate_secure_qr(
    qr_image_path="qr_code.png",
    document_path="document.docx"
)

if validation["valid"] and validation["binding_verified"]:
    print("✅ QR code is properly bound to this document")
    print(f"Security Level: {validation['security_level']}")
else:
    print("❌ QR code is NOT bound to this document")
    print(f"Error: {validation.get('error', 'Unknown error')}")
```

## 🎛️ Advanced Configuration

### QR Code Optimization
```python
# Automatic optimization for steganography
optimization = optimize_qr_for_image("cover.png", data_length=150)

optimal_size = optimization['optimal_configuration']['qr_size']
quality_level = optimization['quality_prediction']['quality_level']
```

### Steganography Settings
```python
# Advanced compatibility checking
compatibility = check_qr_compatibility("cover.png", "qr.png")

if compatibility['compatible']:
    predicted_psnr = compatibility['quality_prediction']['psnr_estimate']
    print(f"Expected PSNR: {predicted_psnr}dB")
```

### Batch Processing
```python
# Process multiple images efficiently
batch_result = batch_analyze_images(
    image_paths=["img1.png", "img2.png", "img3.png"],
    output_format="detailed"
)

avg_capacity = batch_result['summary_statistics']['capacity_stats']['mean']
```

## 🛡️ Security Features

### Document Authentication
- **Unique Keys**: Generate kunci unik per dokumen
- **Hash Verification**: SHA-256 untuk verifikasi integritas
- **Timestamp Embedding**: Waktu pembuatan dalam QR metadata
- **Digital Signatures**: Support untuk digital signature integration

### Data Protection
- **Encryption**: AES-256 untuk data sensitif
- **Secure Storage**: Encrypted key storage system
- **Access Control**: Role-based access untuk enterprise
- **Audit Trail**: Logging semua operasi untuk compliance

### API Security
- **Rate Limiting**: Prevent abuse dan DDoS
- **Input Validation**: SQL injection dan XSS protection
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: Security headers untuk web protection

## 🚨 Troubleshooting

### Common Issues

#### Installation Problems
```bash
# Error: Python not found
# Solution: Install Python 3.8+ dan add ke PATH

# Error: pip install failed
# Solution: Upgrade pip
python -m pip install --upgrade pip

# Error: Virtual environment activation failed
# Solution: Pastikan permissions correct
chmod +x .venv/bin/activate  # Linux/Mac
```

#### Runtime Errors
```bash
# Error: Port already in use
# Solution: App akan otomatis coba port 5000-5005

# Error: File permission denied
# Solution: Check folder permissions
chmod 755 static/  # Linux/Mac

# Error: QR code tidak terbaca
# Solution: Check QR quality dan ukuran minimum
```

#### Quality Issues
```bash
# MSE terlalu tinggi (>0.1)
# Solution: Gunakan gambar cover yang lebih besar

# PSNR terlalu rendah (<30dB)  
# Solution: Reduce QR size atau pilih error correction L

# QR tidak bisa di-scan
# Solution: Increase module size minimal 3x3 pixels
```

#### Security Issues
```bash
# "Document fingerprint mismatch"
# Solution: Ensure QR code matches the document
# Prevention: Use document pre-registration

# "Token expired"
# Solution: Generate new QR code with fresh binding
# Prevention: Use longer expiration times

# "Could not read QR code"
# Solution: Use high-quality PNG images
# Prevention: Validate QR images before upload
```

### Error Codes
- **NO_IMAGES_FOUND**: Dokumen tidak mengandung gambar
- **CAPACITY_EXCEEDED**: QR terlalu besar untuk gambar cover
- **INVALID_FORMAT**: Format file tidak didukung
- **RATE_LIMIT_EXCEEDED**: Terlalu banyak requests
- **VALIDATION_ERROR**: Input tidak valid
- **BINDING_MISMATCH**: QR code bound to different document
- **TOKEN_EXPIRED**: Binding token has expired
- **QR_READ_FAILED**: Cannot read QR code from image

### Log Analysis
```bash
# Check Flask logs
tail -f app.log

# Check error patterns
grep "ERROR" app.log | tail -20

# Monitor performance
grep "Performance" app.log
```

## 🔮 Future Development

### Planned Features
- **Mobile App**: React Native untuk iOS/Android
- **Cloud Integration**: AWS/Azure untuk scalability
- **Blockchain**: Blockchain verification untuk documents
- **AI Enhancement**: ML untuk optimal QR placement
- **Enterprise Features**: SSO, LDAP, advanced user management

### API Extensions
- **GraphQL**: Advanced query capabilities
- **WebSocket**: Real-time collaboration
- **Webhook**: Event-driven integrations
- **SDK**: Client libraries untuk berbagai bahasa

### Performance Improvements
- **GPU Acceleration**: CUDA untuk image processing
- **Microservices**: Service decomposition untuk scale
- **Caching**: Redis untuk high-performance caching
- **CDN**: Global content delivery

## 📜 License & Legal

### License
MIT License - Open source untuk penggunaan educasi dan komersial

### Disclaimer
⚠️ **Important**:
- Gunakan dengan bijak dan bertanggung jawab
- Hormati hak cipta dan hukum yang berlaku
- Pastikan Anda memiliki hak untuk memodifikasi dokumen
- Developer tidak bertanggung jawab atas penyalahgunaan

### Attribution
Jika menggunakan dalam project Anda:
```
QR Code Watermarking Tool by Arikal Khairat
https://github.com/your-repo/steno
```

## 👥 Contributing

### How to Contribute
1. **Fork** repository ini
2. **Create branch** untuk fitur baru (`git checkout -b feature/amazing-feature`)
3. **Commit** perubahan (`git commit -m 'Add amazing feature'`)
4. **Push** ke branch (`git push origin feature/amazing-feature`)
5. **Create Pull Request**

### Development Guidelines
- Follow PEP 8 untuk Python code style
- Add tests untuk fitur baru
- Update dokumentasi
- Use meaningful commit messages

### Bug Reports
Laporkan bug dengan informasi:
- OS dan Python version
- Error message lengkap
- Steps to reproduce
- Expected vs actual behavior

## 📧 Support & Contact

### Developer
**Arikal Khairat**
- 🎓 Digital Steganography Specialist
- 💻 LSB Implementation Expert  
- 🔐 Document Security Solutions Focus
- 📧 Email: [your-email@domain.com]
- 🌐 GitHub: [your-github-profile]

### Community
- **Issues**: [GitHub Issues](https://github.com/your-repo/steno/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/steno/discussions)
- **Wiki**: [Documentation Wiki](https://github.com/your-repo/steno/wiki)

### Enterprise Support
Untuk kebutuhan enterprise dan custom development:
- Technical consulting
- Custom integration
- Training dan workshop
- SLA support

---

## 🎉 Quick Start

### Ready to Go?
```bash
# Windows
install.bat && run.bat

# Linux/Mac  
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && python app.py

# Then open: http://localhost:5000
```

### Test Installation
```bash
python test_application.py --test-type structure
```

---

*"Securing documents with invisible watermarks through advanced LSB steganography"* ✨

**🏠 Repository**: `/steno/`  
**🖥️ Main Application**: `app.py` (Flask Web Server)  
**🔧 Development Mode**: Multi-port auto-detection (5000-5005)  
**📅 Last Updated**: January 2025  
**⚡ Status**: Production Ready
