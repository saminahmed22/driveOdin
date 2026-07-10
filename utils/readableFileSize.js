import fileSize from "file-size";

export function formatReadableSize(size) {
  const readableSize = fileSize(size).human("si");

  return readableSize;
}
