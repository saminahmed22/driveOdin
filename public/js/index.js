// Event listeners for the popovers
const uploadDialog = document.getElementById("uploadDialog");
const downloadDialog = document.getElementById("downloadDialog");
const downloadPagePopover = document.getElementById("downloadPagePopover");

uploadDialog.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const uploadSelectBtn = document.querySelector(".uploadSelectBtn");
  const uploadBtnInstruction = document.querySelector(".uploadBtnInstruction");

  if (button.classList.contains("closeBtn")) {
    // Reset upload form and styles
    uploadDialog.querySelector("form").reset();

    uploadSelectBtn.style.backgroundImage = "";
    uploadBtnInstruction.style.backgroundColor = "rgba(0, 0, 0, 0)";
    uploadBtnInstruction.style.color = "black";
    uploadBtnInstruction.style.textShadow = "none";
    uploadBtnInstruction.querySelector("img").style.filter = "invert(0)";
  }
});

downloadDialog.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.classList.contains("closeBtn")) {
    uploadPopover.querySelector("form").reset();
  }
});

// Event listener for the password input container
const passwordInputContainer = document.querySelectorAll(".passwordInputField");

if (passwordInputContainer) {
  passwordInputContainer.forEach((container) => {
    container.addEventListener("click", (event) => {
      const button = event.target.closest("button");

      if (!button) return;

      const buttonImg = button.querySelector("img");
      const inputField = container.querySelector("input");

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
  });
}

// upload button click
const uploadSelectBtn = document.querySelector(".uploadSelectBtn");
const imagePicker = document.getElementById("imagePicker");
const uploadBtnInstruction = document.querySelector(".uploadBtnInstruction");

if (uploadSelectBtn) {
  uploadSelectBtn.addEventListener("click", (event) => {
    imagePicker.click();
  });

  imagePicker.addEventListener("change", (event) => {
    const selectedImage = event.target.files[0];
    console.log(selectedImage);

    const reader = new FileReader();

    reader.onload = () => {
      uploadSelectBtn.style.backgroundImage = `url(${reader.result})`;
      uploadBtnInstruction.style.backgroundColor = "rgba(0, 0, 0, .3)";
      uploadBtnInstruction.style.color = "white";
      uploadBtnInstruction.style.textShadow = "1px 1px black";
      uploadBtnInstruction.querySelector("img").style.filter = "invert(1)";
    };

    reader.readAsDataURL(selectedImage);

    // Injects file name input field
    const postName = document.getElementById("postName");

    if (postName) {
      postName.value = selectedImage.name;
    }
  });
}

// Disables transitions and animations at loading
window.addEventListener("load", () => {
  const elements = document.querySelectorAll(".preload");

  elements.forEach((element) => {
    element.classList.remove("preload");
  });
});

// Listener for the HTML invoker commands
document.addEventListener(
  "command",
  (event) => {
    if (event.command === "close") {
      window.history.pushState({}, document.title, "/");
    } else if (event.command === "--copy") {
      const text = event.target.textContent;

      navigator.clipboard.writeText(text);
    }
  },
  { capture: true },
);

// Post cards event listeners
const postCards = document.querySelectorAll(".postCard");

postCards.forEach((postCard) => {
  postCard.addEventListener("click", (event) => {
    const postID = postCard.dataset.postid;

    window.location.href = `/post/${postID}`;
  });
});
