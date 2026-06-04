const ErrorHandler = require('../utils/ErrorHandler')

const problemCodes = {
  corruption: 'COR',
  health: 'HLT',
  waste: 'WST',
  roads: 'RDT',
  justice: 'JST',
  land: 'LND',
  other: 'OTH',
}

const generateTicketNumber = (problemType) => {
  if (!problemType) {
    throw new ErrorHandler(
      'Ticket generation failed. Missing required field: problemType.',
      400,
    )
  }

  if (typeof problemType !== 'string') {
    throw new ErrorHandler(
      `Ticket generation failed. problemType must be a string. Received ${typeof problemType}.`,
      400,
    )
  }

  const normalizedProblemType = problemType.trim().toLowerCase()

  if (
    !Object.prototype.hasOwnProperty.call(problemCodes, normalizedProblemType)
  ) {
    throw new ErrorHandler(
      `Ticket generation failed. Invalid problemType "${problemType}". Allowed values: ${Object.keys(
        problemCodes,
      ).join(', ')}.`,
      400,
    )
  }

  try {
    const problemCode = problemCodes[normalizedProblemType]

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')

    const random = Math.floor(10000 + Math.random() * 90000)

    return `${problemCode}-${date}-${random}`
  } catch (error) {
    throw new ErrorHandler(
      `Unexpected error while generating ticket number: ${error.message}`,
      500,
    )
  }
}

module.exports = generateTicketNumber
