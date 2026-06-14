import { useState } from 'react'
export default function usePagination(total, perPage = 10) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(total / perPage)
  return { page, setPage, totalPages, perPage }
}
