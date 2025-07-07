// Utility functions for common button actions across the application

export const exportData = (data: any, filename: string, type: 'json' | 'csv' = 'json') => {
  let content: string
  let mimeType: string

  if (type === 'json') {
    content = JSON.stringify(data, null, 2)
    mimeType = 'application/json'
  } else {
    // Convert to CSV
    const headers = Object.keys(data[0] || {})
    const csvContent = [
      headers.join(','),
      ...data.map((row: any) => headers.map(header => row[header] || '').join(','))
    ].join('\n')
    content = csvContent
    mimeType = 'text/csv'
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.${type}`
  link.click()
  URL.revokeObjectURL(url)
}

export const shareContent = async (title: string, text: string, url?: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: url || window.location.href,
      })
    } catch (error) {
      console.log('Error sharing:', error)
      fallbackShare(url || window.location.href)
    }
  } else {
    fallbackShare(url || window.location.href)
  }
}

const fallbackShare = (url: string) => {
  navigator.clipboard.writeText(url).then(() => {
    alert('Link copied to clipboard!')
  }).catch(() => {
    prompt('Copy this link:', url)
  })
}

export const printContent = (elementId?: string) => {
  if (elementId) {
    const element = document.getElementById(elementId)
    if (element) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .no-print { display: none; }
              </style>
            </head>
            <body>
              ${element.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  } else {
    window.print()
  }
}

export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}

export const uploadFile = (accept: string = '*/*'): Promise<File | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      resolve(file || null)
    }
    input.click()
  })
}

export const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  // In a real app, this would show a proper toast notification
  const emoji = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  alert(`${emoji[type]} ${message}`)
}

export const addTreatment = (patientId: string, treatmentData: any) => {
  // Mock function for adding treatment
  console.log('Adding treatment for patient:', patientId, treatmentData)
  showAlert('Treatment added successfully!', 'success')
}

export const addAlert = (alertData: any) => {
  // Mock function for adding alert
  console.log('Adding alert:', alertData)
  showAlert('Alert created successfully!', 'success')
}

export const addDetail = (detailData: any) => {
  // Mock function for adding detail
  console.log('Adding detail:', detailData)
  showAlert('Detail added successfully!', 'success')
}

export const sendEmail = (to: string, subject: string, body: string) => {
  const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = mailtoLink
}

export const generateReport = async (reportType: string, data: any) => {
  // Mock report generation
  showAlert('Generating report...', 'info')
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const reportData = {
    type: reportType,
    generatedAt: new Date().toISOString(),
    data,
  }
  
  exportData(reportData, `${reportType}-report-${Date.now()}`)
  showAlert('Report generated and downloaded!', 'success')
}

export const saveSettings = (settings: any) => {
  // Mock function for saving settings
  localStorage.setItem('quantnex-settings', JSON.stringify(settings))
  showAlert('Settings saved successfully!', 'success')
}

export const loadSettings = () => {
  // Mock function for loading settings
  const saved = localStorage.getItem('quantnex-settings')
  return saved ? JSON.parse(saved) : null
}
