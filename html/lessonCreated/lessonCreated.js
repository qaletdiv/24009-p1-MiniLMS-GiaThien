function signOut() {
  localStorage.removeItem('currentUser');
  window.location.href = "../signIn/signIn.html";
}
function toTeacherDashBoard() {
  window.location.href = "../teacher-dashboard/teacher-dashboard.html";
}

window.addEventListener('DOMContentLoaded', () => {
  const lessonList = document.getElementById('lesson-list');
  const lessons = JSON.parse(localStorage.getItem('lessons')) || [];

  if (lessons.length === 0) {
    lessonList.innerHTML = "<li>Chưa có bài giảng nào được tạo.</li>";
    return;
  }

  lessons.forEach((lesson, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
          <strong>${index + 1}. ${lesson.title}</strong> - Lớp ${lesson.grade}<br>
          <p>Nội dụng: ${lesson.content}</p>
        `;
    lessonList.appendChild(li);
  });
});