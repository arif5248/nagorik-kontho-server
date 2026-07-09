module.exports = (
  complaint,
  {
    title,
    message,
    status,
    eventType = 'progress',
    updatedBy = null,
    updatedByName = '',
    updatedByType = '',
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
