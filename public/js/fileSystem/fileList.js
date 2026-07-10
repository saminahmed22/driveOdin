// FileList header click event hanlders
const createFolderPopover = document.getElementById("createFolderPopover");

const fileListHeader = document.querySelector(".fileListHeader");

function handleFileListHeaderClick(event) {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.classList.contains("createFolderBtn")) {
    createFolderPopover.showModal();
  }
}

fileListHeader.addEventListener("click", handleFileListHeaderClick);

// Popover button handlers
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

function handlePopoverButtonClicks(event) {
  const popoverBtn = event.target.closest("button");

  if (popoverBtn.classList.contains("closeBtn")) {
    closeModal(createFolderPopover);
  }
}

createFolderPopover.addEventListener("click", handlePopoverButtonClicks);
