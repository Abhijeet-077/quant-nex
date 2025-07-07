// Comprehensive functionality testing utilities for QuantNex.ai

export interface TestResult {
  component: string
  test: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  timestamp: string
}

export class FunctionalityTester {
  private results: TestResult[] = []

  private addResult(component: string, test: string, status: 'pass' | 'fail' | 'warning', message: string) {
    this.results.push({
      component,
      test,
      status,
      message,
      timestamp: new Date().toISOString()
    })
  }

  // Test authentication flow
  async testAuthentication(): Promise<TestResult[]> {
    const component = 'Authentication'
    
    try {
      // Test if auth context is available
      if (typeof window !== 'undefined') {
        const hasAuthContext = !!document.querySelector('[data-auth-context]')
        this.addResult(component, 'Auth Context', hasAuthContext ? 'pass' : 'fail', 
          hasAuthContext ? 'Auth context is available' : 'Auth context not found')
      }

      // Test login page accessibility
      const loginPageExists = await this.testPageExists('/login')
      this.addResult(component, 'Login Page', loginPageExists ? 'pass' : 'fail',
        loginPageExists ? 'Login page is accessible' : 'Login page not accessible')

      // Test protected route redirection
      const dashboardRedirects = await this.testProtectedRoute('/dashboard')
      this.addResult(component, 'Protected Routes', dashboardRedirects ? 'pass' : 'warning',
        dashboardRedirects ? 'Protected routes redirect correctly' : 'Protected route behavior unclear')

    } catch (error) {
      this.addResult(component, 'Authentication Test', 'fail', `Error: ${error}`)
    }

    return this.results.filter(r => r.component === component)
  }

  // Test navigation functionality
  async testNavigation(): Promise<TestResult[]> {
    const component = 'Navigation'
    
    const pages = [
      '/dashboard',
      '/diagnosis', 
      '/prognosis',
      '/treatment',
      '/analysis',
      '/reports',
      '/downloads',
      '/profile'
    ]

    for (const page of pages) {
      try {
        const exists = await this.testPageExists(page)
        this.addResult(component, `Page: ${page}`, exists ? 'pass' : 'fail',
          exists ? `${page} is accessible` : `${page} is not accessible`)
      } catch (error) {
        this.addResult(component, `Page: ${page}`, 'fail', `Error accessing ${page}: ${error}`)
      }
    }

    return this.results.filter(r => r.component === component)
  }

  // Test UI components
  testUIComponents(): TestResult[] {
    const component = 'UI Components'

    if (typeof window === 'undefined') {
      this.addResult(component, 'UI Test', 'warning', 'UI tests can only run in browser environment')
      return this.results.filter(r => r.component === component)
    }

    // Test if main layout elements exist
    const sidebar = document.querySelector('[data-sidebar]')
    this.addResult(component, 'Sidebar', sidebar ? 'pass' : 'fail',
      sidebar ? 'Sidebar is present' : 'Sidebar not found')

    const mainContent = document.querySelector('main')
    this.addResult(component, 'Main Content', mainContent ? 'pass' : 'fail',
      mainContent ? 'Main content area is present' : 'Main content area not found')

    // Test if cards are rendering
    const cards = document.querySelectorAll('[class*="card"]')
    this.addResult(component, 'Card Components', cards.length > 0 ? 'pass' : 'fail',
      `Found ${cards.length} card components`)

    // Test if buttons are interactive
    const buttons = document.querySelectorAll('button')
    this.addResult(component, 'Button Components', buttons.length > 0 ? 'pass' : 'fail',
      `Found ${buttons.length} button components`)

    return this.results.filter(r => r.component === component)
  }

  // Test responsive design
  testResponsiveDesign(): TestResult[] {
    const component = 'Responsive Design'

    if (typeof window === 'undefined') {
      this.addResult(component, 'Responsive Test', 'warning', 'Responsive tests can only run in browser environment')
      return this.results.filter(r => r.component === component)
    }

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // Test viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    this.addResult(component, 'Viewport Meta', viewportMeta ? 'pass' : 'fail',
      viewportMeta ? 'Viewport meta tag is present' : 'Viewport meta tag missing')

    // Test responsive classes
    const responsiveElements = document.querySelectorAll('[class*="md:"], [class*="lg:"], [class*="sm:"]')
    this.addResult(component, 'Responsive Classes', responsiveElements.length > 0 ? 'pass' : 'warning',
      `Found ${responsiveElements.length} elements with responsive classes`)

    // Test current viewport
    let viewportCategory = 'unknown'
    if (viewport.width >= 1024) viewportCategory = 'desktop'
    else if (viewport.width >= 768) viewportCategory = 'tablet'
    else viewportCategory = 'mobile'

    this.addResult(component, 'Current Viewport', 'pass',
      `Current viewport: ${viewportCategory} (${viewport.width}x${viewport.height})`)

    return this.results.filter(r => r.component === component)
  }

  // Test download functionality
  testDownloadFunctionality(): TestResult[] {
    const component = 'Download Functionality'

    if (typeof window === 'undefined') {
      this.addResult(component, 'Download Test', 'warning', 'Download tests can only run in browser environment')
      return this.results.filter(r => r.component === component)
    }

    // Test if download buttons exist
    const downloadButtons = document.querySelectorAll('button[class*="download"], button:has([data-lucide="download"])')
    this.addResult(component, 'Download Buttons', downloadButtons.length > 0 ? 'pass' : 'warning',
      `Found ${downloadButtons.length} download buttons`)

    // Test if download manager page exists
    const downloadPage = window.location.pathname === '/downloads'
    this.addResult(component, 'Download Manager', downloadPage ? 'pass' : 'warning',
      downloadPage ? 'Currently on download manager page' : 'Download manager page not currently loaded')

    return this.results.filter(r => r.component === component)
  }

  // Test report generation
  testReportGeneration(): TestResult[] {
    const component = 'Report Generation'

    if (typeof window === 'undefined') {
      this.addResult(component, 'Report Test', 'warning', 'Report tests can only run in browser environment')
      return this.results.filter(r => r.component === component)
    }

    // Test if report generation elements exist
    const reportButtons = document.querySelectorAll('button:has([data-lucide="file-text"])')
    this.addResult(component, 'Report Buttons', reportButtons.length > 0 ? 'pass' : 'warning',
      `Found ${reportButtons.length} report-related buttons`)

    // Test if reports page exists
    const reportsPage = window.location.pathname === '/reports'
    this.addResult(component, 'Reports Page', reportsPage ? 'pass' : 'warning',
      reportsPage ? 'Currently on reports page' : 'Reports page not currently loaded')

    return this.results.filter(r => r.component === component)
  }

  // Helper method to test if a page exists
  private async testPageExists(path: string): Promise<boolean> {
    try {
      const response = await fetch(path, { method: 'HEAD' })
      return response.status !== 404
    } catch {
      return false
    }
  }

  // Helper method to test protected routes
  private async testProtectedRoute(path: string): Promise<boolean> {
    try {
      const response = await fetch(path, { method: 'HEAD', redirect: 'manual' })
      // If it redirects (status 302/301) or requires auth (401/403), it's properly protected
      return [301, 302, 401, 403].includes(response.status)
    } catch {
      return false
    }
  }

  // Run all tests
  async runAllTests(): Promise<TestResult[]> {
    this.results = [] // Clear previous results

    console.log('🧪 Starting comprehensive functionality tests...')

    await this.testAuthentication()
    await this.testNavigation()
    this.testUIComponents()
    this.testResponsiveDesign()
    this.testDownloadFunctionality()
    this.testReportGeneration()

    const summary = this.getTestSummary()
    console.log('📊 Test Summary:', summary)

    return this.results
  }

  // Get test summary
  getTestSummary() {
    const total = this.results.length
    const passed = this.results.filter(r => r.status === 'pass').length
    const failed = this.results.filter(r => r.status === 'fail').length
    const warnings = this.results.filter(r => r.status === 'warning').length

    return {
      total,
      passed,
      failed,
      warnings,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0
    }
  }

  // Get results by component
  getResultsByComponent() {
    const components = [...new Set(this.results.map(r => r.component))]
    return components.map(component => ({
      component,
      results: this.results.filter(r => r.component === component)
    }))
  }

  // Export results
  exportResults() {
    return {
      timestamp: new Date().toISOString(),
      summary: this.getTestSummary(),
      results: this.results,
      byComponent: this.getResultsByComponent()
    }
  }
}

// Global test runner
export const testRunner = new FunctionalityTester()

// Convenience function to run tests from browser console
if (typeof window !== 'undefined') {
  (window as any).runQuantNexTests = () => testRunner.runAllTests()
}
