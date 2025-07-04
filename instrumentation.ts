export function register() {
  // Register your monitoring tools here
  console.log('Monitoring initialized')
}

export const onRequestError = async (
  err: Error,
  request: Request,
  context: { pathname: string }
) => {
  // Track server errors
  console.error('Server error:', {
    message: err.message,
    path: context.pathname,
    stack: err.stack,
  })
}