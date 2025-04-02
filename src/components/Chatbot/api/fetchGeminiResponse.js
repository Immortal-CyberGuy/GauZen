
export const fetchGeminiResponse = async (chatHistory) => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;



  if (!API_KEY) {
    console.error("❌ Error: API key is missing.");
    return "❌ Error: API key is missing.";
  }

  const requestBody = {
    contents: chatHistory.map((chat) => ({
      role: chat.role === "user" ? "user" : "model",
      parts: [{ text: chat.text }],
    })),
  };

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Error:", errorData);
      return `❌ API Error: ${errorData.error.message}`;
    }

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No valid response received.";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "❌ Error: Unable to connect to Gemini API.";
  }
};
