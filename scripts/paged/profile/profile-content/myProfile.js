import { API_KEY } from "../../../data/secrets.js";
import { renderProfilePage } from "../profile.js";
const profileForm = document.querySelector(".profile-form");

const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("profile-email");
const pictureUrlInput = document.getElementById("picture-url");
const birthDateInput = document.getElementById("date-of-birth");
const phoneNumberInput = document.getElementById("phone-number");
const addressInput = document.getElementById("street-address");
const picturePlaceholder = document.querySelector(".picture-placeholder");
const discardButton = document.querySelector(".btn-discard");

let initialInputValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  pictureUrl: "",
  dateOfBirth: ""
};

function hasChanges() {
  return (
    firstNameInput.value !== initialInputValues.firstName ||
    lastNameInput.value !== initialInputValues.lastName ||
    emailInput.value !== initialInputValues.email ||
    phoneNumberInput.value !== initialInputValues.phoneNumber ||
    addressInput.value !== initialInputValues.address ||
    pictureUrlInput.value !== initialInputValues.pictureUrl ||
    birthDateInput.value !== initialInputValues.dateOfBirth
  );
}

function updateDiscardButtonState() {
  if (discardButton) {
    discardButton.disabled = !hasChanges();
  }
}

export function renderMyProfile(user) {
  if (user) {
    firstNameInput.value = user.firstName || "";
    lastNameInput.value = user.lastName || "";
    emailInput.value = user.email || "";
    pictureUrlInput.value = user.details?.pictureUrl || "";
    birthDateInput.value = user.details?.dob
      ? user.details.dob.split("T")[0]
      : "";
    phoneNumberInput.value = user.details?.phoneNumber || "";
    addressInput.value = user.details?.address || "";
    picturePlaceholder.src = user.details?.pictureUrl || "";
    picturePlaceholder.alt =
      (user.firstName?.charAt(0) || "") + (user.lastName?.charAt(0) || "");

    initialInputValues = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      phoneNumber: phoneNumberInput.value,
      address: addressInput.value,
      pictureUrl: pictureUrlInput.value,
      dateOfBirth: birthDateInput.value
    };

    updateDiscardButtonState();
  }
}

if (discardButton) {
  discardButton.addEventListener("click", () => {
    firstNameInput.value = initialInputValues.firstName;
    lastNameInput.value = initialInputValues.lastName;
    emailInput.value = initialInputValues.email;
    phoneNumberInput.value = initialInputValues.phoneNumber;
    addressInput.value = initialInputValues.address;
    pictureUrlInput.value = initialInputValues.pictureUrl;
    birthDateInput.value = initialInputValues.dateOfBirth;

    picturePlaceholder.src = initialInputValues.pictureUrl || "";

    updateDiscardButtonState();
  });
}

profileForm.addEventListener("input", updateDiscardButtonState);
profileForm.addEventListener("change", updateDiscardButtonState);

function createUpdatedUserData() {
  const collectedUserData = {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value,
    phoneNumber: phoneNumberInput.value,
    address: addressInput.value,
    pictureUrl: pictureUrlInput.value,
    dateOfBirth: birthDateInput.value
  };
  const updatedUserData = {};
  for (const [key, value] of Object.entries(collectedUserData)) {
    if (
      value === "" ||
      value === undefined ||
      value === false ||
      value === null
    ) {
      continue;
    } else {
      updatedUserData[key] = value;
    }
  }
  return updatedUserData;
}

profileForm.addEventListener("submit", async event => {
  event.preventDefault();
  const accessToken = localStorage.getItem("accessToken");
  const updatedUserData = createUpdatedUserData();
  const response = await fetch("https://shopapi.stepacademy.ge/api/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(updatedUserData)
  });
  if (response.status !== 200) {
    console.error(
      "unexpected error occurred while modifying profile, please try again later..."
    );
    return;
  } else {
    renderProfilePage();
  }
});
