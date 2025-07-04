import { NextRequest, NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/database'
import { supabase } from '@/lib/supabase'

// GET /api/health - System health check
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    responseTime: 0,
    services: {
      database: 'checking...',
      supabase: 'checking...',
      redis: 'not configured',
      storage: 'checking...',
    },
    checks: {
      database_connection: false,
      supabase_connection: false,
      environment_variables: false,
    }
  }

  try {
    // Check database connection
    try {
      const dbHealth = await checkDatabaseHealth()
      health.services.database = dbHealth.status
      health.checks.database_connection = dbHealth.status === 'healthy'
    } catch (error) {
      health.services.database = 'unhealthy'
      health.checks.database_connection = false
      health.status = 'degraded'
    }

    // Check Supabase connection
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)
        .single()
      
      health.services.supabase = error ? 'unhealthy' : 'healthy'
      health.checks.supabase_connection = !error
      
      if (error) {
        health.status = 'degraded'
      }
    } catch (error) {
      health.services.supabase = 'unhealthy'
      health.checks.supabase_connection = false
      health.status = 'degraded'
    }

    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'DATABASE_URL'
    ]
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
    health.checks.environment_variables = missingEnvVars.length === 0
    
    if (missingEnvVars.length > 0) {
      health.status = 'degraded'
      health.services.storage = `Missing env vars: ${missingEnvVars.join(', ')}`
    } else {
      health.services.storage = 'configured'
    }

    // Check Redis (if configured)
    if (process.env.UPSTASH_REDIS_REST_URL) {
      health.services.redis = 'configured'
    }

    // Calculate response time
    health.responseTime = Date.now() - startTime

    // Determine overall status
    if (!health.checks.database_connection || !health.checks.supabase_connection) {
      health.status = 'unhealthy'
    }

    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503

    return NextResponse.json(health, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      responseTime: Date.now() - startTime,
      services: {
        database: 'unknown',
        supabase: 'unknown',
        redis: 'unknown',
        storage: 'unknown',
      }
    }, { status: 503 })
  }
}

// HEAD /api/health - Simple health check for load balancers
export async function HEAD(request: NextRequest) {
  try {
    // Quick database ping
    const dbHealth = await checkDatabaseHealth()
    
    if (dbHealth.status === 'healthy') {
      return new NextResponse(null, { status: 200 })
    } else {
      return new NextResponse(null, { status: 503 })
    }
  } catch (error) {
    return new NextResponse(null, { status: 503 })
  }
}
