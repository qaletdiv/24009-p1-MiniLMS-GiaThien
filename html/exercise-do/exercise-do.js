

function toStudentDashboard(){
    window.location.href="../student-dashboard/student-dashboard.html"
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");

  const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
  const exercise = exercises[id];

  const titleEl = document.getElementById("exercise-title");
  const deadlineEl = document.getElementById("deadline-info");
  const form = document.getElementById("exercise-form");

  if (!exercise) {
    titleEl.textContent = "Không tìm thấy bài tập!";
    return;
  }

  
  titleEl.textContent = exercise.title;
  deadlineEl.textContent = exercise.deadline ? `Hạn nộp: ${exercise.deadline}` : "Không có hạn nộp";

  const now = new Date();
  const deadline = exercise.deadline ? new Date(exercise.deadline) : null;
  const isExpired = deadline && now > deadline;

  if (isExpired) {
    form.innerHTML = `<p><strong style="color:red;">Đã quá hạn nộp bài!</strong></p>`;
    return;
  }

  
  exercise.questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.classList.add("question-block");
    div.innerHTML = `
      <p><strong>Câu ${i + 1}:</strong> ${q.question}</p>
      <input type="text" name="answer${i}" required placeholder="Nhập câu trả lời" />
    `;
    form.appendChild(div);
  });

  
  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Nộp bài";
  submitBtn.type = "submit";
  submitBtn.style.background = "#007bff";
  submitBtn.style.color = "#fff";
  submitBtn.style.border = "1px solid white";
  submitBtn.style.padding = "8px 16px";
  submitBtn.style.borderRadius = "4px";
  submitBtn.style.cursor = "pointer";
  form.appendChild(submitBtn);

  
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const answers = [];

    exercise.questions.forEach((_, i) => {
      const answer = formData.get(`answer${i}`).trim();
      answers.push(answer);
    });

    
    let totalScore = 0;
    let maxScore = 0;
    const detailedResults = [];

    exercise.questions.forEach((q, i) => {
      const correct = q.answer.trim().toLowerCase();
      const studentAns = answers[i].trim().toLowerCase();
      const isCorrect = correct === studentAns;
      const score = isCorrect ? q.points : 0;

      totalScore += score;
      maxScore += q.points;

      detailedResults.push({
        question: q.question,
        studentAnswer: answers[i],
        correctAnswer: q.answer,
        isCorrect,
        score
      });
    });

    const submission = {
      student: currentUser.username,
      exerciseTitle: exercise.title,
      grade: currentUser.grade,
      submittedAt: new Date().toISOString(),
      answers: detailedResults,
      totalScore,
      maxScore
    };

    const allSubmissions = JSON.parse(localStorage.getItem("submittedExercises")) || [];
    allSubmissions.push(submission);
    localStorage.setItem("submittedExercises", JSON.stringify(allSubmissions));

    alert(`Bạn đã nộp bài thành công!\nĐiểm: ${totalScore}/${maxScore}, đây chỉ là điểm số tham khảo, giáo viên sẽ chấm điểm cuối cùng.`);
    window.location.href = `../exercise-result/exercise-result.html?id=${id}`;
  });
});
