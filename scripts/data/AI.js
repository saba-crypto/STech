export const steckAi = {
  async sendMessage(text, role) {
    this.addMessageToHistory(text, role);
    console.log({ message: text, history: this.getMessageHistory() });
  },

  getMessageHistory() {
    let messages = localStorage.getItem("AIMessages");
    if (!messages) {
      localStorage.setItem("AIMessages", JSON.stringify([]));
      return [];
    }

    return JSON.parse(localStorage.getItem("AIMessages"));
  },

  addMessageToHistory(text, role) {
    if (!role || !text) {
      console.error(
        "failed to add message to history, role or/and message text was not provided for this method"
      );
      return;
    }
    const currentMessagesHistory = this.getMessageHistory();
    currentMessagesHistory.push({ text, role, date: new Date() });
    localStorage.setItem("AIMessages", JSON.stringify(currentMessagesHistory));
  }
};
