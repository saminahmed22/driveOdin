const passwordInputContainer = document.querySelector(".passwordInputField");

if (passwordInputContainer) {
  passwordInputContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    const buttonImg = button.querySelector("img");
    const inputField = passwordInputContainer.querySelector("input");

    if (button.classList.contains("passwordVisible")) {
      button.classList.replace("passwordVisible", "passwordInvisible");
      buttonImg.setAttribute("src", "/assets/icons/password_not_visible.svg");
      inputField.type = "password";
    } else if (button.classList.contains("passwordInvisible")) {
      button.classList.replace("passwordInvisible", "passwordVisible");
      buttonImg.setAttribute("src", "/assets/icons/password_visible.svg");
      inputField.type = "text";
    }
  });
}
