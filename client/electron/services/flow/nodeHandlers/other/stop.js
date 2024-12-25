async function handleStop(driver, data) {
  try {
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = handleStop;