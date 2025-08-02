
function toStudentDashboard(){
    window.location.href="../student-dashboard/student-dashboard.html"
}
    const params = new URLSearchParams(location.search);
    const id = parseInt(params.get("id"));

    const submissions = JSON.parse(localStorage.getItem("submittedExercises")) || [];
    const submission = submissions.find(s => s.exerciseId === id);

    const resultEl = document.getElementById("result-detail");

    if (!submission) {
      resultEl.innerHTML = "<p>Không tìm thấy bài làm.</p>";
    } else {
      document.getElementById("result-title").textContent = `Kết quả: ${submission.exerciseTitle}`;
      resultEl.innerHTML = `
        <p>Điểm: <strong>${submission.totalScore}/${submission.maxScore}</strong></p>
        <hr>
        ${submission.answers.map((a, i) => `
          <div>
            <p><strong>Câu ${i + 1}:</strong> ${a.question}</p>
            <p>Trả lời: ${a.userAnswer}</p>
            <p>Đáp án đúng: ${a.correctAnswer}</p>
            <p>Đúng / Sai: <strong style="color: ${a.isCorrect ? 'green' : 'red'}">${a.isCorrect ? 'ĐÚNG' : 'SAI'}</strong></p>
            <p>Điểm: ${a.isCorrect ? a.points : 0}/${a.points}</p>
            <hr>
          </div>
        `).join("")}
      `;
    }
