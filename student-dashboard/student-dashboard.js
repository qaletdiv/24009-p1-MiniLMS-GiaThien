

function updateStats() {
  const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
  const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
  const submissions = JSON.parse(localStorage.getItem("submittedExercises")) || [];
  const grade = localStorage.getItem('grade');
  
  
  const lessonsForStudent = lessons.filter((l) => l.grade == grade);
  const exercisesForStudent = exercises.filter((ex) => ex.grade == grade);
  
 
  const submittedExercises = exercisesForStudent.filter(exercise => {
    return submissions.find(s => s.exerciseId === exercise.id);
  });
  
  const pendingExercises = exercisesForStudent.filter(exercise => {
    return !submissions.find(s => s.exerciseId === exercise.id);
  });
  

 
  
  
  const lessonCountElement = document.getElementById("lesson-count");
  const exercisePendingElement = document.getElementById("exercise-pending");
  const exerciseCompletedElement = document.getElementById("exercise-completed");
 
  
  if (lessonCountElement) {
    lessonCountElement.textContent = lessonsForStudent.length;
  }
  
  if (exercisePendingElement) {
    exercisePendingElement.textContent = pendingExercises.length;
  }
  
 
  
  
  // Cập nhật số đếm trong section headers
  const lessonCountBadge = document.getElementById("lesson-count-badge");
  const exerciseCountBadge = document.getElementById("exercise-count-badge");
  
  if (lessonCountBadge) {
    lessonCountBadge.textContent = lessonsForStudent.length;
  }
  
  
  
  
  animateCount(lessonCountElement);
  animateCount(exercisePendingElement);
  animateCount(exerciseCompletedElement);
  animateCount(lessonCountBadge);
  animateCount(exerciseCountBadge);
}


function animateCount(element) {
  if (!element) return;
  
  element.style.transform = 'scale(1.1)';
  element.style.transition = 'transform 0.3s ease';
  
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 300);
}


function refreshDashboard() {
  updateStats();
  renderLessons();
  renderExercises();
}

window.addEventListener("DOMContentLoaded", () => {
 
  renderLessons();
  renderExercises();
  updateStats();
  

  window.addEventListener('storage', function(e) {
    if (e.key === 'lessons' || e.key === 'exercises' || e.key === 'submittedExercises') {
      updateStats();
      renderLessons();
      renderExercises();
    }
  });
  
  
  window.addEventListener('focus', refreshDashboard);
});

function renderLessons() {
  const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
  const grade = localStorage.getItem('grade');
  const lessonList = document.getElementById("lesson-list");
  
  // Clear existing content
  lessonList.innerHTML = "";
  
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
}

function renderExercises() {
  const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
  const submissions = JSON.parse(localStorage.getItem("submittedExercises")) || [];
  const grade = localStorage.getItem('grade');
  const notSubmittedBox = document.getElementById("exercise-not-submitted");
  const submittedBox = document.getElementById("exercise-submitted");
  
  // Clear existing content
  notSubmittedBox.innerHTML = "";
  submittedBox.innerHTML = "";
  
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
      button.textContent = `Xem kết quả`;
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
}

// Hàm view lesson
window.viewLesson = function (id) {
  window.location.href = `../lesson-detail/lesson-detail.html?id=${id}`;
};
