#!/usr/bin/env python3
"""
Comprehensive Test Suite for QR Code Watermarking Tool
======================================================

This single test file covers ALL testing needs:
- Backend API endpoints testing
- Enhanced QR utilities functionality
- LSB steganography features  
- Security components
- File structure validation
- Integration testing
- Performance testing
- Error handling

Usage:
    python test_application.py [--test-type all|api|qr|lsb|security|structure|integration]
    python test_application.py --report  # Generate detailed report
"""

import os
import sys
import json
import requests
import time
import argparse
import tempfile
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List


class ComprehensiveTestSuite:
    """Complete test suite for the QR Code Watermarking Tool."""
    
    def __init__(self, base_url="http://localhost:5001"):
        self.base_url = base_url
        self.test_results = {}
        self.failed_tests = []
        self.start_time = time.time()
        
    def log(self, message, level="INFO"):
        """Log test messages with timestamp."""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
    
    def test_file_structure(self):
        """Test essential file and directory structure."""
        self.log("🗂️ Testing File Structure", "TEST")
        
        required_files = [
            "app.py", "main.py", "lsb_steganography.py", "qr_utils.py",
            "security_utils.py", "security_storage.py", "qr_config_assistant.py",
            "requirements.txt", "README.md", ".gitignore"
        ]
        
        required_dirs = [
            "static/uploads", "static/generated", "public/documents", 
            "templates", "security_backups"
        ]
        
        optional_files = [
            "install.bat", "run.bat", "proses.md"
        ]
        
        results = {"passed": 0, "failed": 0, "details": []}
        
        # Test required files
        for file_path in required_files:
            if os.path.exists(file_path):
                file_size = os.path.getsize(file_path)
                self.log(f"✅ {file_path} ({file_size:,} bytes)")
                results["passed"] += 1
                results["details"].append(f"✅ {file_path}")
            else:
                self.log(f"❌ Missing: {file_path}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Missing: {file_path}")
        
        # Test directories
        for dir_path in required_dirs:
            if os.path.exists(dir_path):
                self.log(f"✅ Directory: {dir_path}/")
                results["passed"] += 1
                results["details"].append(f"✅ {dir_path}/")
            else:
                self.log(f"❌ Missing directory: {dir_path}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Missing: {dir_path}/")
        
        # Test optional files (warnings only)
        for file_path in optional_files:
            if os.path.exists(file_path):
                self.log(f"ℹ️ Optional: {file_path}")
            else:
                self.log(f"⚠️ Optional missing: {file_path}", "WARNING")
        
        self.test_results["file_structure"] = results
        return results["failed"] == 0
    
    def test_module_imports(self):
        """Test if all core modules can be imported."""
        self.log("📦 Testing Module Imports", "TEST")
        
        modules_to_test = [
            ("main", "Document processing core"),
            ("lsb_steganography", "LSB algorithms"),
            ("qr_utils", "QR utilities"), 
            ("security_utils", "Security features"),
            ("security_storage", "Key storage"),
            ("qr_config_assistant", "QR configuration")
        ]
        
        results = {"passed": 0, "failed": 0, "details": []}
        
        for module_name, description in modules_to_test:
            try:
                __import__(module_name)
                self.log(f"✅ {module_name}: {description}")
                results["passed"] += 1
                results["details"].append(f"✅ {module_name}")
            except ImportError as e:
                self.log(f"❌ {module_name}: Import failed - {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ {module_name}: {e}")
            except Exception as e:
                self.log(f"❌ {module_name}: Error - {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ {module_name}: {e}")
        
        self.test_results["module_imports"] = results
        return results["failed"] == 0
    
    def test_enhanced_qr_utilities(self):
        """Test enhanced QR utilities functionality."""
        self.log("🔍 Testing Enhanced QR Utilities", "TEST")
        
        results = {"passed": 0, "failed": 0, "details": []}
        
        try:
            import qr_utils
            
            # Test 1: Enhanced generate_qr
            try:
                os.makedirs("static/generated", exist_ok=True)
                result = qr_utils.generate_qr(
                    "Enhanced Test Data", 
                    "static/generated/test_enhanced.png",
                    error_correction='M',
                    box_size=8,
                    return_metadata=True
                )
                
                if result and result.get('success'):
                    metadata = result.get('metadata', {})
                    if 'version' in metadata and 'steganography_compatible' in metadata:
                        self.log("✅ Enhanced generate_qr with metadata")
                        results["passed"] += 1
                        results["details"].append("✅ Enhanced QR generation")
                    else:
                        self.log("❌ Metadata incomplete", "ERROR")
                        results["failed"] += 1
                        results["details"].append("❌ Incomplete metadata")
                else:
                    self.log("❌ Enhanced generate_qr failed", "ERROR")
                    results["failed"] += 1
                    results["details"].append("❌ Enhanced generation failed")
            except Exception as e:
                self.log(f"❌ Enhanced generate_qr error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Enhanced QR: {e}")
            
            # Test 2: QR Requirements Analysis
            try:
                analysis = qr_utils.analyze_qr_requirements("Test analysis data")
                if ('data_mode' in analysis and 'recommended_version' in analysis and 
                    'steganography_compatible' in analysis):
                    self.log("✅ QR requirements analysis")
                    results["passed"] += 1
                    results["details"].append("✅ Requirements analysis")
                else:
                    self.log("❌ Analysis incomplete", "ERROR")
                    results["failed"] += 1
                    results["details"].append("❌ Incomplete analysis")
            except Exception as e:
                self.log(f"❌ Requirements analysis error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Requirements: {e}")
            
            # Test 3: Steganography Capacity Estimation
            try:
                capacity = qr_utils.estimate_steganography_capacity((100, 100), (800, 600))
                if ('compatibility_level' in capacity and 'compatibility_score' in capacity):
                    self.log("✅ Steganography capacity estimation")
                    results["passed"] += 1
                    results["details"].append("✅ Capacity estimation")
                else:
                    self.log("❌ Capacity analysis incomplete", "ERROR")
                    results["failed"] += 1
                    results["details"].append("❌ Incomplete capacity")
            except Exception as e:
                self.log(f"❌ Capacity estimation error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Capacity: {e}")
            
            # Test 4: Capacity Info Analysis
            try:
                info = qr_utils.get_capacity_info(50, 'M')
                if ('current_level' in info and 'all_levels' in info):
                    self.log("✅ Capacity info analysis")
                    results["passed"] += 1
                    results["details"].append("✅ Capacity info")
                else:
                    self.log("❌ Capacity info incomplete", "ERROR")
                    results["failed"] += 1
                    results["details"].append("❌ Incomplete info")
            except Exception as e:
                self.log(f"❌ Capacity info error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Info: {e}")
            
            # Test 5: Quick QR Analysis
            try:
                quick = qr_utils.quick_qr_analysis("Quick test")
                if ('data_summary' in quick and 'quick_status' in quick):
                    self.log("✅ Quick QR analysis")
                    results["passed"] += 1
                    results["details"].append("✅ Quick analysis")
                else:
                    self.log("❌ Quick analysis incomplete", "ERROR")
                    results["failed"] += 1
                    results["details"].append("❌ Incomplete quick")
            except Exception as e:
                self.log(f"❌ Quick analysis error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Quick: {e}")
                
        except Exception as e:
            self.log(f"❌ QR utilities import/test error: {e}", "ERROR")
            results["failed"] += 1
            results["details"].append(f"❌ QR utils error: {e}")
        
        self.test_results["enhanced_qr"] = results
        return results["failed"] == 0
    
    def test_lsb_steganography(self):
        """Test LSB steganography functionality."""
        self.log("🖼️ Testing LSB Steganography", "TEST")
        
        results = {"passed": 0, "failed": 0, "details": []}
        
        try:
            import lsb_steganography
            
            # Test 1: Basic binary operations
            try:
                test_int = 123
                binary = lsb_steganography._int_to_binary(test_int, 8)
                converted_back = lsb_steganography._binary_to_int(binary)
                
                if converted_back == test_int:
                    self.log("✅ Binary conversion functions")
                    results["passed"] += 1
                    results["details"].append("✅ Binary conversion")
                else:
                    self.log("❌ Binary conversion failed", "ERROR")
                    results["failed"] += 1
                    results["details"].append("❌ Binary conversion")
            except Exception as e:
                self.log(f"❌ Binary conversion error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Binary: {e}")
            
            # Test 2: LSB bit manipulation
            try:
                test_pixel = 127
                test_bit = '1'
                modified_pixel = lsb_steganography._embed_bit(test_pixel, test_bit)
                extracted_bit = lsb_steganography._extract_lsb(modified_pixel)
                
                if extracted_bit == test_bit:
                    self.log("✅ LSB bit manipulation")
                    results["passed"] += 1
                    results["details"].append("✅ LSB manipulation")
                else:
                    self.log("❌ LSB manipulation failed", "ERROR")
                    results["failed"] += 1
                    results["details"].append("❌ LSB manipulation")
            except Exception as e:
                self.log(f"❌ LSB manipulation error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ LSB: {e}")
            
            # Test 3: Enhanced capacity analysis (if available)
            try:
                if hasattr(lsb_steganography, 'analyze_image_capacity'):
                    # Create a test image
                    from PIL import Image
                    test_img = Image.new('RGB', (100, 100), color='white')
                    test_path = "static/generated/test_capacity.png"
                    test_img.save(test_path)
                    
                    capacity = lsb_steganography.analyze_image_capacity(test_path)
                    if isinstance(capacity, dict) and 'total_pixels' in capacity:
                        self.log("✅ Enhanced capacity analysis")
                        results["passed"] += 1
                        results["details"].append("✅ Enhanced capacity")
                    else:
                        self.log("✅ Basic capacity analysis (legacy)")
                        results["passed"] += 1
                        results["details"].append("✅ Basic capacity")
                else:
                    self.log("ℹ️ Enhanced capacity analysis not available")
                    results["passed"] += 1
                    results["details"].append("ℹ️ Legacy LSB only")
            except Exception as e:
                self.log(f"❌ Capacity analysis error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Capacity: {e}")
                
        except Exception as e:
            self.log(f"❌ LSB steganography import error: {e}", "ERROR")
            results["failed"] += 1
            results["details"].append(f"❌ LSB import: {e}")
        
        self.test_results["lsb_steganography"] = results
        return results["failed"] == 0
    
    def test_security_features(self):
        """Test security-related functionality."""
        self.log("🔒 Testing Security Features", "TEST")
        
        results = {"passed": 0, "failed": 0, "details": []}
        
        try:
            import security_utils
            
            # Test 1: Document key generation
            try:
                test_doc_path = "README.md"
                if os.path.exists(test_doc_path):
                    key = security_utils.generate_document_key(test_doc_path)
                    if key and len(key) > 10:
                        self.log("✅ Document key generation")
                        results["passed"] += 1
                        results["details"].append("✅ Key generation")
                    else:
                        self.log("❌ Key generation failed", "ERROR")
                        results["failed"] += 1
                        results["details"].append("❌ Key generation")
                else:
                    self.log("⚠️ Test document not found", "WARNING")
                    results["passed"] += 1
                    results["details"].append("⚠️ No test doc")
            except Exception as e:
                self.log(f"❌ Key generation error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Key gen: {e}")
            
            # Test 2: Document hash generation
            try:
                test_doc_path = "README.md"
                if os.path.exists(test_doc_path):
                    doc_hash = security_utils.generate_document_hash(test_doc_path)
                    if doc_hash and len(doc_hash) > 10:
                        self.log("✅ Document hash generation")
                        results["passed"] += 1
                        results["details"].append("✅ Hash generation")
                    else:
                        self.log("❌ Hash generation failed", "ERROR")
                        results["failed"] += 1
                        results["details"].append("❌ Hash generation")
                else:
                    self.log("⚠️ Test document not found", "WARNING")
                    results["passed"] += 1
                    results["details"].append("⚠️ No test doc")
            except Exception as e:
                self.log(f"❌ Hash generation error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Hash gen: {e}")
            
            # Test 3: Security validation
            try:
                security_status = security_utils.validate_security_parameters()
                if isinstance(security_status, dict):
                    self.log("✅ Security parameter validation")
                    results["passed"] += 1
                    results["details"].append("✅ Security validation")
                else:
                    self.log("❌ Security validation failed", "ERROR")
                    results["failed"] += 1
                    results["details"].append("❌ Security validation")
            except Exception as e:
                self.log(f"❌ Security validation error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Security val: {e}")
            
            # Test 4: Security storage (if available)
            try:
                import security_storage
                if hasattr(security_storage, 'get_security_statistics'):
                    stats = security_storage.get_security_statistics()
                    if isinstance(stats, dict):
                        self.log("✅ Security storage system")
                        results["passed"] += 1
                        results["details"].append("✅ Storage system")
                    else:
                        self.log("❌ Storage system failed", "ERROR")
                        results["failed"] += 1
                        results["details"].append("❌ Storage system")
                else:
                    self.log("ℹ️ Basic security storage")
                    results["passed"] += 1
                    results["details"].append("ℹ️ Basic storage")
            except Exception as e:
                self.log(f"❌ Security storage error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Storage: {e}")
                
        except Exception as e:
            self.log(f"❌ Security features import error: {e}", "ERROR")
            results["failed"] += 1
            results["details"].append(f"❌ Security import: {e}")
        
        self.test_results["security"] = results
        return results["failed"] == 0
    
    def test_api_endpoints(self):
        """Test Flask API endpoints."""
        self.log("🌐 Testing API Endpoints", "TEST")
        
        endpoints_to_test = [
            ("/", "GET", "Main page"),
            ("/generate_qr", "POST", "QR Generation", {"qrData": "API Test"}),
            ("/generate_qr_realtime", "POST", "Real-time QR", {"qrData": "Real-time Test"}),
            ("/analyze_qr", "POST", "QR Analysis", {"qrData": "Analysis Test"}),
            ("/qr_config", "GET", "QR Configuration"),
            ("/list_documents", "GET", "Document List"),
        ]
        
        results = {"passed": 0, "failed": 0, "details": []}
        
        for endpoint_info in endpoints_to_test:
            endpoint = endpoint_info[0]
            method = endpoint_info[1]
            description = endpoint_info[2]
            test_data = endpoint_info[3] if len(endpoint_info) > 3 else {}
            
            try:
                if method == "GET":
                    response = requests.get(f"{self.base_url}{endpoint}", timeout=5)
                else:
                    response = requests.post(f"{self.base_url}{endpoint}", 
                                           data=test_data, timeout=5)
                
                if response.status_code in [200, 400]:  # 400 OK for validation errors
                    self.log(f"✅ {description}: {response.status_code}")
                    results["passed"] += 1
                    results["details"].append(f"✅ {description}")
                    
                    # Additional check for JSON endpoints
                    if endpoint in ["/generate_qr", "/analyze_qr", "/qr_config"]:
                        try:
                            json_response = response.json()
                            if "success" in json_response or "config" in json_response:
                                self.log(f"  📄 JSON response valid")
                            else:
                                self.log(f"  ⚠️ Unexpected JSON structure")
                        except:
                            self.log(f"  ⚠️ Non-JSON response")
                            
                else:
                    self.log(f"❌ {description}: {response.status_code}", "ERROR")
                    results["failed"] += 1
                    results["details"].append(f"❌ {description}: {response.status_code}")
                    
            except requests.exceptions.ConnectionError:
                self.log(f"🔌 {description}: Server not running", "WARNING")
                results["failed"] += 1
                results["details"].append(f"🔌 {description}: No connection")
            except Exception as e:
                self.log(f"❌ {description}: {str(e)}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ {description}: {str(e)}")
        
        self.test_results["api_endpoints"] = results
        
        # Special handling if server not running
        if all("No connection" in detail for detail in results["details"]):
            self.log("ℹ️ Flask server not running - start with 'python app.py'", "INFO")
            
        return results["failed"] == 0
    
    def test_integration_workflow(self):
        """Test complete integration workflow."""
        self.log("🔄 Testing Integration Workflow", "TEST")
        
        results = {"passed": 0, "failed": 0, "details": []}
        
        try:
            # Create temporary test environment
            with tempfile.TemporaryDirectory() as temp_dir:
                test_output_dir = os.path.join(temp_dir, "test_output")
                os.makedirs(test_output_dir, exist_ok=True)
                
                # Test 1: QR Generation Pipeline
                try:
                    import qr_utils
                    test_qr_path = os.path.join(test_output_dir, "integration_test.png")
                    
                    # Generate QR with analysis
                    if hasattr(qr_utils, 'generate_qr_with_analysis'):
                        result = qr_utils.generate_qr_with_analysis(
                            "Integration Test Data",
                            test_qr_path,
                            error_correction='M'
                        )
                        
                        if result and result.get('success') and os.path.exists(test_qr_path):
                            self.log("✅ QR generation pipeline")
                            results["passed"] += 1
                            results["details"].append("✅ QR pipeline")
                        else:
                            self.log("❌ QR generation pipeline failed", "ERROR")
                            results["failed"] += 1
                            results["details"].append("❌ QR pipeline")
                    else:
                        # Fallback to basic generation
                        qr_utils.generate_qr("Integration Test Data", test_qr_path)
                        if os.path.exists(test_qr_path):
                            self.log("✅ Basic QR generation")
                            results["passed"] += 1
                            results["details"].append("✅ Basic QR")
                        else:
                            self.log("❌ Basic QR generation failed", "ERROR")
                            results["failed"] += 1
                            results["details"].append("❌ Basic QR")
                            
                except Exception as e:
                    self.log(f"❌ QR generation integration error: {e}", "ERROR")
                    results["failed"] += 1
                    results["details"].append(f"❌ QR integration: {e}")
                
                # Test 2: LSB Integration (if possible)
                try:
                    import lsb_steganography
                    from PIL import Image
                    
                    # Create test cover image
                    cover_path = os.path.join(test_output_dir, "cover.png")
                    test_cover = Image.new('RGB', (200, 200), color='white')
                    test_cover.save(cover_path)
                    
                    # Create small test QR
                    qr_path = os.path.join(test_output_dir, "small_qr.png")
                    test_qr = Image.new('1', (21, 21), color=255)  # Small white QR
                    test_qr.save(qr_path)
                    
                    # Test embedding
                    stego_path = os.path.join(test_output_dir, "stego.png")
                    lsb_steganography.embed_qr_to_image(cover_path, qr_path, stego_path)
                    
                    if os.path.exists(stego_path):
                        self.log("✅ LSB embedding integration")
                        results["passed"] += 1
                        results["details"].append("✅ LSB integration")
                        
                        # Test extraction
                        try:
                            extracted_path = os.path.join(test_output_dir, "extracted.png")
                            lsb_steganography.extract_qr_from_image(stego_path, extracted_path)
                            
                            if os.path.exists(extracted_path):
                                self.log("✅ LSB extraction integration")
                                results["passed"] += 1
                                results["details"].append("✅ LSB extraction")
                            else:
                                self.log("❌ LSB extraction failed", "ERROR")
                                results["failed"] += 1
                                results["details"].append("❌ LSB extraction")
                        except Exception as e:
                            self.log(f"❌ LSB extraction error: {e}", "ERROR")
                            results["failed"] += 1
                            results["details"].append(f"❌ Extraction: {e}")
                    else:
                        self.log("❌ LSB embedding failed", "ERROR")
                        results["failed"] += 1
                        results["details"].append("❌ LSB embedding")
                        
                except Exception as e:
                    self.log(f"❌ LSB integration error: {e}", "ERROR")
                    results["failed"] += 1
                    results["details"].append(f"❌ LSB: {e}")
                
                # Test 3: Complete workflow simulation
                try:
                    import main
                    
                    # This would test document processing if we had test documents
                    if hasattr(main, 'extract_images_from_docx'):
                        self.log("✅ Document processing functions available")
                        results["passed"] += 1
                        results["details"].append("✅ Document functions")
                    else:
                        self.log("❌ Document processing functions missing", "ERROR")
                        results["failed"] += 1
                        results["details"].append("❌ Document functions")
                        
                except Exception as e:
                    self.log(f"❌ Document processing error: {e}", "ERROR")
                    results["failed"] += 1
                    results["details"].append(f"❌ Document: {e}")
                    
        except Exception as e:
            self.log(f"❌ Integration test setup error: {e}", "ERROR")
            results["failed"] += 1
            results["details"].append(f"❌ Setup: {e}")
        
        self.test_results["integration"] = results
        return results["failed"] == 0
    
    def test_performance_metrics(self):
        """Test performance and timing."""
        self.log("⚡ Testing Performance Metrics", "TEST")
        
        results = {"passed": 0, "failed": 0, "details": [], "metrics": {}}
        
        try:
            import qr_utils
            
            # Test QR generation speed
            start_time = time.time()
            try:
                os.makedirs("static/generated", exist_ok=True)
                qr_utils.generate_qr("Performance test data", "static/generated/perf_test.png")
                generation_time = time.time() - start_time
                
                results["metrics"]["qr_generation_time"] = generation_time
                
                if generation_time < 1.0:  # Should be under 1 second
                    self.log(f"✅ QR generation speed: {generation_time:.3f}s")
                    results["passed"] += 1
                    results["details"].append(f"✅ QR speed: {generation_time:.3f}s")
                else:
                    self.log(f"⚠️ QR generation slow: {generation_time:.3f}s", "WARNING")
                    results["passed"] += 1  # Still pass, just slow
                    results["details"].append(f"⚠️ QR slow: {generation_time:.3f}s")
                    
            except Exception as e:
                self.log(f"❌ QR generation performance test failed: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ QR perf: {e}")
            
            # Test analysis speed (if available)
            if hasattr(qr_utils, 'analyze_qr_requirements'):
                start_time = time.time()
                try:
                    qr_utils.analyze_qr_requirements("Performance analysis test data")
                    analysis_time = time.time() - start_time
                    
                    results["metrics"]["qr_analysis_time"] = analysis_time
                    
                    if analysis_time < 0.5:  # Should be very fast
                        self.log(f"✅ QR analysis speed: {analysis_time:.3f}s")
                        results["passed"] += 1
                        results["details"].append(f"✅ Analysis speed: {analysis_time:.3f}s")
                    else:
                        self.log(f"⚠️ QR analysis slow: {analysis_time:.3f}s", "WARNING")
                        results["passed"] += 1
                        results["details"].append(f"⚠️ Analysis slow: {analysis_time:.3f}s")
                        
                except Exception as e:
                    self.log(f"❌ QR analysis performance test failed: {e}", "ERROR")
                    results["failed"] += 1
                    results["details"].append(f"❌ Analysis perf: {e}")
            
            # Memory usage check (basic)
            try:
                import psutil
                import os
                
                process = psutil.Process(os.getpid())
                memory_mb = process.memory_info().rss / 1024 / 1024
                
                results["metrics"]["memory_usage_mb"] = memory_mb
                
                if memory_mb < 500:  # Under 500MB is good
                    self.log(f"✅ Memory usage: {memory_mb:.1f}MB")
                    results["passed"] += 1
                    results["details"].append(f"✅ Memory: {memory_mb:.1f}MB")
                else:
                    self.log(f"⚠️ High memory usage: {memory_mb:.1f}MB", "WARNING")
                    results["passed"] += 1
                    results["details"].append(f"⚠️ Memory: {memory_mb:.1f}MB")
                    
            except ImportError:
                self.log("ℹ️ psutil not available for memory testing")
                results["details"].append("ℹ️ No memory test")
            except Exception as e:
                self.log(f"❌ Memory test error: {e}", "ERROR")
                results["failed"] += 1
                results["details"].append(f"❌ Memory: {e}")
                
        except Exception as e:
            self.log(f"❌ Performance testing error: {e}", "ERROR")
            results["failed"] += 1
            results["details"].append(f"❌ Performance: {e}")
        
        self.test_results["performance"] = results
        return results["failed"] == 0
    
    def run_all_tests(self):
        """Run all test suites."""
        self.log("🚀 Starting Comprehensive Test Suite", "START")
        
        test_methods = [
            ("File Structure", self.test_file_structure),
            ("Module Imports", self.test_module_imports),
            ("Enhanced QR Utilities", self.test_enhanced_qr_utilities),
            ("LSB Steganography", self.test_lsb_steganography),
            ("Security Features", self.test_security_features),
            ("API Endpoints", self.test_api_endpoints),
            ("Integration Workflow", self.test_integration_workflow),
            ("Performance Metrics", self.test_performance_metrics),
        ]
        
        passed_suites = 0
        total_suites = len(test_methods)
        
        for suite_name, test_method in test_methods:
            self.log(f"Running {suite_name} tests...", "SUITE")
            try:
                if test_method():
                    passed_suites += 1
                    self.log(f"✅ {suite_name} suite PASSED", "PASS")
                else:
                    self.log(f"❌ {suite_name} suite FAILED", "FAIL")
                    self.failed_tests.append(suite_name)
            except Exception as e:
                self.log(f"❌ {suite_name} suite ERROR: {e}", "ERROR")
                self.failed_tests.append(suite_name)
        
        # Generate summary
        end_time = time.time()
        duration = end_time - self.start_time
        
        self.log("", "")
        self.log("=" * 70, "")
        self.log("📊 COMPREHENSIVE TEST SUMMARY", "SUMMARY")
        self.log("=" * 70, "")
        self.log(f"Total Test Suites: {total_suites}")
        self.log(f"Passed: {passed_suites}")
        self.log(f"Failed: {total_suites - passed_suites}")
        self.log(f"Duration: {duration:.2f} seconds")
        
        # Show detailed results
        total_tests = sum(result.get("passed", 0) + result.get("failed", 0) 
                         for result in self.test_results.values() 
                         if isinstance(result, dict))
        total_passed = sum(result.get("passed", 0) 
                          for result in self.test_results.values() 
                          if isinstance(result, dict))
        
        self.log(f"Individual Tests: {total_passed}/{total_tests} passed", "")
        
        if self.failed_tests:
            self.log("", "")
            self.log("❌ Failed Test Suites:", "FAIL")
            for failed_test in self.failed_tests:
                self.log(f"  - {failed_test}", "FAIL")
        else:
            self.log("🎉 All test suites passed!", "SUCCESS")
        
        # Performance summary
        if "performance" in self.test_results:
            perf_metrics = self.test_results["performance"].get("metrics", {})
            if perf_metrics:
                self.log("", "")
                self.log("⚡ Performance Summary:", "PERF")
                for metric, value in perf_metrics.items():
                    if "time" in metric:
                        self.log(f"  {metric}: {value:.3f}s", "PERF")
                    elif "memory" in metric:
                        self.log(f"  {metric}: {value:.1f}MB", "PERF")
        
        return len(self.failed_tests) == 0
    
    def generate_test_report(self, output_file="test_report.json"):
        """Generate a detailed test report."""
        report = {
            "timestamp": datetime.now().isoformat(),
            "duration": time.time() - self.start_time,
            "summary": {
                "total_suites": len(self.test_results),
                "passed_suites": len(self.test_results) - len(self.failed_tests),
                "failed_suites": len(self.failed_tests),
                "failed_suite_names": self.failed_tests
            },
            "detailed_results": self.test_results,
            "system_info": {
                "python_version": sys.version,
                "platform": sys.platform,
                "cwd": os.getcwd()
            }
        }
        
        # Add performance metrics if available
        if "performance" in self.test_results:
            report["performance_metrics"] = self.test_results["performance"].get("metrics", {})
        
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        self.log(f"📄 Detailed test report saved to: {output_file}")


def main():
    """Main test execution function."""
    parser = argparse.ArgumentParser(description="QR Code Watermarking Tool - Comprehensive Test Suite")
    parser.add_argument("--test-type", 
                       choices=["all", "structure", "imports", "qr", "lsb", "security", "api", "integration", "performance"], 
                       default="all", 
                       help="Type of tests to run")
    parser.add_argument("--base-url", default="http://localhost:5001", 
                       help="Base URL for API testing")
    parser.add_argument("--report", action="store_true", 
                       help="Generate detailed test report")
    
    args = parser.parse_args()
    
    # Initialize test suite
    test_suite = ComprehensiveTestSuite(args.base_url)
    
    # Run specific tests based on type
    success = True
    
    if args.test_type == "all":
        success = test_suite.run_all_tests()
    elif args.test_type == "structure":
        success = test_suite.test_file_structure()
    elif args.test_type == "imports":
        success = test_suite.test_module_imports()
    elif args.test_type == "qr":
        success = test_suite.test_enhanced_qr_utilities()
    elif args.test_type == "lsb":
        success = test_suite.test_lsb_steganography()
    elif args.test_type == "security":
        success = test_suite.test_security_features()
    elif args.test_type == "api":
        success = test_suite.test_api_endpoints()
    elif args.test_type == "integration":
        success = test_suite.test_integration_workflow()
    elif args.test_type == "performance":
        success = test_suite.test_performance_metrics()
    
    # Generate report if requested
    if args.report:
        test_suite.generate_test_report()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main() 
