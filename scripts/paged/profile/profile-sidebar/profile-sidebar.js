export function renderProfileSidebar(user) {
  renderUserCard(user);
}

function renderUserCard(user) {
  const userCard = document.querySelector(".user-card");
  if (user && userCard) {
    const userFirstLetterName = user.firstName.charAt(0);
    const userLastLetterName = user.lastName.charAt(0);
    userCard.innerHTML = `
    <div class="user-avatar-wrapper">
      <div class="user-avatar">
        <span class="avatar-initials">${userFirstLetterName}${userLastLetterName}</span>
        <span class="avatar-badge verified" aria-label="Verified user">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      </div>
    </div>
    <div class="user-info">
      <h3 class="user-name">${user.firstName} ${user.lastName}</h3>
      <p class="user-email">${user.email}</p>
    </div>
  `;
  } else {
    console.error(
      "error occurred while rendering userCard, user data wan not provided for renderUserCard or .user-card element is not defined/found",
    );
  }
}
