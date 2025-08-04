# 📚 Penjelasan Lengkap Sistem Document Binding & QR Steganography

## 🌟 Overview Sistem

Sistem ini menggabungkan 3 teknologi utama:
1. **QR Code Generation** - Membuat QR code dari data
2. **Steganography** - Menyembunyikan QR code dalam dokumen
3. **Document Binding** - Mengunci QR code ke dokumen spesifik

## 🔍 Apa itu Steganography?

Steganography adalah teknik menyembunyikan informasi dalam media lain tanpa terlihat. Dalam sistem ini:

```
Dokumen Original + QR Code → LSB Steganography → Dokumen dengan QR Tersembunyi
```

### Teknik LSB (Least Significant Bit)
- Mengubah bit terakhir dari pixel gambar
- Perubahan tidak terlihat mata manusia
- Data QR tersimpan dalam gambar dokumen

## 🔐 Document Binding Explained

### Analogi Sederhana:
Bayangkan **kunci rumah** yang dibuat khusus untuk **satu pintu saja**:
- 🔑 QR Code = Kunci
- 🚪 Dokumen = Pintu
- 🔒 Binding = Mekanisme kunci

### Proses Detail:

#### 1. **Document Fingerprinting**
```json
{
  "content_hash": "ad9b8ae5a642724fd96ed046dd140bd7...",
  "author": "andi agung",
  "created": "2025-07-25 14:06:00",
  "paragraph_count": 69
}
```
**Penjelasan**: Sistem membaca karakteristik unik dokumen seperti:
- Hash dari konten (sidik jari digital)
- Metadata dokumen (author, tanggal, dll)
- Struktur dokumen (jumlah paragraf, gambar)

#### 2. **Token Generation**
```
Input:
- QR Data: "sdfsfsfsdfsdfsfsdfs"
- Document Hash: "ad9b8ae5a642..."
- Timestamp: 1753669081

Output:
- Binding Token: "eyJwYXlsb2FkIj..."
```
**Penjelasan**: Token adalah "kontrak digital" yang mengikat QR dengan dokumen.

#### 3. **Cryptographic Binding**
```python
# Pseudocode
binding = encrypt(
    qr_data + document_hash + timestamp + expiry
)
signature = sign(binding, private_key)
token = base64_encode(binding + signature)
```
**Penjelasan**: Data di-enkripsi dan ditandatangani digital untuk keamanan.

## 📊 File Structure Breakdown

### Pre-Registration File (`prereg_4a62832082dadcaa.json`)

```json
{
  "document_fingerprint": {
    // Identitas unik dokumen
    "fingerprint_id": "4a62832082dadcaa",
    
    // Hash konten untuk deteksi perubahan
    "content_hash": "ad9b8ae5a642...",
    
    // Metadata dokumen
    "author": "andi agung",
    "paragraph_count": 69,
    
    // Info file
    "file_info": {
      "name": "dokumen.docx",
      "size": 19114
    }
  },
  
  // Data QR yang akan di-embed
  "qr_data": "sdfsfsfsdfsdfsfsdfs",
  
  // Token terenkripsi
  "binding_token": "eyJwYXlsb2FkIj...",
  
  // Status workflow
  "status": "pre_registered",
  "qr_generated": false,
  
  // Waktu kadaluarsa (24 jam)
  "expires_at": 1753755481
}
```

### Penjelasan Field:

1. **`fingerprint_id`**: ID unik 16 karakter untuk identifikasi cepat
2. **`content_hash`**: SHA-256 hash dari konten dokumen
3. **`binding_token`**: Token JWT-style yang berisi data terenkripsi
4. **`status`**: Tahapan proses (pre_registered → completed)
5. **`expires_at`**: Unix timestamp kapan binding kadaluarsa

## ⏱️ Timeline Proses

```
T+0 menit    : User upload dokumen & input QR data
T+1 detik    : Generate fingerprint dokumen
T+2 detik    : Create binding token
T+3 detik    : Save pre-registration
T+5 detik    : Generate QR code
T+10 detik   : Embed QR ke dokumen (steganography)
T+15 detik   : Return hasil ke user
...
T+24 jam     : Binding expired, data dibersihkan
```

## 🛡️ Security Layers

### Layer 1: Document Integrity
```python
if current_doc_hash != stored_doc_hash:
    raise SecurityError("Document has been modified")
```

### Layer 2: Time-based Security
```python
if current_time > expires_at:
    raise SecurityError("Binding has expired")
```

### Layer 3: Cryptographic Validation
```python
if not verify_signature(token, public_key):
    raise SecurityError("Invalid signature")
```

### Layer 4: Binding Verification
```python
if extracted_qr_data != bound_qr_data:
    raise SecurityError("QR data mismatch")
```

## 🔄 Workflow Lengkap

### 1. **Embedding Process**
```
User Input:
├── Upload Document (DOCX/PDF)
├── Enter QR Data
└── Enable Security Options

System Process:
├── Extract Document Metadata
├── Generate Document Fingerprint
├── Create Binding Token (if enabled)
├── Generate QR Code
├── Apply LSB Steganography
└── Return Embedded Document
```

### 2. **Validation Process**
```
User Input:
├── Upload Embedded Document
└── Provide QR/Token (if secured)

System Process:
├── Extract Hidden QR
├── Calculate Document Fingerprint
├── Verify Binding Token
├── Check Expiry Time
└── Return Validation Result
```

## 💡 Use Cases

### 1. **Dokumen Legal**
- Kontrak dengan QR code tersembunyi
- Binding mencegah pemalsuan kontrak

### 2. **Sertifikat Digital**
- Ijazah/sertifikat dengan validasi QR
- Tidak bisa dipindah ke dokumen lain

### 3. **Dokumen Rahasia**
- Informasi sensitif dalam QR tersembunyi
- Expired binding untuk keamanan ekstra

## 🚨 Error Scenarios

### Scenario 1: Dokumen Dimodifikasi
```
Original Hash: "ad9b8ae5a642..."
Current Hash:  "xyz123abc789..."
Result: ❌ INVALID - Document modified
```

### Scenario 2: Binding Kadaluarsa
```
Current Time: 1753756000
Expires At:   1753755481
Result: ❌ EXPIRED - Please regenerate
```

### Scenario 3: Wrong Document
```
QR bound to: "kontrak.docx"
Uploaded:    "invoice.docx"
Result: ❌ MISMATCH - Wrong document
```

## 🔧 Technical Implementation

### Steganography Algorithm
```python
def embed_lsb(image, data):
    # Convert data to binary
    binary_data = ''.join(format(ord(c), '08b') for c in data)
    
    # Modify LSB of image pixels
    for i, bit in enumerate(binary_data):
        pixel = image[i]
        pixel = (pixel & 0xFE) | int(bit)
        image[i] = pixel
```

### Fingerprint Generation
```python
def generate_fingerprint(document):
    metadata = extract_metadata(document)
    content = extract_content(document)
    
    fingerprint_data = {
        'content_hash': hashlib.sha256(content).hexdigest(),
        'metadata': metadata,
        'timestamp': time.time()
    }
    
    return hashlib.sha256(
        json.dumps(fingerprint_data).encode()
    ).hexdigest()[:16]
```

## 📈 Performance Considerations

- **Small Documents (<1MB)**: ~2-5 detik
- **Medium Documents (1-10MB)**: ~5-15 detik  
- **Large Documents (>10MB)**: ~15-30 detik

Faktor yang mempengaruhi:
- Jumlah gambar dalam dokumen
- Ukuran QR code
- Security level yang dipilih

## 🎯 Best Practices

### Untuk Developer:
1. Selalu validate input sebelum processing
2. Implement proper error handling
3. Log security events untuk audit
4. Regular cleanup expired bindings

### Untuk User:
1. Gunakan QR data yang meaningful
2. Simpan dokumen original (jangan edit)
3. Catat binding token untuk referensi
4. Process sebelum mendekati expiry

## 🔮 Future Enhancements

1. **Multi-Document Binding**
   - Satu QR untuk multiple dokumen

2. **Blockchain Integration**
   - Immutable binding records

3. **Advanced Encryption**
   - Quantum-resistant algorithms

4. **Mobile SDK**
   - Scan & validate via mobile app

---
