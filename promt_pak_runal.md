# Step-by-Step Integration Prompts for Cursor Agent Code

## Phase 1: Backend Integration - Unified Workflow API

### Step 1: Create Integrated Embed Workflow Endpoint

```prompt
Create a new Flask route `/embed_document_secure` that integrates QR generation, document embedding, and security binding in one seamless workflow. 

Requirements:
1. Accept form data: documentFile (docx/pdf), qrData (text), security options
2. Generate QR code with security binding if enabled
3. Embed the generated QR into document images using LSB steganography  
4. Return comprehensive results including QR URL, document download, and security info
5. Handle both secure and legacy modes
6. Maintain backward compatibility with existing `/embed_document` endpoint

The workflow should be:
1. Generate QR code (with or without document binding based on user choice)
2. Embed QR into document images 
3. Calculate quality metrics (MSE/PSNR)
4. Return all results in unified response

Base this on the existing embed_watermark_to_docx/pdf functions in main.py and security functions in secure_qr_utils.py.
```

### Step 2: Enhance Security Integration

```prompt
Modify the SecureQRGenerator class in secure_qr_utils.py to support inline document processing:

1. Add method `generate_and_embed_secure_qr()` that:
   - Takes document file, QR data, and security options
   - Generates bound QR code
   - Calls LSB embedding functions directly
   - Returns both QR file and processed document

2. Add method `generate_and_embed_legacy_qr()` for non-secure mode

3. Enhance error handling for the integrated workflow

4. Add progress tracking capabilities for long-running operations

The goal is to eliminate the need for separate QR generation and document embedding steps.
```

### Step 3: Update Main Processing Functions

```prompt
Modify the embed_watermark_to_docx and embed_watermark_to_pdf functions in main.py to:

1. Accept optional QR data string instead of requiring pre-generated QR file
2. Generate QR code internally if qr_data is provided instead of qr_path
3. Support security binding during QR generation
4. Maintain existing functionality for backward compatibility
5. Add parameter `security_config` for binding options

The functions should auto-detect whether they received QR file path or QR data string and process accordingly.
```

## Phase 2: Frontend Integration - Unified Embed Interface

### Step 4: Redesign Embed Page UI

```prompt
Redesign the embed.html template to create an integrated workflow interface:

1. Move QR generation controls directly into the embed form
2. Add QR data textarea input field 
3. Add security options section with:
   - Enable/disable document binding toggle
   - Binding expiry time selector
   - Security level indicator
4. Add real-time QR preview that updates as user types
5. Show capacity analysis for the QR data
6. Integrate with existing document upload and processing UI

The new layout should have sections:
- Document Upload (existing)
- QR Data Input (new - with real-time preview)
- Security Options (new - expandable section)
- Processing Results (enhanced to show QR + document results)
```

### Step 5: Update Embed JavaScript

```prompt
Enhance embed.js to support the integrated workflow:

1. Add real-time QR preview functionality (reuse from qr-generator.js)
2. Add QR data validation and capacity checking
3. Integrate security options handling
4. Update form submission to use new `/embed_document_secure` endpoint
5. Handle unified response format with QR + document results
6. Add progress indicators for the longer integrated process
7. Maintain existing functionality for file-based QR uploads (legacy mode)

The form should auto-detect whether user provided QR data text or uploaded QR file and use appropriate processing mode.
```

### Step 6: Create Security Options Component

```prompt
Create a reusable security options component in JavaScript:

1. Function `initSecurityOptions()` that:
   - Sets up security toggle controls
   - Shows/hides binding options based on toggle state
   - Validates security settings
   - Provides user feedback on security level

2. Add visual indicators for:
   - Security status (enabled/disabled)
   - Binding strength meter
   - Expiry time countdown
   - Document compatibility check

3. Integration hooks for the embed form and future use in other pages

This component should be modular and reusable across different pages.
```

## Phase 3: UI/UX Enhancement - Simplified Security Page

### Step 7: Streamline Security Page

```prompt
Simplify the security.html template to focus only on validation and information features:

1. Remove QR generation tab (moved to embed page)
2. Keep only these tabs:
   - Document-QR Binding Validation 
   - QR Security Information Extraction
   - Security Status Dashboard

3. Enhance validation tab with:
   - Drag & drop file uploads
   - Visual validation results with security indicators
   - Detailed binding information display

4. Add security dashboard showing:
   - Active bindings count
   - Recent validation history  
   - Security recommendations

The page should focus on verification and monitoring, not creation.
```

### Step 8: Update Navigation and User Flow

```prompt
Update the navigation and user experience flow:

1. Update base.html navigation to reflect new workflow:
   - "Generate QR" → "QR Generator" (standalone QR creation)
   - "Embed Watermark" → "Secure Document Embedding" (integrated workflow)
   - "Validate" → keep as is
   - "Security" → "Security Center" (validation & monitoring only)

2. Add contextual help and workflow guides:
   - Step-by-step process indicators
   - Tooltips explaining security options
   - Workflow completion confirmation

3. Update route names and URL patterns to match new functionality

4. Add breadcrumb navigation for complex workflows
```

## Phase 4: Testing and Integration Validation

### Step 9: Add Integration Tests

```prompt
Create comprehensive tests for the integrated workflow:

1. Unit tests for new backend endpoints
2. Integration tests for the complete QR generation → embedding → binding flow
3. Security validation tests
4. Performance tests for the longer unified process
5. Backward compatibility tests

Create test files:
- `test_integrated_workflow.py`
- `test_security_integration.py`  
- `test_ui_integration.js`

Include both positive and negative test cases, error handling, and edge cases.
```

### Step 10: Update Documentation and Error Handling

```prompt
Finalize the integration with comprehensive documentation and error handling:

1. Update all docstrings and comments to reflect new integrated workflow
2. Create user guide documentation for the new unified process
3. Add comprehensive error messages and user feedback
4. Implement proper logging for the integrated workflow
5. Add input validation and sanitization
6. Create migration guide for users familiar with old separate-step process

Include examples of the complete workflow from start to finish.
```

## Implementation Order

Execute these prompts in sequence with Cursor Agent Code:

1. **Backend First**: Steps 1-3 (establish solid API foundation)
2. **Frontend Integration**: Steps 4-6 (build user interface)  
3. **UX Refinement**: Steps 7-8 (polish and streamline)
4. **Quality Assurance**: Steps 9-10 (test and document)

## Key Integration Points

- **Unified Response Format**: All endpoints return consistent JSON with QR, document, and security data
- **Progressive Enhancement**: Legacy file-based QR uploads still work alongside new text-based generation
- **Security by Design**: Document binding is seamlessly integrated, not bolted on
- **User Experience**: Single form submission handles entire workflow
- **Backward Compatibility**: Existing functionality remains available

## Expected User Flow After Integration

1. User uploads document
2. User enters QR data text (with real-time preview)
3. User optionally enables security binding
4. Single "Secure Embed" button triggers entire workflow
5. User receives processed document with embedded secure QR code
6. User can validate binding using Security Center

This eliminates the need for separate QR generation, manual download/upload, and separate embedding steps.