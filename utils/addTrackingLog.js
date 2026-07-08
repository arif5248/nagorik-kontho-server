module.exports = (
  complaint,
  {
    title,
    message,
    status,
    eventType = 'progress',
    updatedBy = null,
    updatedByType = 'system',
  },
) => {
  complaint.tracking.push({
    title,
    message,
    status,
    eventType,
    updatedBy,
    updatedByType,
    date: new Date(),
  })
}
