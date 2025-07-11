function toSignInPage() {
  window.location.href = "../signIn/signIn.html";
}

function toRegisterPage() {
  window.location.href = "../register/register.html";
}
const modalClose = document.getElementById("modal-close");

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

const modal = document.getElementById("modal-role");
const modalRoleSelect = document.getElementById("modal-role-select");
const modalGradeContainer = document.getElementById("modal-grade");
const modalGradeSelect = document.getElementById("modal-grade-select");
const modalConfirm = document.getElementById("modal-confirm");

const hiddenRole = document.getElementById("role");
const hiddenGrade = document.getElementById("grade");

const form = document.querySelector("form");


form.addEventListener("submit", function (e) {
  if (!hiddenRole.value) {
    e.preventDefault();
    modal.style.display = "block";
  }
});


modalRoleSelect.addEventListener("change", () => {
  if (modalRoleSelect.value === "student") {
    modalGradeContainer.style.display = "block";
  } else {
    modalGradeContainer.style.display = "none";
  }
});


modalConfirm.addEventListener("click", () => {
  const roleVal = modalRoleSelect.value;
  const gradeVal = modalGradeSelect.value;

  if (!roleVal) {
    alert("Vui lòng chọn vai trò.");
    return;
  }

  if (roleVal === "student" && !gradeVal) {
    alert("Vui lòng chọn lớp.");
    return;
  }

  hiddenRole.value = roleVal;
  hiddenGrade.value = roleVal === "student" ? gradeVal : "";

    modal.style.display = "none";
    form.requestSubmit(); 
  });
