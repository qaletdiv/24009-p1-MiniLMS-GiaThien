function toSignInPage() {
  window.location.href = "../signIn/signIn.html";
}

function toRegisterPage() {
  window.location.href = "../register/register.html";
}

const modal = document.getElementById("modal-role");
const modalRoleSelect = document.getElementById("modal-role-select");
const modalGradeContainer = document.getElementById("modal-grade");
const modalGradeSelect = document.getElementById("modal-grade-select");
const modalConfirm = document.getElementById("modal-confirm");

const modalClose = document.getElementById("modal-close");
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

const hiddenRole = document.getElementById("role");
const hiddenGrade = document.getElementById("grade");

const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
  // Nếu chưa chọn role thì hiện modal
  if (!hiddenRole.value) {
    e.preventDefault();
    modal.style.display = "block";
    return;
  }

  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const role = hiddenRole.value;
  const grade = hiddenGrade.value;

  if (!username || !password || !confirmPassword) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Mật khẩu xác nhận không khớp.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find((user) => user.username === username);
  if (exists) {
    alert("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.");
    return;
  }

  const newUser = {
    username,
    password,
    role,
    ...(role === "student" && { grade }) 
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công!");
  window.location.href = "../signIn/signIn.html";
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
