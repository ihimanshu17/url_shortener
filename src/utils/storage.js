export function saveLink(link) {
  const links = JSON.parse(localStorage.getItem("links")) || [];
  links.push(link);
  localStorage.setItem("links", JSON.stringify(links));
}
