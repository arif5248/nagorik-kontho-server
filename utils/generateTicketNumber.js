const problemCodes = {
  corruption: 'COR',
  health: 'HLT',
  waste: 'WST',
  road_transport: 'RDT',
  land: 'LND',
  other: 'OTH',
}

const generateTicketNumber = (problemType) => {
  const problemCode = problemCodes[problemType] || 'GEN'

  // Date format: YYYYMMDD
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')

  // 5 digit random number
  const random = Math.floor(10000 + Math.random() * 90000)

  return `${problemCode}-${date}-${random}`
}

module.exports = generateTicketNumber
