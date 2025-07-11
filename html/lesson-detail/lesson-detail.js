document.addEventListener("DOMContentLoaded", () => {
  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");

  const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
  const lesson = lessons[id];

  const box = document.getElementById("lesson-box");

  if (!lesson) {
    box.innerHTML = "<p>Không tìm thấy bài giảng.</p>";
    return;
  }

  box.innerHTML = `
    <h2>${lesson.title}</h2>
    <p><strong>Lớp:</strong> ${lesson.grade}</p>
    <p><strong>Ngày tạo:</strong> ${new Date(lesson.createdAt).toLocaleString()}</p>
    <hr>
    <p><strong>Nội dung bài giảng:</strong></p>
    <div>${lesson.content}</div>
  `;
});
