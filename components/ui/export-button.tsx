"use client"

import { useState } from "react"
import { Download, FileText, FileSpreadsheet, Database, FileJson, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { exportData, prepareExportData, type ExportOptions } from "@/lib/export-utils"

interface ExportButtonProps {
  pageType: 'dashboard' | 'patients' | 'monitoring' | 'treatment' | 'schedule'
  data: any[]
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  customTitle?: string
  customFilename?: string
}

export function ExportButton({ 
  pageType, 
  data, 
  className = "",
  variant = "outline",
  size = "sm",
  customTitle,
  customFilename
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportingFormat, setExportingFormat] = useState<string | null>(null)
  const { toast } = useToast()

  const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'json') => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available to export.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    setExportingFormat(format)

    try {
      const exportData = prepareExportData(pageType, data)
      
      if (customTitle) {
        exportData.title = customTitle
      }

      const options: ExportOptions = {
        format,
        filename: customFilename,
        includeCharts: true,
        includeMetadata: true,
      }

      const result = await exportData(exportData, options)
      
      if (result.success) {
        toast({
          title: "Export successful",
          description: result.message,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setExportingFormat(null)
    }
  }

  const exportOptions = [
    {
      format: 'pdf' as const,
      label: 'PDF Report',
      description: 'Formatted document with charts',
      icon: FileText,
      color: 'text-red-400'
    },
    {
      format: 'excel' as const,
      label: 'Excel Spreadsheet',
      description: 'Structured data with multiple sheets',
      icon: FileSpreadsheet,
      color: 'text-green-400'
    },
    {
      format: 'csv' as const,
      label: 'CSV File',
      description: 'Comma-separated values',
      icon: Database,
      color: 'text-blue-400'
    },
    {
      format: 'json' as const,
      label: 'JSON Data',
      description: 'Raw data in JSON format',
      icon: FileJson,
      color: 'text-purple-400'
    }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`${className} ${variant === 'outline' ? 'border-blue-500/30 text-blue-300 hover:bg-blue-500/20' : ''}`}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting {exportingFormat?.toUpperCase()}...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-black/90 border-blue-500/30 backdrop-blur-sm"
        align="end"
      >
        <DropdownMenuLabel className="text-white">
          Export Options
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-500/20" />
        {exportOptions.map((option) => {
          const Icon = option.icon
          return (
            <DropdownMenuItem
              key={option.format}
              onClick={() => handleExport(option.format)}
              className="cursor-pointer hover:bg-blue-500/20 focus:bg-blue-500/20"
              disabled={isExporting}
            >
              <div className="flex items-center w-full">
                <Icon className={`h-4 w-4 mr-3 ${option.color}`} />
                <div className="flex-1">
                  <div className="text-white font-medium">{option.label}</div>
                  <div className="text-gray-400 text-xs">{option.description}</div>
                </div>
              </div>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator className="bg-blue-500/20" />
        <div className="px-2 py-1 text-xs text-gray-400">
          {data?.length || 0} records available
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Quick export button for specific formats
interface QuickExportButtonProps {
  pageType: 'dashboard' | 'patients' | 'monitoring' | 'treatment' | 'schedule'
  data: any[]
  format: 'pdf' | 'excel' | 'csv' | 'json'
  className?: string
  children?: React.ReactNode
}

export function QuickExportButton({ 
  pageType, 
  data, 
  format, 
  className = "",
  children 
}: QuickExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available to export.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      const exportData = prepareExportData(pageType, data)
      const options: ExportOptions = {
        format,
        includeCharts: true,
        includeMetadata: true,
      }

      const result = await exportData(exportData, options)
      
      if (result.success) {
        toast({
          title: "Export successful",
          description: result.message,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      className={className}
      variant="outline"
      size="sm"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Exporting...
        </>
      ) : (
        children || (
          <>
            <Download className="h-4 w-4 mr-2" />
            Export {format.toUpperCase()}
          </>
        )
      )}
    </Button>
  )
}
