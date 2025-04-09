/**
 * Call your Cloudflare Worker API to enhance the prompt
 * @param {string} prompt - The user's original input
 * @returns {Promise<string>} - Enhanced structured prompt
 */

export const enhancePrompt = async (prompt) => {
  try {
    const response = await fetch("https://nuro.mandeep7yadav.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result || "No enhanced prompt received";
  } catch (error) {
    console.error("Error enhancing prompt via API:", error);
    throw error;
  }
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
};

export default {
  enhancePrompt,
  copyToClipboard,
};