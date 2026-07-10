const folders = document.querySelectorAll(".folder");

function handleFolderClick(event, folder) {
  const button = event.target.closest("button");

  if (button) {
    const buttonClassList = button.classList;

    if (buttonClassList.contains("folderOptionsBtn")) {
      expnadFolderOptions(folder);
    } else if (buttonClassList.contains("folderEditBtn")) {
      editFolder(folder);
    } else if (buttonClassList.contains("folderShareBtn")) {
      shareFolder(folder);
    } else if (buttonClassList.contains("folderDeleteBtn")) {
      deleteFolder(folder);
    } else if (buttonClassList.contains("folderCollapseBtn")) {
      handleFolderCollapseClick(event, folder);
    }
  } else {
    if (event.target.closest(".folderHeader")) {
      handleFolderCollapseClick(event, folder);
    }
  }
}

// Adding user action on folder/collapse status to the localStorage
function folderCollapseStatus(folder) {
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
}

// Folder expand/collapse
function handleFolderCollapseClick(event, folder) {
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
}

// Folder option expand/shrink
function expnadFolderOptions(folder) {
  const folderOptions = folder.querySelector(".folderOptions");

  if (folderOptions.classList.contains("expand")) {
    folderOptions.classList.replace("expand", "shrink");
  } else if (folderOptions.classList.contains("shrink")) {
    folderOptions.classList.replace("shrink", "expand");
  } else {
    folderOptions.classList.add("expand");
  }
}

// Folder CRUD operation
function editFolder(folder) {
  const folderID = folder.dataset.folderid;
}

function shareFolder(folder) {
  const folderID = folder.dataset.folderid;
}

function deleteFolder(folder) {
  const folderID = folder.dataset.folderid;

  const deleteModal = document.getElementById("deleteFolderPopover");

  const deleteForm = deleteModal.querySelector("form");

  deleteForm.action = `/folder/delete/${folderID}`;

  deleteModal.showModal();
}

// Click event listener for each folder
folders.forEach((folder) => {
  folderCollapseStatus(folder);

  folder.addEventListener("click", (event) => {
    handleFolderClick(event, folder);
  });
});
