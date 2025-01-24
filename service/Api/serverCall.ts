/* eslint-disable no-extend-native */
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, CancelTokenSource } from 'axios'
import { authHeader } from './authHeader'

export const BASE_URL: string | undefined = 'https://legaldocs.unibyts.com/api/'

// const version: string | undefined = process.env.NEXT_PUBLIC_VERSION

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    try {
      if (error.response?.status === 401) {
        // localStorage.clear()
        // toast.error('Session expired. Please login again.')
        // Cookies.remove('accessToken')
        // window.location.href = process.env.NEXT_PUBLIC_COMPLIANCE_FRONTEND_URL ?? ''
      }
    } catch (error) {
      console.error(error)
    }

    return Promise.reject(error)
  }
)

export const SC = {
  getCall,
  postCall,
  putCall,
  deleteCall,
  postCallWithoutAuth,
  getCallWithId,
  postAttachment,
  postCallTicketing
}

const errorHandler = (err: any): string => {
  const customError = err?.response?.data?.errors
  const serverError = err?.response?.data?.errors?.message
  return customError || serverError || 'Oops! Something went wrong.'
}

const handleVersionErrors = (error: any): void => {
  const err = errorHandler(error)
  if (err === 'Version Not Matched.') {
    window.location.reload()
  }
}

interface RequestOptions {
  url: string
  customUrl?: string
  data?: any
  page?: number
  params?: Record<string, any>
  customToken?: string
  responseType?: string
  callbackProgressUpload?: (progressEvent: any) => void
  source?: CancelTokenSource
  id?: string
}

// GET request
function getCall({ url, customUrl, params, customToken }: RequestOptions): Promise<AxiosResponse> {
  const requestOptions: AxiosRequestConfig = {
    method: 'GET',
    headers: authHeader(customToken),
    params: {
      ...params

      // version,
    }
  }
  return axios
    .get(customUrl || `${BASE_URL}${url}`, requestOptions)
    .then(response => response)
    .catch(error => {
      handleVersionErrors(error)
      return Promise.reject(error)
    })
}

// POST request
function postCall({ url, customUrl, data, callbackProgressUpload, source }: RequestOptions): Promise<AxiosResponse> {
  const requestOptions: AxiosRequestConfig = {
    method: 'POST',
    headers: authHeader(),
    onUploadProgress: progressEvent => {
      if (callbackProgressUpload) callbackProgressUpload(progressEvent)
    },
    cancelToken: source?.token
  }

  return axios
    .post(customUrl || `${BASE_URL}${url}`, data, requestOptions)
    .then(response => response)
    .catch(error => {
      handleVersionErrors(error)
      return Promise.reject(error)
    })
}

// POST request with ticketing
function postCallTicketing({
  url,
  customUrl,
  data,
  callbackProgressUpload,
  source
}: RequestOptions): Promise<AxiosResponse> {
  const requestOptions: AxiosRequestConfig = {
    method: 'POST',
    headers: authHeader(),
    onUploadProgress: progressEvent => {
      if (callbackProgressUpload) callbackProgressUpload(progressEvent)
    },
    cancelToken: source?.token
  }

  return axios
    .post(`${customUrl || `${BASE_URL}${url}`}${customUrl ? '?forData=true' : ''}`, data, requestOptions)
    .then(response => response)
    .catch(error => {
      handleVersionErrors(error)
      return Promise.reject(error)
    })
}

// POST attachment
function postAttachment({ url, data, callbackProgressUpload, source }: RequestOptions): Promise<AxiosResponse> {
  const requestOptions: AxiosRequestConfig = {
    method: 'POST',
    headers: authHeader(),
    onUploadProgress: progressEvent => {
      if (callbackProgressUpload) callbackProgressUpload(progressEvent)
    },
    cancelToken: source?.token
  }

  return axios
    .post(url, data, requestOptions)
    .then(response => response)
    .catch(error => {
      handleVersionErrors(error)
      return Promise.reject(error)
    })
}

// PUT request
function putCall({ url, customUrl, data }: RequestOptions): Promise<AxiosResponse> {
  const requestOptions: AxiosRequestConfig = {
    method: 'PUT',
    headers: authHeader()
  }

  return axios
    .put(customUrl || `${BASE_URL}${url}`, data, requestOptions)
    .then(response => response)
    .catch(error => {
      handleVersionErrors(error)
      return Promise.reject(error)
    })
}

// DELETE request
function deleteCall({ url, customUrl }: RequestOptions): Promise<AxiosResponse> {
  const requestOptions: AxiosRequestConfig = {
    method: 'DELETE',
    headers: authHeader()
  }

  return axios
    .delete(customUrl || `${BASE_URL}${url}`, requestOptions)
    .then(response => response)
    .catch(error => Promise.reject(error))
}

// POST request without authentication
function postCallWithoutAuth({ url, customUrl, data }: RequestOptions): Promise<AxiosResponse> {
  const requestOptions: AxiosRequestConfig = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }

  return axios
    .post(customUrl || `${BASE_URL}${url}`, data, requestOptions)
    .then(response => response)
    .catch(error => {
      handleVersionErrors(error)
      return Promise.reject(error)
    })
}

// GET request with ID
function getCallWithId({ url, customUrl, id }: RequestOptions): Promise<AxiosResponse> {
  const requestOptions: AxiosRequestConfig = {
    method: 'GET',
    headers: authHeader()
  }

  return axios
    .get(customUrl ? `${customUrl}${url}/${id}` : `${BASE_URL}${url}/${id}`, requestOptions)
    .then(response => response)
    .catch(error => {
      handleVersionErrors(error)
      return Promise.reject(error)
    })
}
