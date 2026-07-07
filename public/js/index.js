const nav = document.querySelector("nav");

const uploadPopover = document.getElementById("uploadPopover");
const downloadPopover = document.getElementById("downloadPopover");
const downloadPagePopover = document.getElementById("downloadPagePopover");

nav.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (button.classList.contains("uploadBtn")) {
    uploadPopover.showModal();
  }

  if (button.classList.contains("downloadBtn")) {
    downloadPopover.showModal();
  }
});

uploadPopover.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  const uploadSelectBtn = document.querySelector(".uploadSelectBtn");
  const uploadBtnInstruction = document.querySelector(".uploadBtnInstruction");

  if (!button) return;

  if (button.classList.contains("closeBtn")) {
    uploadPopover.close();

    window.location.href = `/`;

    if (uploadSelectBtn && uploadBtnInstruction) {
      uploadPopover.querySelector("form").reset();

      uploadSelectBtn.style.backgroundImage = "";
      uploadBtnInstruction.style.backgroundColor = "rgba(0, 0, 0, 0)";
      uploadBtnInstruction.style.color = "black";
      uploadBtnInstruction.style.textShadow = "none";
      uploadBtnInstruction.querySelector("img").style.filter = "invert(0)";
    }
  }
});

downloadPopover.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.classList.contains("closeBtn")) {
    downloadPopover.close();
    uploadPopover.querySelector("form").reset();

    window.location.href = "/";
  }
});

downloadPagePopover.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.classList.contains("closeBtn")) {
    downloadPopover.close();
    uploadPopover.querySelector("form").reset();

    window.location.href = "/";
  }
});

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

const shareCodeContainer = document.querySelector(".shareCodeContainer");

if (shareCodeContainer) {
  shareCodeContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.classList.contains("shareCodeCopyBtn")) {
      const code = document.querySelector(".shareCode").textContent;

      navigator.clipboard.writeText(code);
    }
  });
}
