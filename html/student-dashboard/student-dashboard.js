function signOut() {
  localStorage.removeItem("currentUser");
  window.location.href = "../signIn/signIn.html";
}

window.addEventListener("DOMContentLoaded", () => {

  const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
  const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
  const submissions = JSON.parse(localStorage.getItem("submittedExercises")) || [];
  const grade = localStorage.getItem('grade');
  const lessonList = document.getElementById("lesson-list");
  const notSubmittedBox = document.getElementById("exercise-not-submitted");
  const submittedBox = document.getElementById("exercise-submitted");
  
  
  const lessonsForStudent = lessons.filter((l) => l.grade == grade);
  if (lessonsForStudent.length === 0) {
    lessonList.innerHTML = "<li>Chưa có bài giảng nào cho lớp của bạn.</li>";
  } else {
    lessonsForStudent.forEach((lesson) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${lesson.title}</strong><br>
        <button class="btn-show" onclick="viewLesson(${lesson.id})">Xem bài giảng</button>
      `;
      lessonList.appendChild(li);
    });
  }

 
  const exercisesForStudent = exercises.filter((ex) => ex.grade == grade);

  if (exercisesForStudent.length === 0) {
    notSubmittedBox.innerHTML = "<li>Không có bài tập </li>";
  }

  exercisesForStudent.forEach((exercise, i) => {
    const li = document.createElement("li");
    const deadline = exercise.deadline ? new Date(exercise.deadline) : null;
    const now = new Date();
    const isExpired = deadline && now > deadline;

    const submission = submissions.find(
      (s) => s.exerciseId === exercise.id
    );

    li.innerHTML = `
      <strong>${exercise.title}</strong><br>
      <small>Số câu hỏi: ${exercise.questions.length}</small><br>
      <small>Hạn nộp: ${exercise.deadline || "Không có"}</small><br>
      <small>Ngày tạo: ${new Date(exercise.createdAt).toLocaleString()}</small><br>
    `;

    const button = document.createElement("button");
    button.classList.add("btn-show");

    if (submission) {
      button.textContent = `Xem kết quả (${submission.totalScore}/${submission.maxScore})`;
      button.onclick = function () {
        window.location.href = `../exercise-result/exercise-result.html?id=${exercise.id}`;
      };
      li.appendChild(button);
      submittedBox.appendChild(li);
    } else {
      if (isExpired) {
        button.textContent = "Đã quá hạn nộp";
        button.disabled = true;
        button.style.backgroundColor = "#ccc";
        button.style.cursor = "not-allowed";
      } else {
        button.textContent = "Làm bài";
        button.onclick = function () {
          window.location.href = `../exercise-do/exercise-do.html?id=${exercise.id}`;
        };
      }
      li.appendChild(button);
      notSubmittedBox.appendChild(li);
    }
  });

  
  window.viewLesson = function (id) {
    window.location.href = `../lesson-detail/lesson-detail.html?id=${id}`;
  };
});
