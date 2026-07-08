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
  const folderCollapseStatus = (folder) => {
    const foldersLocalStorage = JSON.parse(localStorage.getItem("folders"));

    if (!foldersLocalStorage) return;

    const folderID = folder.dataset.folderid;

    const status = foldersLocalStorage[folderID]?.collapse;

    if (status) {
      folder.classList.add("preLoad", "collapse");

      const folderCollapseBtn = folder.querySelector(" .folderCollapseBtn");
      const img = folderCollapseBtn.querySelector("img");

      img.classList.add("preLoad");
    }
  };

  folderCollapseStatus(folder);

  const handleFolderClick = (event, folder) => {
    const element = event.target;
    const elementClassList = element.classList;

    const elementClosestBtn = event.target.closest("button");
    const elementClosestBtnClassList = elementClosestBtn?.classList;

    if (
      elementClassList.contains("folderHeader") ||
      elementClosestBtnClassList.contains("folderCollapseBtn")
    ) {
      handleFolderCollapseClick(event, folder);
    } else if (elementClosestBtnClassList.contains("folderOptionsBtn")) {
      handleFolderOptionsClick(event, folder);
    } else if (elementClosestBtnClassList.contains("folderActBtn")) {
      handleFolderActClick(event, folder);
    }
  };

  const handleFolderCollapseClick = (event, folder) => {
    if (folder.classList.contains("preLoad")) {
      folder.classList.remove("preLoad");

      const folderCollapseBtn = folder.querySelector(" .folderCollapseBtn");

      const img = folderCollapseBtn.querySelector("img");
      img.classList.remove("preLoad");
    }

    const folderID = folder.dataset.folderid;

    let collapse = false;

    if (folder.classList.contains("collapse")) {
      folder.classList.remove("collapse");
      collapse = false;
    } else {
      folder.classList.add("collapse");
      collapse = true;
    }

    const existingFolders = JSON.parse(localStorage.getItem("folders")) || {};

    localStorage.setItem(
      "folders",
      JSON.stringify({
        ...existingFolders,
        [folderID]: { ...existingFolders[folderID], collapse },
      }),
    );
  };

  const handleFolderOptionsClick = (event, folder) => {
    const folderOptionsDiv = folder.querySelector(".folderOptions");

    if (folderOptionsDiv.classList.contains("expand")) {
      folderOptionsDiv.classList.replace("expand", "shrink");
    } else if (folderOptionsDiv.classList.contains("shrink")) {
      folderOptionsDiv.classList.replace("shrink", "expand");
    } else {
      folderOptionsDiv.classList.add("expand");
    }
  };

  const handleFolderActClick = (event, folder) => {
    const button = event.target.closest("button");

    if (!button) return;

    const folderID = folder.dataset.folderid;

    if (button.classList.contains("folderEditBtn")) {
      return null;
    } else if (button.classList.contains("folderShareBtn")) {
      return null;
    } else if (button.classList.contains("folderDeleteBtn")) {
      const deleteModal = document.getElementById("deleteFolderPopover");

      const deleteForm = deleteModal.querySelector("form");

      deleteForm.action = `/folder/delete/${folderID}`;

      deleteModal.showModal();
    }
  };

  folder.addEventListener("click", (event) => {
    handleFolderClick(event, folder);
  });
});
