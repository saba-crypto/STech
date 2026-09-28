import "../../shared/header.js";
import { fetchUser } from "../../data/user.js";
import { renderProfileSidebar } from "./profile-sidebar/profile-sidebar.js";
import { renderProfileContent } from "./profile-content/profile-content.js";

export async function renderProfilePage() {
  const response = await fetchUser();
  if (!response) {
    window.location.href = "./login.html";
    return;
  }
  const userInfo = response.data;
  renderProfileSidebar(userInfo);
  renderProfileContent(userInfo);
}

renderProfilePage();
