
function toStudentDashboard(){
    window.location.href="../student-dashboard/student-dashboard.html"
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");

  const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
  const submissions = JSON.parse(localStorage.getItem("submittedExercises")) || [];

  const exercise = exercises[id];
  if (!exercise || !currentUser) {
    document.getElementById("result-box").innerHTML = "<p>Bài tập không hợp lệ.</p>";
    return;
  }

  const result = submissions.find(
    (s) => s.student === currentUser.username && s.exerciseTitle === exercise.title
  );

  if (!result) {
    document.getElementById("result-box").innerHTML = "<p>Bạn chưa nộp bài tập này.</p>";
    return;
  }

  const box = document.getElementById("result-box");
  box.innerHTML += `
    <p><strong>Tên bài:</strong> ${result.exerciseTitle}</p>
    <p><strong>Điểm:</strong> ${result.totalScore} / ${result.maxScore}</p>
    <hr>
  `;

  result.answers.forEach((ans, i) => {
    const div = document.createElement("div");
    div.classList.add("result-item");

    div.innerHTML = `
      <p><strong>Câu ${i + 1}:</strong> ${ans.question}</p>
      <p><strong>Trả lời của bạn:</strong> ${ans.studentAnswer}</p>
      <p><strong>Đáp án đúng:</strong> ${ans.correctAnswer}</p>
      <p class="${ans.isCorrect ? 'correct' : 'incorrect'}">
        ${ans.isCorrect ? "Đúng" : "Sai"} - Điểm: ${ans.score}
      </p>
    `;

    box.appendChild(div);
  });
});
