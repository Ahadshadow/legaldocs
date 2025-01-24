export function authHeader(customToken?: string): Record<string, string | boolean> | undefined {
  // Return authorization header with JWT token
  const token = customToken || localStorage.getItem('accessToken')
  if (token) {
    const allowedOrigins = '*'
    const allowHeaders = 'Referer,Accept,Origin,User-Agent,Content-Type,Authorization'

    return {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigins,
      'Access-Control-Allow-Methods': 'PUT,GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': allowHeaders,
      'WWW-Authenticate': 'Basic',
      'Access-Control-Allow-Credentials': true
    }
  }

  return undefined
}
