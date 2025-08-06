function toStudentDashboard() {
  window.location.href = "../student-dashboard/student-dashboard.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get("id"));


  const teacherSubmissions = JSON.parse(localStorage.getItem(`exercise_${id}_submissions`)) || [];
  const submission = teacherSubmissions.length > 0
    ? teacherSubmissions[teacherSubmissions.length - 1]
    : null;

  if (submission) {
    const submittedExercises = JSON.parse(localStorage.getItem("submittedExercises")) || [];
    const index = submittedExercises.findIndex(
      s => s.exerciseId === submission.exerciseId && s.studentName === submission.studentName
    );
    if (index !== -1) {
      submittedExercises[index] = submission;
      localStorage.setItem("submittedExercises", JSON.stringify(submittedExercises));
    }
  }

  if (!submission) {
    document.getElementById("result-detail").innerHTML = "<p>Không tìm thấy bài làm.</p>";
    return;
  }

  const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
  const exercise = exercises.find(e => e.id === submission.exerciseId);

  if (exercise) {
    submission.answers.forEach((answer, i) => {
      const updatedQuestion = exercise.questions[i];
      if (updatedQuestion && updatedQuestion.answer?.trim()) {
        answer.correctAnswer = updatedQuestion.answer;
        answer.points = updatedQuestion.points;

        if (typeof answer.score !== "number" || answer.status === "Đang chấm") {
          const isCorrect =
            answer.userAnswer?.trim().toLowerCase() === updatedQuestion.answer.trim().toLowerCase();
          answer.isCorrect = isCorrect;
          answer.status = isCorrect ? "Đúng" : "Sai";
          answer.score = isCorrect ? updatedQuestion.points : 0;
        }
      }
    });

   
    submission.totalScore = submission.answers.reduce((sum, a) => sum + (a.score || 0), 0);
    submission.maxScore = submission.answers.reduce((sum, a) => sum + (a.points || 0), 0);

    const allSubmissions = JSON.parse(localStorage.getItem("submittedExercises")) || [];
    const index = allSubmissions.findIndex(
      s => s.exerciseId === submission.exerciseId && s.studentName === submission.studentName
    );
    if (index !== -1) {
      allSubmissions[index] = submission;
      localStorage.setItem("submittedExercises", JSON.stringify(allSubmissions));
    }
  }



  document.getElementById("result-title").textContent = `Kết quả: ${submission.exerciseTitle}`;

  const totalQuestions = submission.answers.length;
  const autoGraded = submission.answers.filter(a => a.correctAnswer?.trim() !== "");
  const correctAnswers = autoGraded.filter(a => a.isCorrect).length;
  const wrongAnswers = autoGraded.length - correctAnswers;

  const percentage =
    submission.maxScore > 0
      ? Math.round((submission.totalScore / submission.maxScore) * 100)
      : 0;

  const scoreDisplay = document.getElementById("score-display");
  if (scoreDisplay) {
    scoreDisplay.innerHTML = `
      <span class="score-number">${submission.totalScore}</span>
      <span class="score-separator">/</span>
      <span class="score-max">${submission.maxScore}</span>
    `;
  }

  const scorePercentage = document.getElementById("score-percentage");
  if (scorePercentage) {
    scorePercentage.textContent = `${percentage}%`;
  }

  const totalQuestionsEl = document.getElementById("total-questions");
  const correctAnswersEl = document.getElementById("correct-answers");
  const wrongAnswersEl = document.getElementById("wrong-answers");

  if (totalQuestionsEl) totalQuestionsEl.textContent = totalQuestions;
  if (correctAnswersEl) correctAnswersEl.textContent = correctAnswers;
  if (wrongAnswersEl) wrongAnswersEl.textContent = wrongAnswers;

  const resultDetail = document.getElementById("result-detail");
  if (resultDetail) {
    resultDetail.innerHTML = `
      <h3>Chi tiết từng câu</h3>
      ${submission.feedback ? `<p class="exercise-comment"><strong>Nhận xét của giáo viên: </strong>${submission.feedback}</p>` : "Giáo viên chưa/không nhận xét bài này"}
      ${submission.answers
        .map((answer, index) => {
          const isManual = !answer.correctAnswer?.trim();

          return `
          <div class="question-result ${isManual ? 'pending' : (answer.isCorrect ? 'correct' : 'incorrect')}">
            <div class="question-text">
              <h4>Câu ${index + 1}</h4>
              <p>${answer.question}</p>
            </div>
            <div class="answer-section">
              <div class="answer-item">
                <span class="answer-label">Trả lời của bạn:</span>
                <span class="user-answer">${answer.userAnswer || "<i>Không trả lời</i>"}</span>
              </div>
              ${!isManual
              ? `
                <div class="answer-item">
                  <span class="answer-label">Đáp án đúng:</span>
                  <span class="correct-answer">${answer.correctAnswer}</span>
                </div>
                <div class="answer-item">
                  <span class="answer-label">Kết quả:</span>
                  <span class="${answer.isCorrect ? 'correct' : 'wrong'}-answer">
                    ${answer.status}
                  </span>
                </div>
                <div class="answer-item">
                  <span class="answer-label">Điểm:</span>
                  <span class="points">${answer.score}/${answer.points}</span>
                </div>
              `
              : `
                <div class="answer-item">
                  <span class="answer-label">Kết quả:</span>
                  <span class="pending-answer">Đang chấm</span>
                </div>
              `
            }
            </div>
          </div>
        `;
        })
        .join("")}
    `;
  }

  const resultHeader = document.querySelector(".result-header");
  if (resultHeader) {
    const metaInfo = document.createElement("div");
    metaInfo.className = "result-meta";
    metaInfo.innerHTML = `
      <span class="meta-item">Ngày nộp: ${new Date(submission.submittedAt).toLocaleDateString('vi-VN')}</span>
    `;
    resultHeader.appendChild(metaInfo);
  }
});

function printResult() {
  window.print();
}
