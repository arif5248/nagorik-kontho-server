module.exports = (
  complaint,
  {
    title,
    message,
    status,
    eventType = 'progress',
    updatedBy = null,
    updatedByName = null,
    updatedByType = 'system',
  },
) => {
  complaint.tracking.push({
    title,
    message,
    status,
    eventType,
    updatedBy,
    updatedByName,
    updatedByType,
    date: new Date(),
  })
}
