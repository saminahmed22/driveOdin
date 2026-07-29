const folders = document.querySelectorAll(".folder");

function handleFolderClick(event, folder) {
  const folderID = folder.dataset.folderid;

  const button = event.target.closest("button");

  if (button) {
    const buttonClassList = button.classList;

    if (buttonClassList.contains("folderOptionsBtn")) {
      expnadFolderOptions(folder);
    } else if (buttonClassList.contains("folderEditBtn")) {
      editFolder(folderID);
    } else if (buttonClassList.contains("folderShareBtn")) {
      shareFolder(folderID);
    } else if (buttonClassList.contains("folderDeleteBtn")) {
      deleteFolder(folderID);
    } else if (buttonClassList.contains("folderCollapseBtn")) {
      handleFolderCollapseClick(event, folder, folderID);
    }
  } else {
    if (event.target.closest(".folderHeader")) {
      handleFolderCollapseClick(event, folder, folderID);
    }
  }
}

// Adding user action on folder/collapse status to the localStorage
function folderCollapseStatus(folder) {
  const folderID = folder.dataset.folderid;

  const foldersLocalStorage = JSON.parse(localStorage.getItem("folders"));

  if (!foldersLocalStorage) return;

  const status = foldersLocalStorage[folderID]?.collapse;

  const folderCollapseBtn = folder.querySelector(".folderCollapseBtn");

  if (status) {
    folder.classList.add("collapse");

    folderCollapseBtn.title = "Expand folder";
  } else {
    folderCollapseBtn.title = "Collapse folder";
  }

  const folderOptionStatus = foldersLocalStorage[folderID]?.folderOptionsExpand;

  const folderOptionsBtn = folder.querySelector(".folderOptionsBtn");

  if (folderOptionStatus) {
    folder.querySelector(".folderOptions").classList.add("expand");

    folderOptionsBtn.title = "Shrink folder options";
  } else {
    folderOptionsBtn.title = "Expand folder options";
  }
}

// Folder expand/collapse
function handleFolderCollapseClick(event, folder, folderID) {
  let collapse = !folder.classList.contains("collapse");

  collapse
    ? folder.classList.add("collapse")
    : folder.classList.remove("collapse");

  const folderCollapseBtn = folder.querySelector(".folderCollapseBtn");

  folderCollapseBtn.title = collapse ? "Expand folder" : "Collapse folder";

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
  const folderID = folder.dataset.folderid;

  let status;

  if (folderOptions.classList.contains("expand")) {
    folderOptions.classList.replace("expand", "shrink");
    status = false;
  } else if (folderOptions.classList.contains("shrink")) {
    folderOptions.classList.replace("shrink", "expand");
    status = true;
  } else {
    folderOptions.classList.add("expand");
    status = true;
  }

  const folderOptionsBtn = folder.querySelector(".folderOptionsBtn");

  folderOptionsBtn.title = status
    ? "Shrink folder options"
    : "Expand folder options";

  const existingFolders = JSON.parse(localStorage.getItem("folders")) || {};

  localStorage.setItem(
    "folders",
    JSON.stringify({
      ...existingFolders,
      [folderID]: {
        ...existingFolders[folderID],
        folderOptionsExpand: status,
      },
    }),
  );
}

// Folder CRUD operation
function editFolder(folderID) {
  window.location.href = `/folder/edit/${folderID}`;
}

function shareFolder(folderID) {
  window.location.href = `/folder/${folderID}`;
}

function deleteFolder(folderID) {
  window.location.href = `/folder/delete/${folderID}`;
}

// Click event listener for each folder
folders.forEach((folder) => {
  folderCollapseStatus(folder);

  folder.addEventListener("click", (event) => {
    handleFolderClick(event, folder);
  });
});
