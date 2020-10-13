const feesConfig = {
  median: 1,
  highest: 2,
  free: 0,
  slowest: 5000,
  slow: 30000,
  normal: 50000,
  fast: 100000,
  fastest: 1000000,
}
window.feesConfig = feesConfig
console.log('feeConfig loaded!', feesConfig)
