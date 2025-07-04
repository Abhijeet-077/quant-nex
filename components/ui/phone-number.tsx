import React from 'react'

interface PhoneNumberProps {
  number: string
  className?: string
  showCountryCode?: boolean
}

export function PhoneNumber({ number, className = "", showCountryCode = true }: PhoneNumberProps) {
  // Format Indian phone numbers consistently
  const formatIndianPhoneNumber = (phone: string) => {
    // Remove any existing formatting
    const cleaned = phone.replace(/\D/g, '')
    
    // Handle different input formats
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      // Already has country code
      const countryCode = cleaned.slice(0, 2)
      const number = cleaned.slice(2)
      return showCountryCode 
        ? `+${countryCode} ${number.slice(0, 5)} ${number.slice(5)}`
        : `${number.slice(0, 5)} ${number.slice(5)}`
    } else if (cleaned.length === 10) {
      // Indian mobile number without country code
      return showCountryCode 
        ? `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
        : `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
    }
    
    // Return as-is if format is not recognized
    return number
  }

  const formattedNumber = formatIndianPhoneNumber(number)

  return (
    <span className={`font-mono ${className}`}>
      {formattedNumber}
    </span>
  )
}

// Utility function for validation
export function validateIndianPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  
  // Check for valid Indian mobile number patterns
  if (cleaned.length === 10) {
    // Indian mobile numbers start with 6, 7, 8, or 9
    return /^[6-9]\d{9}$/.test(cleaned)
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    // With country code
    const number = cleaned.slice(2)
    return /^[6-9]\d{9}$/.test(number)
  }
  
  return false
}

// Hook for phone number formatting
export function usePhoneNumberFormatter() {
  const formatForInput = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    
    if (cleaned.length <= 5) {
      return cleaned
    } else if (cleaned.length <= 10) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
    } else if (cleaned.length <= 12) {
      return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7, 12)}`
    }
    
    return value
  }

  const formatForDisplay = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`
    }
    
    return value
  }

  return { formatForInput, formatForDisplay }
}
