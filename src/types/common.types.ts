export interface ApiSuccess<T> {
  success: true
  data: T
  message: string
}

export interface ApiError {
  success: false
  error: string
  message: string
  timestamp: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginatedData<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface PaginatedResponse<T> {
  success: true
  data: PaginatedData<T>
  message: string
}

export type SortOrder = 'asc' | 'desc'

export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
  order?: SortOrder
}