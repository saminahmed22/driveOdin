const files = document.querySelectorAll(".file");

function handleFileClick(event, file) {
  const postID = file.dataset.postid;

  const button = event.target.closest("button");

  if (button) {
    const buttonClassList = button.classList;

    if (buttonClassList.contains("fileOptionsBtn")) {
      handleFileOptionsClick(file);
    } else if (buttonClassList.contains("fileEditBtn")) {
      editFile(postID);
    } else if (buttonClassList.contains("fileDeleteBtn")) {
      deleteFile(postID);
    }
  } else {
    if (postID) {
      window.location.href = `/post/${postID}`;
    }
  }
}

function handleFileOptionsClick(file) {
  const fileOptionsDiv = file.querySelector(".fileOptions");
  const fileOptionExpandButton = file.querySelector(".fileOptionsBtn");

  if (fileOptionsDiv.classList.contains("expand")) {
    fileOptionsDiv.classList.replace("expand", "shrink");

    fileOptionExpandButton.title = "Expand file options";
  } else if (fileOptionsDiv.classList.contains("shrink")) {
    fileOptionsDiv.classList.replace("shrink", "expand");

    fileOptionExpandButton.title = "Shrink file options";
  } else {
    fileOptionsDiv.classList.add("expand");

    fileOptionExpandButton.title = "Shrink file options";
  }
}

function editFile(postID) {
  window.location.href = `/post/edit/${postID}`;
}

function deleteFile(postID) {
  window.location.href = `/post/delete/${postID}`;
}

files.forEach((file) => {
  file.addEventListener("click", (event) => {
    handleFileClick(event, file);
  });
});
