// Source - https://stackoverflow.com/a/831657
// Posted by Stefan Lundström, modified by community. See post 'Timeline' for change history
// Retrieved 2026-07-06, License - CC BY-SA 4.0

export function middleEllipsis(str, maxLen = 35) {
  if (str.length > maxLen) {
    return (
      str.substring(0, 20) + " ... " + str.substring(str.length - 5, str.length)
    );
  }
  return str;
}
