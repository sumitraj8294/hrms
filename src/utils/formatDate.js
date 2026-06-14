import dayjs from 'dayjs'
export const formatDate     = (d, fmt='DD MMM YYYY') => dayjs(d).format(fmt)
export const formatDateTime = (d) => dayjs(d).format('DD MMM YYYY, h:mm A')
export const fromNow        = (d) => dayjs(d).fromNow()
