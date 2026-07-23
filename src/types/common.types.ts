export interface ApiSuccess<T> {
  success: true
  data: T
  message: string
}

export interface PaginatedData<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
