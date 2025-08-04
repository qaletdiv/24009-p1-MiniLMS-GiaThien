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
    if (!lesson) {
      container.innerHTML = "<p>Bài giảng không tồn tại.</p>";
      return;
    }

    document.getElementById("page-title").textContent = "Chi tiết bài giảng";
    container.innerHTML = `
    <div class="submission-header">
      <h2>${lesson.title}</h2>
      <div class="submission-meta">
        <span class="meta-item">Khối lớp: ${lesson.grade}</span>
        <span class="meta-item">Ngày tạo: ${new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</span>
      </div>
    </div>
    
    <div class="submission-content-wrapper">
      <div class="submission-content">
        <h2>Nội dung bài giảng</h2>
        <pre style="line-height: 1.8; word-wrap: break-word;">${lesson.content}</pre>
      </div>
      
      <div class="submission-actions">
        <button class="btn btn-secondary" onclick="toTeacherDashboard()">Quay lại</button>
        <button class="btn btn-primary" onclick="printLesson()">In bài giảng</button>
      </div>
    </div>
  `;
  }


  if (type === "exercise") {
    const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
    const exercise = exercises.find(e => e.id === id);
    if (!exercise) return (container.innerHTML = "<p>Bài tập không tồn tại.</p>");

    const exerciseSubmissions = JSON.parse(localStorage.getItem(`exercise_${exercise.id}_submissions`)) || [];
    const hasSubmissions = exerciseSubmissions.length > 0;

    let combinedHtml = `
    <div class="submission-header">
      <h2>${exercise.title}</h2>
      <div class="submission-meta">
        <span class="meta-item">Khối lớp: ${exercise.grade}</span>
        <span class="meta-item">Hạn nộp: ${exercise.deadline}</span>
      </div>
    </div>
    `;

    exercise.questions.forEach((q, index) => {
      const isManual = !q.answer?.trim();

      combinedHtml += `
        <div class="question-block">
          <p><strong>Câu ${index + 1}:</strong> ${q.question}</p>

          ${isManual
          ? `
            <label>Nhập đáp án đúng:
              <input type="text" class="manual-answer" data-q="${index}" style="width: 100%; margin-top: 4px;" />
            </label>`
          : `<p><strong>Đáp án đúng:</strong> ${q.answer}</p>`}

          <p><strong>Điểm tối đa:</strong> ${q.points}</p>

          <label>Chấm bài:
            <input type="number" min="0" max="${q.points}" class="regrade" data-q="${index}" ${!hasSubmissions ? 'disabled' : ''} />
          </label>
      `;

      if (hasSubmissions) {
        combinedHtml += `<div class="submission-details-per-question"><h4>Học sinh trả lời:</h4>`;
        exerciseSubmissions.forEach((submission, sIndex) => {
          const answer = submission.answers[index];
          if (!answer) return;

          combinedHtml += `
            <div class="submission-item ${answer.status === 'Đang chấm' ? 'pending' : (answer.isCorrect ? 'correct' : 'incorrect')}">
              <p><strong>Học sinh ${sIndex + 1}:</strong> ${submission.studentName}</p>
              <p>Trả lời: ${answer.userAnswer}</p>
              <p>Đáp án đúng: ${answer.correctAnswer || '<i>Chưa có</i>'}</p>
              <p>Trạng thái: ${answer.status}</p>
              <p>Điểm: ${answer.score}/${answer.points}</p>
              <p>Thời gian nộp: ${new Date(submission.submittedAt).toLocaleString()}</p>
            </div>
          `;
        });
        combinedHtml += `</div>`;
      }

      combinedHtml += `<hr /></div>`;
    });

    combinedHtml += `
      <button id="save-feedback" ${!hasSubmissions ? 'disabled' : ''}>
        ${hasSubmissions ? 'Lưu chấm điểm' : 'Chưa có học sinh nộp bài'}
      </button>
    `;

    container.innerHTML = combinedHtml;

    const saveButton = document.getElementById("save-feedback");
    if (saveButton && hasSubmissions) {
      saveButton.addEventListener("click", () => {
        const regrades = Array.from(document.querySelectorAll(".regrade")).map(input => ({
          questionIndex: parseInt(input.dataset.q),
          newPoints: parseFloat(input.value || 0)
        }));

        const manualAnswers = Array.from(document.querySelectorAll(".manual-answer")).map(input => ({
          questionIndex: parseInt(input.dataset.q),
          answer: input.value.trim()
        }));


        manualAnswers.forEach(({ questionIndex, answer }) => {
          if (answer) {
            exercise.questions[questionIndex].answer = answer;
          }
        });


        exerciseSubmissions.forEach(submission => {
          let totalScore = 0;
          let maxScore = 0;

          submission.answers.forEach((answer, i) => {
            const question = exercise.questions[i];
            const regradeEntry = regrades.find(r => r.questionIndex === i);
            const correctAnswer = question.answer;

            answer.correctAnswer = correctAnswer || "";
            answer.points = question.points;

            const manualScore = regradeEntry ? regradeEntry.newPoints : 0;

            if (!correctAnswer) {
              answer.status = "Đang chấm";
              answer.score = manualScore;
              answer.isCorrect = false;
            } else {
              answer.isCorrect = answer.userAnswer?.trim().toLowerCase() === correctAnswer.toLowerCase();
              answer.status = answer.isCorrect ? "Đúng" : "Sai";
              answer.score = answer.isCorrect ? question.points : manualScore;
            }

            totalScore += answer.score;
            maxScore += question.points;
          });

          submission.totalScore = totalScore;
          submission.maxScore = maxScore;
          submission.status = "Đã chấm";
        });


        const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
        const exerciseIndex = exercises.findIndex(e => e.id === exercise.id);
        if (exerciseIndex !== -1) {
          exercises[exerciseIndex] = exercise;
          localStorage.setItem("exercises", JSON.stringify(exercises));
        }


        localStorage.setItem(`exercise_${exercise.id}_submissions`, JSON.stringify(exerciseSubmissions));


        const submittedExercises = JSON.parse(localStorage.getItem("submittedExercises")) || [];
        exerciseSubmissions.forEach(scored => {
          const i = submittedExercises.findIndex(
            s => s.exerciseId === scored.exerciseId && s.studentName === scored.studentName
          );
          if (i !== -1) {
            submittedExercises[i] = scored;
          }
        });
        localStorage.setItem("submittedExercises", JSON.stringify(submittedExercises));

        alert("Chấm bài thành công!");
        window.location.href = '../teacher-dashboard/teacher-dashboard.html';
      });
    }
  }
});

function printLesson() {
  window.print();
}
