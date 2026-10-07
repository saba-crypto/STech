import { GEMINI_API_KEY } from "./secret.js";
import { apiRequest } from "./apiClient.js";

// You can edit or provide your custom instructions for Gemini here:
export const SYSTEM_INSTRUCTION =
  "You are STech Assistant, a helpful AI shopping assistant for the STech electronics store. Help users discover products, check stock, look up specifications, and browse categories. Always use the available tools to fetch accurate real-time data from the store catalog when answering questions about products or categories. when user ask questions beyond STeck, answer them that you only answer questions about STeck and everything related to STeck";

const MODEL_NAME = "gemini-3.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

// Tool declarations available to Gemini
const tools = [
  {
    functionDeclarations: [
      {
        name: "searchProducts",
        description:
          "Search products in the STech catalog by keyword, brand, or price range",
        parameters: {
          type: "OBJECT",
          properties: {
            keyword: {
              type: "STRING",
              description:
                "Search keyword or product name, e.g. laptop, monitor, keyboard"
            },
            minPrice: {
              type: "NUMBER",
              description: "Minimum product price in GEL"
            },
            maxPrice: {
              type: "NUMBER",
              description: "Maximum product price in GEL"
            }
          }
        }
      },
      {
        name: "getCategories",
        description: "List all product categories available in the STech store",
        parameters: {
          type: "OBJECT",
          properties: {}
        }
      },
      {
        name: "getProductDetails",
        description:
          "Get detailed information about a specific product by its ID",
        parameters: {
          type: "OBJECT",
          properties: {
            productId: {
              type: "NUMBER",
              description: "The unique ID of the product"
            }
          },
          required: ["productId"]
        }
      }
    ]
  }
];

// Handles executing backend API calls requested by Gemini
async function executeTool(name, args = {}) {
  try {
    if (name === "searchProducts") {
      const params = new URLSearchParams();
      if (args.keyword) params.append("Search", args.keyword);
      if (args.minPrice) params.append("MinPrice", args.minPrice);
      if (args.maxPrice) params.append("MaxPrice", args.maxPrice);
      params.append("Take", "6");

      const response = await apiRequest(
        `/products/filter?${params.toString()}`
      );
      const items = response?.data?.items || [];
      return items.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        inStock: product.stock > 0,
        category: product.category?.name
      }));
    }

    if (name === "getCategories") {
      const response = await apiRequest("/categories");
      const categories = response?.data || [];
      return categories.map(category => ({
        id: category.id,
        name: category.name,
        productCount: category.productCount
      }));
    }

    if (name === "getProductDetails") {
      const response = await apiRequest(`/products/${args.productId}`);
      const product = response?.data;
      if (!product) return { error: "Product not found" };

      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        stock: product.stock,
        description: product.description,
        category: product.category?.name
      };
    }

    return { error: `Unknown tool: ${name}` };
  } catch (err) {
    console.error(`Failed to execute tool ${name}:`, err);
    return { error: err.message || "Failed to execute backend request" };
  }
}

export const steckAi = {
  async sendMessage(text, role = "user") {
    this.addMessageToHistory(text, role);

    // Keep the most recent 12 messages for conversation context
    const recentHistory = this.getMessageHistory().slice(-12);
    const contents = recentHistory.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    const basePayload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      tools
    };

    try {
      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basePayload,
          contents
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error?.message || "Failed to communicate with Gemini"
        );
      }

      const candidate = data?.candidates?.[0]?.content?.parts?.[0];

      // If Gemini decided to call a backend tool:
      if (candidate?.functionCall) {
        const { name, args } = candidate.functionCall;
        const toolResult = await executeTool(name, args);

        // Append assistant's functionCall turn & user's functionResponse turn
        contents.push(data.candidates[0].content);
        contents.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name,
                response: { content: toolResult }
              }
            }
          ]
        });

        // Request final synthesized response from Gemini
        const followUpResponse = await fetch(GEMINI_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...basePayload,
            contents
          })
        });

        const followUpData = await followUpResponse.json();
        const finalText =
          followUpData?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I found the information for you, but couldn't format the response.";

        this.addMessageToHistory(finalText, "model");
        return finalText;
      }

      const botReply = candidate?.text || "I couldn't process that request.";
      this.addMessageToHistory(botReply, "model");
      return botReply;
    } catch (err) {
      console.error("Gemini Error:", err);
      const fallbackMessage =
        "Sorry, I am having trouble connecting to the assistant right now. Please try again in a moment.";
      this.addMessageToHistory(fallbackMessage, "model");
      return fallbackMessage;
    }
  },

  getMessageHistory() {
    const raw = localStorage.getItem("AIMessages");
    if (!raw) {
      localStorage.setItem("AIMessages", JSON.stringify([]));
      return [];
    }

    try {
      return JSON.parse(raw);
    } catch {
      localStorage.setItem("AIMessages", JSON.stringify([]));
      return [];
    }
  },

  addMessageToHistory(text, role) {
    if (!role || !text) {
      console.error(
        "Failed to add message to history: role or text was missing"
      );
      return;
    }

    const currentHistory = this.getMessageHistory();
    currentHistory.push({
      text,
      role,
      date: new Date(),
      id: crypto.randomUUID()
    });
    localStorage.setItem("AIMessages", JSON.stringify(currentHistory));
  },

  removeMessageFromHistory(id) {
    if (!id) {
      console.error("Couldn't remove message: ID was not provided");
      return;
    }

    const currentHistory = this.getMessageHistory();
    const filteredHistory = currentHistory.filter(message => message.id !== id);
    localStorage.setItem("AIMessages", JSON.stringify(filteredHistory));
  },

  clearMessageHistory() {
    localStorage.setItem("AIMessages", JSON.stringify([]));
  }
};
