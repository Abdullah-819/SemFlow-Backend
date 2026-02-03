export const requireFields = (fields, body) => {
  for (const field of fields) {
    if (!body[field]) {
      return field
    }
  }
  // final verdictttttttt
  return null
}
