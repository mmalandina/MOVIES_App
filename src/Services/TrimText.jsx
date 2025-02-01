export default function TrimText(str, len) {
  if (str.length <= len) return str;

  const subStr = str.slice(0, len);
  const spaceIdx = subStr.lastIndexOf(' ');

  return `${subStr.slice(0, spaceIdx)}...`;
}
