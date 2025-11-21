export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('fa-IR').format(num)
}

export const toPersianDigits = (str) => {
  if (!str && str !== 0) return ''
  return str.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
}
