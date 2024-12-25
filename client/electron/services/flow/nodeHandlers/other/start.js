async function handleStart(driver, data) {
  try {
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = handleStart;