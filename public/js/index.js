// Event listeners for the navbar
const nav = document.querySelector("nav");

nav.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (button.classList.contains("uploadBtn")) {
    uploadPopover.showModal();
  }

  if (button.classList.contains("downloadBtn")) {
    downloadPopover.showModal();
  }
});

// Event listeners for the popovers
const uploadPopover = document.getElementById("uploadPopover");
const downloadPopover = document.getElementById("downloadPopover");
const downloadPagePopover = document.getElementById("downloadPagePopover");

uploadPopover.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const uploadSelectBtn = document.querySelector(".uploadSelectBtn");
  const uploadBtnInstruction = document.querySelector(".uploadBtnInstruction");

  if (button.classList.contains("closeBtn")) {
    closeModal(uploadPopover);

    // Reset upload form and styles
    uploadPopover.querySelector("form").reset();

    uploadSelectBtn.style.backgroundImage = "";
    uploadBtnInstruction.style.backgroundColor = "rgba(0, 0, 0, 0)";
    uploadBtnInstruction.style.color = "black";
    uploadBtnInstruction.style.textShadow = "none";
    uploadBtnInstruction.querySelector("img").style.filter = "invert(0)";
  }
});

downloadPopover.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.classList.contains("closeBtn")) {
    closeModal(downloadPopover);

    uploadPopover.querySelector("form").reset();

    window.history.pushState({}, document.title, "/");
  }
});

downloadPagePopover.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.classList.contains("closeBtn")) {
    closeModal(downloadPagePopover);

    // Source - https://stackoverflow.com/a/22753103
    // Posted by Mohammed Joraid, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-07-09, License - CC BY-SA 4.0

    window.history.pushState({}, document.title, "/");
  }
});

function closeModal(modal) {
  modal.classList.add("slideOut");

  modal.addEventListener(
    "animationend",
    (event) => {
      modal.classList.remove("slideOut");

      modal.close();
    },
    { once: true },
  );
}

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
  });
}

// Copy button
const shareContainer = document.querySelector(".shareContainer");

if (shareContainer) {
  shareContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.classList.contains("shareCodeCopyBtn")) {
      const code = document.querySelector(".shareCode").textContent;

      navigator.clipboard.writeText(code);
    } else if (button.classList.contains("shareUrlCopyBtn")) {
      const url = document.querySelector(".shareUrl").textContent;

      navigator.clipboard.writeText(url);
    }
  });
}
