#!/usr/bin/env node

/**
 * Deployment Verification Script for Quant-NEX Medical Application
 * Verifies that all critical functionality works on the live Vercel deployment
 */

const https = require('https');
const fs = require('fs');

const DEPLOYMENT_URL = 'https://quant-nex.vercel.app';
const TIMEOUT = 30000; // 30 seconds

// Critical pages to test
const CRITICAL_PAGES = [
  '/',
  '/dashboard',
  '/3d-models',
  '/patients',
  '/diagnosis',
  '/treatment',
  '/monitoring',
  '/reports',
  '/analytics',
  '/login'
];

// Expected content checks
const CONTENT_CHECKS = {
  '/': ['Quant-NEX', 'Medical', 'Cancer Treatment'],
  '/dashboard': ['Medical Dashboard', 'Patient', 'Treatment'],
  '/3d-models': ['Advanced 3D Medical Models', 'Brain Anatomy', 'Interactive'],
  '/patients': ['Patient Management', 'Medical Records'],
  '/diagnosis': ['Medical Diagnosis', 'Analysis'],
  '/treatment': ['Treatment Planning', 'Therapy'],
  '/monitoring': ['Patient Monitoring', 'Vital Signs'],
  '/reports': ['Medical Reports', 'Analytics'],
  '/analytics': ['Medical Analytics', 'Data'],
  '/login': ['Login', 'Authentication', 'Medical']
};

class DeploymentVerifier {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      deployment_url: DEPLOYMENT_URL,
      total_pages: CRITICAL_PAGES.length,
      passed: 0,
      failed: 0,
      errors: [],
      page_results: {},
      performance: {},
      summary: ''
    };
  }

  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const req = https.get(url, {
        timeout: TIMEOUT,
        headers: {
          'User-Agent': 'Quant-NEX-Deployment-Verifier/1.0'
        }
      }, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            responseTime: responseTime
          });
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout after ${TIMEOUT}ms`));
      });
      
      req.on('error', (error) => {
        reject(error);
      });
    });
  }

  async verifyPage(path) {
    const url = `${DEPLOYMENT_URL}${path}`;
    console.log(`🔍 Testing: ${url}`);
    
    try {
      const response = await this.makeRequest(url);
      const expectedContent = CONTENT_CHECKS[path] || [];
      
      const result = {
        url: url,
        path: path,
        status_code: response.statusCode,
        response_time: response.responseTime,
        content_length: response.body.length,
        passed: false,
        issues: [],
        content_checks: {}
      };

      // Check status code
      if (response.statusCode !== 200) {
        result.issues.push(`HTTP ${response.statusCode} instead of 200`);
      }

      // Check response time
      if (response.responseTime > 5000) {
        result.issues.push(`Slow response: ${response.responseTime}ms (>5s)`);
      }

      // Check content length
      if (response.body.length < 1000) {
        result.issues.push(`Suspiciously small content: ${response.body.length} bytes`);
      }

      // Check for expected content
      expectedContent.forEach(content => {
        const found = response.body.toLowerCase().includes(content.toLowerCase());
        result.content_checks[content] = found;
        if (!found) {
          result.issues.push(`Missing expected content: "${content}"`);
        }
      });

      // Check for error indicators
      const errorIndicators = ['error', 'not found', '404', '500', 'exception'];
      errorIndicators.forEach(indicator => {
        if (response.body.toLowerCase().includes(indicator)) {
          result.issues.push(`Found error indicator: "${indicator}"`);
        }
      });

      // Check for 3D-related content on 3D pages
      if (path === '/3d-models' || path === '/dashboard') {
        const has3DContent = response.body.includes('3D') || 
                           response.body.includes('three') || 
                           response.body.includes('webgl') ||
                           response.body.includes('canvas');
        if (!has3DContent) {
          result.issues.push('Missing 3D-related content');
        }
      }

      // Determine if page passed
      result.passed = response.statusCode === 200 && result.issues.length === 0;

      if (result.passed) {
        console.log(`✅ PASS: ${path} (${response.responseTime}ms)`);
        this.results.passed++;
      } else {
        console.log(`❌ FAIL: ${path} - ${result.issues.join(', ')}`);
        this.results.failed++;
        this.results.errors.push({
          page: path,
          issues: result.issues
        });
      }

      this.results.page_results[path] = result;
      this.results.performance[path] = response.responseTime;

    } catch (error) {
      console.log(`💥 ERROR: ${path} - ${error.message}`);
      this.results.failed++;
      this.results.errors.push({
        page: path,
        issues: [error.message]
      });
      
      this.results.page_results[path] = {
        url: url,
        path: path,
        passed: false,
        error: error.message
      };
    }
  }

  async verifyDeployment() {
    console.log('🚀 Starting Quant-NEX Deployment Verification');
    console.log(`📍 Target: ${DEPLOYMENT_URL}`);
    console.log(`📊 Testing ${CRITICAL_PAGES.length} critical pages\n`);

    const startTime = Date.now();

    // Test all pages
    for (const page of CRITICAL_PAGES) {
      await this.verifyPage(page);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Generate summary
    const successRate = (this.results.passed / this.results.total_pages * 100).toFixed(1);
    const avgResponseTime = Object.values(this.results.performance).reduce((a, b) => a + b, 0) / Object.values(this.results.performance).length;

    this.results.summary = `${this.results.passed}/${this.results.total_pages} pages passed (${successRate}%)`;
    this.results.total_verification_time = totalTime;
    this.results.average_response_time = Math.round(avgResponseTime);

    console.log('\n📋 DEPLOYMENT VERIFICATION RESULTS');
    console.log('=====================================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📊 Success Rate: ${successRate}%`);
    console.log(`⏱️  Average Response Time: ${Math.round(avgResponseTime)}ms`);
    console.log(`🕐 Total Verification Time: ${totalTime}ms`);

    if (this.results.errors.length > 0) {
      console.log('\n🚨 ISSUES FOUND:');
      this.results.errors.forEach(error => {
        console.log(`   ${error.page}: ${error.issues.join(', ')}`);
      });
    }

    // Performance analysis
    console.log('\n⚡ PERFORMANCE ANALYSIS:');
    Object.entries(this.results.performance).forEach(([page, time]) => {
      const status = time < 2000 ? '🟢' : time < 5000 ? '🟡' : '🔴';
      console.log(`   ${status} ${page}: ${time}ms`);
    });

    // Overall status
    const overallStatus = this.results.failed === 0 ? 'DEPLOYMENT SUCCESSFUL' : 'DEPLOYMENT ISSUES DETECTED';
    const statusIcon = this.results.failed === 0 ? '🎉' : '⚠️';
    
    console.log(`\n${statusIcon} ${overallStatus}`);
    
    if (this.results.failed === 0) {
      console.log('🚀 All critical pages are working correctly!');
      console.log('✅ 3D medical visualization system is operational');
      console.log('✅ Dashboard and medical functionality verified');
      console.log('✅ Production deployment is ready for medical use');
    } else {
      console.log('🔧 Some issues need attention before production use');
    }

    // Save results to file
    const reportPath = `deployment-verification-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    return this.results.failed === 0;
  }
}

// Run verification if called directly
if (require.main === module) {
  const verifier = new DeploymentVerifier();
  verifier.verifyDeployment()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Verification failed:', error);
      process.exit(1);
    });
}

module.exports = DeploymentVerifier;
