// Event listeners for the popovers
const uploadDialog = document.getElementById("uploadDialog");
const downloadDialog = document.getElementById("downloadDialog");
const downloadPagePopover = document.getElementById("downloadPagePopover");

if (uploadDialog) {
  uploadDialog.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const uploadSelectBtn = document.querySelector(".uploadSelectBtn");
    const uploadBtnInstruction = document.querySelector(
      ".uploadBtnInstruction",
    );

    if (button.classList.contains("closeBtn")) {
      uploadSelectBtn.style.backgroundImage = "";
      uploadBtnInstruction.style.backgroundColor = "rgba(0, 0, 0, 0)";
      uploadBtnInstruction.style.color = "black";
      uploadBtnInstruction.style.textShadow = "none";
      uploadBtnInstruction.querySelector("img").style.filter = "invert(0)";

      const file_name = document.getElementById("file_name");

      if (file_name) {
        file_name.disabled = true;
      }
    }
  });
}

const downloadReqForm = downloadDialog.querySelector("form");

if (downloadReqForm) {
  downloadReqForm.addEventListener("submit", (event) => {
    const checkedType = downloadDialog.querySelector(
      'input[name="downloadType"]:checked',
    ).value;

    downloadReqForm.action = `/${checkedType}/download`;
  });
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

    const reader = new FileReader();

    reader.onload = () => {
      uploadSelectBtn.style.backgroundImage = `url(${reader.result})`;
      uploadBtnInstruction.style.backgroundColor = "rgba(0, 0, 0, .3)";
      uploadBtnInstruction.style.color = "white";
      uploadBtnInstruction.style.textShadow = "1px 1px black";
      uploadBtnInstruction.querySelector("img").style.filter = "invert(1)";
    };

    reader.readAsDataURL(selectedImage);

    // Injects file name in the input field
    const file_name = document.getElementById("file_name");
    const fileNameExtension = document.querySelector(".fileNameExtension");

    if (file_name) {
      const fileName = selectedImage.name;

      const indexOfFileExt = fileName.lastIndexOf(".");

      const fileNameWithoutExt = fileName.substring(0, indexOfFileExt);
      const fileExt = fileName.substring(indexOfFileExt);

      file_name.disabled = false;
      file_name.value = fileNameWithoutExt;

      fileNameExtension.textContent = fileExt;
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

      const dialog = event.target.closest("dialog");

      const form = dialog.querySelector("form");
      if (form) {
        form.reset();
      }

      const textInputFields = dialog.querySelectorAll("input[type=text]");
      if (textInputFields.length) {
        textInputFields.forEach((field) => {
          field.textContent = "";
        });
      }

      const errorFields = document.querySelectorAll(".fieldErrorMessage");
      if (errorFields.length) {
        errorFields.forEach((errorField) => {
          errorField.remove();
        });
      }
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

// Converts ISO dates into readable local date
function formatReadableDate(rawDate) {
  if (rawDate.length <= 0) return;

  const date = new Date(rawDate);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  return formatter.format(date).replace(/am|pm/, (m) => m.toUpperCase());
}

const dates = document.querySelectorAll(".date");

if (dates.length >= 1) {
  for (const date of dates) {
    const rawDate = date.dataset.raw;

    date.textContent = formatReadableDate(rawDate);
  }
}
