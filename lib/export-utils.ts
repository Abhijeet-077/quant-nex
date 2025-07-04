import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

export interface ExportData {
  title: string
  data: any[]
  headers?: string[]
  metadata?: Record<string, any>
  chartData?: any[]
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json'
  filename?: string
  includeCharts?: boolean
  includeMetadata?: boolean
}

// PDF Export functionality
export const exportToPDF = async (exportData: ExportData, options: ExportOptions = { format: 'pdf' }) => {
  const doc = new jsPDF()
  const { title, data, headers, metadata } = exportData
  const filename = options.filename || `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`

  // Add title
  doc.setFontSize(20)
  doc.setTextColor(0, 100, 200) // Blue color
  doc.text(title, 20, 20)

  // Add metadata if available
  let yPosition = 40
  if (options.includeMetadata && metadata) {
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    Object.entries(metadata).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 20, yPosition)
      yPosition += 10
    })
    yPosition += 10
  }

  // Add table data
  if (data && data.length > 0) {
    doc.setFontSize(10)
    const tableHeaders = headers || Object.keys(data[0])
    
    // Headers
    doc.setTextColor(0, 100, 200)
    tableHeaders.forEach((header, index) => {
      doc.text(header, 20 + (index * 40), yPosition)
    })
    yPosition += 10

    // Data rows
    doc.setTextColor(0, 0, 0)
    data.forEach((row, rowIndex) => {
      if (yPosition > 270) { // New page if needed
        doc.addPage()
        yPosition = 20
      }
      
      tableHeaders.forEach((header, colIndex) => {
        const cellValue = String(row[header] || '')
        doc.text(cellValue.substring(0, 15), 20 + (colIndex * 40), yPosition)
      })
      yPosition += 8
    })
  }

  // Add timestamp
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, doc.internal.pageSize.height - 10)

  doc.save(filename)
}

// Excel Export functionality
export const exportToExcel = (exportData: ExportData, options: ExportOptions = { format: 'excel' }) => {
  const { title, data, headers, metadata } = exportData
  const filename = options.filename || `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`

  const workbook = XLSX.utils.book_new()
  
  // Main data sheet
  const worksheet = XLSX.utils.json_to_sheet(data, { header: headers })
  
  // Add metadata sheet if available
  if (options.includeMetadata && metadata) {
    const metadataSheet = XLSX.utils.json_to_sheet([metadata])
    XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata')
  }
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
  XLSX.writeFile(workbook, filename)
}

// CSV Export functionality
export const exportToCSV = (exportData: ExportData, options: ExportOptions = { format: 'csv' }) => {
  const { title, data, headers } = exportData
  const filename = options.filename || `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`

  const csvHeaders = headers || Object.keys(data[0] || {})
  const csvContent = [
    csvHeaders.join(','),
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header] || ''
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// JSON Export functionality
export const exportToJSON = (exportData: ExportData, options: ExportOptions = { format: 'json' }) => {
  const { title, data, metadata } = exportData
  const filename = options.filename || `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`

  const exportObject = {
    title,
    exportDate: new Date().toISOString(),
    ...(options.includeMetadata && metadata ? { metadata } : {}),
    data
  }

  const jsonContent = JSON.stringify(exportObject, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Universal export function
export const exportData = async (exportData: ExportData, options: ExportOptions) => {
  try {
    switch (options.format) {
      case 'pdf':
        await exportToPDF(exportData, options)
        break
      case 'excel':
        exportToExcel(exportData, options)
        break
      case 'csv':
        exportToCSV(exportData, options)
        break
      case 'json':
        exportToJSON(exportData, options)
        break
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }
    return { success: true, message: `Data exported successfully as ${options.format.toUpperCase()}` }
  } catch (error) {
    console.error('Export error:', error)
    return { success: false, message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}

// Predefined export configurations for different pages
export const exportConfigs = {
  dashboard: {
    title: 'Dashboard Overview',
    headers: ['metric', 'value', 'change', 'status'],
    metadata: {
      page: 'Dashboard',
      user: 'Dr. Priya Sharma',
      hospital: 'AIIMS Delhi'
    }
  },
  analytics: {
    title: 'Analytics Report',
    headers: ['title', 'value', 'change', 'trend', 'category'],
    metadata: {
      page: 'Analytics',
      user: 'Dr. Priya Sharma',
      hospital: 'AIIMS Delhi'
    }
  },
  patients: {
    title: 'Patient Records',
    headers: ['id', 'firstName', 'lastName', 'age', 'gender', 'cancerType', 'stage', 'status', 'treatmentProgress', 'lastVisit'],
    metadata: {
      page: 'Patients',
      user: 'Dr. Priya Sharma',
      hospital: 'AIIMS Delhi'
    }
  },
  monitoring: {
    title: 'Patient Monitoring Data',
    headers: ['timestamp', 'patientId', 'heartRate', 'bloodPressure', 'temperature', 'oxygenSat', 'status'],
    metadata: {
      page: 'Monitoring',
      user: 'Dr. Priya Sharma',
      hospital: 'AIIMS Delhi'
    }
  },
  treatment: {
    title: 'Treatment Plans',
    headers: ['patientId', 'treatmentType', 'startDate', 'endDate', 'progress', 'efficacy', 'sideEffects'],
    metadata: {
      page: 'Treatment',
      user: 'Dr. Priya Sharma',
      hospital: 'AIIMS Delhi'
    }
  },
  schedule: {
    title: 'Appointment Schedule',
    headers: ['id', 'patient', 'time', 'type', 'location', 'status', 'phone'],
    metadata: {
      page: 'Schedule',
      user: 'Dr. Priya Sharma',
      hospital: 'AIIMS Delhi'
    }
  },
  reports: {
    title: 'Medical Reports',
    headers: ['reportId', 'title', 'type', 'createdDate', 'status', 'category'],
    metadata: {
      page: 'Reports',
      user: 'Dr. Priya Sharma',
      hospital: 'AIIMS Delhi'
    }
  }
}

// Helper function to prepare data for export
export const prepareExportData = (pageType: keyof typeof exportConfigs, rawData: any[]): ExportData => {
  const config = exportConfigs[pageType]
  return {
    title: config.title,
    data: rawData,
    headers: config.headers,
    metadata: {
      ...config.metadata,
      exportDate: new Date().toISOString(),
      recordCount: rawData.length
    }
  }
}
