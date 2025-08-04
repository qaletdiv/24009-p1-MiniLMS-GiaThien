const params = new URLSearchParams(location.search);
const id = parseInt(params.get("id"));
const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
const lesson = lessons.find(l => l.id === id);

if (lesson) {
  document.getElementById("lesson-title").textContent = lesson.title;
  document.getElementById("lesson-grade").textContent = `Khối lớp: ${lesson.grade}`;
  
 
  const lessonContent = document.getElementById("lesson-content");
  lessonContent.innerHTML = lesson.content.replace(/\n/g, '<br>');
  lessonContent.style.whiteSpace = 'pre-line';
} else {
  document.body.innerHTML = "<p>Bài giảng không tồn tại.</p>";
}
