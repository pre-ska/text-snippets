// add admin cloud function
const adminForm = document.querySelector(".admin-actions");
adminForm.addEventListener("submit", e => {
  e.preventDefault();

  const adminEmail = document.querySelector("#admin-email").value;

  // https://firebase.google.com/docs/functions/callable
  const addAdminRole = functions.httpsCallable("addAdminRole");
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
    adminForm.reset();
  });
});

//auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    // dali je user admin?
    user.getIdTokenResult().then(idTokenResult => {
      // dodaj useru prop privremeni koji je TRUE ili UNDEFINED
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });

    // get data from firestore
    db.collection("snippets").onSnapshot(
      snapshot => {
        setupSnippets(snapshot.docs);
      },
      err => console.log(err)
    );
  } else {
    setupUI();
    setupSnippets([]);
  }
});

//create new snippet
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", e => {
  e.preventDefault();
  //get info from input
  const title = createForm["title"].value;
  const content = createForm["content"].value;

  if (content !== "") {
    db.collection("snippets")
      .add({
        title,
        content
      })
      .then(() => {
        //close modal and reset form
        const modal = document.querySelector("#modal-create");
        M.Modal.getInstance(modal).close();
        createForm.reset();
      })
      .catch(err => {
        console.log(err.message);
      });
  }
});

// signup user
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", e => {
  e.preventDefault();

  //get info from input
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  const bio = signupForm["signup-bio"].value;

  //signup user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(credential => {
      return db
        .collection("users")
        .doc(credential.user.uid)
        .set({
          bio
        });
    })
    .then(doc => {
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      signupForm.querySelector(".error").innerHTML = "";
    })
    .catch(err => {
      signupForm.querySelector(".error").innerHTML = err.message;
    });
});

//log out method
const logout = document.querySelector("#logout");

logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut();
});

// log in method
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  //get info from input
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then(credential => {
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector(".error").innerHTML = "";
    })
    .catch(err => {
      loginForm.querySelector(".error").innerHTML = err.message;
    });
});
