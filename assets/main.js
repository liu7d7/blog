const months = "january february march april may june july august september october november december".split(" ");

{
  const date = new Date();
  document.getElementById("date").innerHTML = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
