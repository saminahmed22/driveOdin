const files = document.querySelectorAll(".file");

function handleFileClick(event, file) {
  const postID = file.dataset.postid;

  const button = event.target.closest("button");

  if (button) {
    const buttonClassList = button.classList;

    if (buttonClassList.contains("fileOptionsBtn")) {
      handleFileOptionsClick(file);
    } else if (buttonClassList.contains("fileEditBtn")) {
      editFile(file);
    } else if (buttonClassList.contains("fileDeleteBtn")) {
      deleteFile(file);
    }
  } else {
    if (postID) {
      window.location.href = `/post/${postID}`;
    }
  }
}

function handleFileOptionsClick(file) {
  const fileOptionsDiv = file.querySelector(".fileOptions");

  if (fileOptionsDiv.classList.contains("expand")) {
    fileOptionsDiv.classList.replace("expand", "shrink");
  } else if (fileOptionsDiv.classList.contains("shrink")) {
    fileOptionsDiv.classList.replace("shrink", "expand");
  } else {
    fileOptionsDiv.classList.add("expand");
  }
}

function editFile(file) {}

function deleteFile(file) {}

files.forEach((file) => {
  file.addEventListener("click", (event) => {
    handleFileClick(event, file);
  });
});
