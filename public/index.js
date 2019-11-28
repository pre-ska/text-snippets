const snippetsList = document.querySelector(".snippets");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
const adminItems = document.querySelectorAll(".admin");

const setupUI = user => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => (item.style.display = "block"));
    }
    //acc info
    db.collection("users")
      .doc(user.uid)
      .get()
      .then(doc => {
        const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
        <div class='pink-text'>${user.admin ? "Admin" : ""}</div>
      `;
        accountDetails.innerHTML = html;
      });

    loggedInLinks.forEach(item => (item.style.display = "block"));
    loggedOutLinks.forEach(item => (item.style.display = "none"));
  } else {
    adminItems.forEach(item => (item.style.display = "none"));
    accountDetails.innerHTML = "";

    loggedInLinks.forEach(item => (item.style.display = "none"));
    loggedOutLinks.forEach(item => (item.style.display = "block"));
  }
};

// setup snippets - called from auth.js
const setupSnippets = data => {
  if (data.length) {
    let html = "";
    data.forEach(doc => {
      const snippet = doc.data();

      const li = `
        <li>
          <div class="collapsible-header grey lighten-4">${snippet.title}</div>
          <div class="collapsible-body white"><pre><xmp>${snippet.content}</xmp></pre></div>
        </li>
      `;

      html += li;
    });

    snippetsList.innerHTML = html;
  } else {
    snippetsList.innerHTML =
      '<h5 class="center-align">Log in to view snippets</h5>';
  }
};

// setup materialize components
document.addEventListener("DOMContentLoaded", function() {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});
