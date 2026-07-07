const fileList = document.querySelector(".fileList");

const createFolderPopover = document.getElementById("createFolderPopover");

fileList.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.classList.contains("createFolderBtn")) {
    createFolderPopover.showModal();
  } else if (button.classList.contains("closeBtn")) {
    closeModal(createFolderPopover);
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

const fileDivs = document.querySelectorAll(".file");

fileDivs.forEach((fileDiv) => {
  fileDiv.addEventListener("click", (event) => {
    const element = event.target;

    if (element.closest("button")) {
      return;
    }
    const postId = fileDiv.querySelector(".fileShareCode")?.textContent;

    if (postId) {
      window.location.href = `/post/${postId}`;
    }
  });
});

// Folder collapse scripts
const folders = document.querySelectorAll(".folder");

folders.forEach((folder) => {
  folder.addEventListener("click", (event) => {
    const element = event.target;

    if (
      element.closest("button") &&
      !element.closest("button").classList.contains("folderCollapseBtn")
    ) {
      return;
    }

    if (!folder.classList.contains("collapse")) {
      folder.classList.add("collapse");
    } else {
      folder.classList.remove("collapse");
    }
  });
});
