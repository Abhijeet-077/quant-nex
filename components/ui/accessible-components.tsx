"use client"

import React, { forwardRef, useId, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { AriaUtils, screenReader } from '@/lib/accessibility'
import { useMedicalFontSizes, useMedicalTabletOptimization } from '@/hooks/use-mobile'

// Accessible Medical Data Display
interface AccessibleMedicalDataProps {
  patientName: string
  dataType: string
  value: string | number
  unit?: string
  severity?: 'normal' | 'warning' | 'critical'
  className?: string
  children?: React.ReactNode
}

export const AccessibleMedicalData = forwardRef<HTMLDivElement, AccessibleMedicalDataProps>(
  ({ patientName, dataType, value, unit, severity = 'normal', className, children }, ref) => {
    const id = useId()
    const fontSizes = useMedicalFontSizes()
    
    const ariaLabel = AriaUtils.patientDataLabel(patientName, dataType, `${value}${unit ? ` ${unit}` : ''}`)
    
    const severityStyles = {
      normal: 'text-white',
      warning: 'text-yellow-400',
      critical: 'text-red-400 animate-pulse'
    }

    return (
      <div
        ref={ref}
        id={id}
        className={cn(
          'p-4 rounded-lg bg-black/30 glow-border-subtle',
          severity === 'critical' && 'border-red-500/50',
          severity === 'warning' && 'border-yellow-500/50',
          className
        )}
        role="region"
        aria-label={ariaLabel}
        aria-live={severity === 'critical' ? 'assertive' : 'polite'}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={cn('font-medium text-gray-300', fontSizes.bodyText)}>
              {dataType}
            </h3>
            <p className={cn('font-bold', fontSizes.medicalData, severityStyles[severity])}>
              {value}{unit && <span className="text-sm ml-1">{unit}</span>}
            </p>
          </div>
          {severity === 'critical' && (
            <div className="text-red-400" aria-hidden="true">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        {children}
      </div>
    )
  }
)

AccessibleMedicalData.displayName = 'AccessibleMedicalData'

// Accessible Patient Card
interface AccessiblePatientCardProps {
  patient: {
    id: string
    firstName: string
    lastName: string
    age: number
    cancerType: string
    stage: string
    status: string
    treatmentProgress: number
  }
  onClick?: () => void
  className?: string
}

export const AccessiblePatientCard = forwardRef<HTMLDivElement, AccessiblePatientCardProps>(
  ({ patient, onClick, className }, ref) => {
    const id = useId()
    const fontSizes = useMedicalFontSizes()
    const tabletOptimization = useMedicalTabletOptimization()
    
    const fullName = `${patient.firstName} ${patient.lastName}`
    const ariaLabel = `Patient ${fullName}, age ${patient.age}, ${patient.cancerType} stage ${patient.stage}, status ${patient.status}, treatment ${patient.treatmentProgress}% complete`
    
    const statusColors = {
      active: 'text-blue-400',
      critical: 'text-red-400',
      remission: 'text-green-400',
      inactive: 'text-gray-400'
    }

    return (
      <div
        ref={ref}
        id={id}
        className={cn(
          'card-glow p-6 cursor-pointer transition-all duration-200 hover:glow-border',
          tabletOptimization.shouldUseLargerTouchTargets && 'min-h-[120px]',
          className
        )}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
          }
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className={cn('font-semibold text-white', fontSizes.patientName)}>
              {fullName}
            </h3>
            <p className={cn('text-gray-300', fontSizes.bodyText)}>
              ID: {patient.id} • Age: {patient.age}
            </p>
          </div>
          <span 
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium border',
              statusColors[patient.status as keyof typeof statusColors],
              `border-current`
            )}
            aria-label={`Status: ${patient.status}`}
          >
            {patient.status}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={cn('text-gray-400', fontSizes.caption)}>Cancer Type</span>
            <span className={cn('text-white', fontSizes.bodyText)}>{patient.cancerType}</span>
          </div>
          <div className="flex justify-between">
            <span className={cn('text-gray-400', fontSizes.caption)}>Stage</span>
            <span className={cn('text-white', fontSizes.bodyText)}>{patient.stage}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={cn('text-gray-400', fontSizes.caption)}>Treatment Progress</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${patient.treatmentProgress}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className={cn('text-white', fontSizes.bodyText)}>
                {patient.treatmentProgress}%
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

AccessiblePatientCard.displayName = 'AccessiblePatientCard'

// Accessible Medical Alert
interface AccessibleMedicalAlertProps {
  severity: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  onDismiss?: () => void
  className?: string
}

export const AccessibleMedicalAlert = forwardRef<HTMLDivElement, AccessibleMedicalAlertProps>(
  ({ severity, title, message, onDismiss, className }, ref) => {
    const id = useId()
    const fontSizes = useMedicalFontSizes()
    
    useEffect(() => {
      // Announce critical alerts to screen readers
      if (severity === 'error') {
        screenReader.announceCriticalAlert(`${title}: ${message}`)
      }
    }, [severity, title, message])

    const severityConfig = {
      info: {
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-400',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
      },
      warning: {
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        textColor: 'text-yellow-400',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      },
      error: {
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-400',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      },
      success: {
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-400',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      }
    }

    const config = severityConfig[severity]

    return (
      <div
        ref={ref}
        id={id}
        className={cn(
          'p-4 rounded-lg border',
          config.bgColor,
          config.borderColor,
          className
        )}
        role="alert"
        aria-live={severity === 'error' ? 'assertive' : 'polite'}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-message`}
      >
        <div className="flex items-start">
          <div className={cn('flex-shrink-0', config.textColor)}>
            {config.icon}
          </div>
          <div className="ml-3 flex-1">
            <h3 
              id={`${id}-title`}
              className={cn('font-medium', config.textColor, fontSizes.bodyText)}
            >
              {title}
            </h3>
            <p 
              id={`${id}-message`}
              className={cn('mt-1 text-gray-300', fontSizes.caption)}
            >
              {message}
            </p>
          </div>
          {onDismiss && (
            <button
              className={cn(
                'ml-3 flex-shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                config.textColor,
                'hover:bg-white/10 focus:ring-white/20'
              )}
              onClick={onDismiss}
              aria-label="Dismiss alert"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    )
  }
)

AccessibleMedicalAlert.displayName = 'AccessibleMedicalAlert'
