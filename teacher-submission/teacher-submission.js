function toTeacherDashboard() {
    window.location.href = "../teacher-dashboard/teacher-dashboard.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const url = new URLSearchParams(window.location.search);
  const id = parseInt(url.get("id"));
  const type = url.get("type");
  const container = document.getElementById("content-container");

  if (type === "lesson") {
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return (container.innerHTML = "<p>Bài giảng không tồn tại.</p>");

    document.getElementById("page-title").textContent = "Chi tiết bài giảng";
    container.innerHTML = `
      <h2>${lesson.title}</h2>
      <p><strong>Khối lớp:</strong> ${lesson.grade}</p>
      <p><strong>Ngày tạo:</strong> ${new Date(lesson.createdAt).toLocaleString()}</p>
      <div><strong>Nội dung:</strong></div>
      <div style="white-space: pre-line; border: 1px solid #ddd; padding: 10px; margin-top: 10px;">
        ${lesson.content}
      </div>
    `;
  }

  if (type === "exercise") {
    const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
    const exercise = exercises.find(e => e.id === id);
    if (!exercise) return (container.innerHTML = "<p>Bài tập không tồn tại.</p>");

    
    const exerciseSubmissions = JSON.parse(localStorage.getItem(`exercise_${exercise.id}_submissions`)) || [];
    const hasSubmissions = exerciseSubmissions.length > 0;
    
    const questionsHtml = exercise.questions.map((q, index) => {
      return `
        <div class="question-block">
          <p><strong>Câu ${index + 1}:</strong> ${q.question}</p>
          <p><strong>Đáp án đúng:</strong> ${q.answer}</p>
          <p><strong>Điểm:</strong> ${q.points}</p>
          <label>Chấm lại điểm:
            <input type="number" min="0" max="${q.points}" class="regrade" data-q="${index}" ${!hasSubmissions ? 'disabled' : ''} />
          </label>
        </div>
        <hr />
      `;
    }).join("");

   
    let submissionsHtml = '';
    if (hasSubmissions) {
      submissionsHtml = `
        <div class="submissions-section">
          <h3>Bài nộp của học sinh (${exerciseSubmissions.length} bài)</h3>
          ${exerciseSubmissions.map((submission, index) => `
            <div class="submission-item">
              <p><strong>Học sinh ${index + 1}:</strong> ${submission.studentName}</p>
              <p><strong>Điểm:</strong> ${submission.totalScore}/${submission.maxScore}</p>
              <p><strong>Thời gian nộp:</strong> ${new Date(submission.submittedAt).toLocaleString()}</p>
              <details>
                <summary>Xem chi tiết</summary>
                <div class="submission-details">
                  ${submission.answers.map((answer, qIndex) => `
                    <div class="answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                      <p><strong>Câu ${qIndex + 1}:</strong></p>
                      <p>Trả lời: ${answer.userAnswer}</p>
                      <p>Đáp án đúng: ${answer.correctAnswer}</p>
                      <p>Điểm: ${answer.isCorrect ? answer.points : 0}/${answer.points}</p>
                    </div>
                  `).join('')}
                </div>
              </details>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      <h2>${exercise.title}</h2>
      <p><strong>Khối lớp:</strong> ${exercise.grade}</p>
      <p><strong>Hạn nộp:</strong> ${exercise.deadline}</p>
      <div class="questions">
        ${questionsHtml}
      </div>
      <div class="feedback">
        <label>Nhận xét:</label><br />
        <textarea id="feedback" rows="4" style="width: 100%;" placeholder="Nhập nhận xét..." ${!hasSubmissions ? 'disabled' : ''}></textarea>
      </div>
      <button id="save-feedback" ${!hasSubmissions ? 'disabled' : ''}>
        ${hasSubmissions ? 'Lưu nhận xét & chấm điểm' : 'Chưa có học sinh nộp bài'}
      </button>
      ${submissionsHtml}
    `;

    const saveButton = document.getElementById("save-feedback");
    if (saveButton && hasSubmissions) {
      saveButton.addEventListener("click", () => {
        const feedback = document.getElementById("feedback").value.trim();
        const regrades = Array.from(document.querySelectorAll(".regrade")).map(input => {
          return {
            questionIndex: parseInt(input.dataset.q),
            newPoints: parseFloat(input.value || 0)
          };
        });

        const submission = {
          exerciseId: exercise.id,
          feedback,
          regrades,
          updatedAt: new Date().toISOString()
        };

        const submissions = JSON.parse(localStorage.getItem("submissions")) || [];
        submissions.push(submission);
        localStorage.setItem("submissions", JSON.stringify(submissions));

        alert("Lưu nhận xét và điểm thành công!");
      });
    }
  }
});

