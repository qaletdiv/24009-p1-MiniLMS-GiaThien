const params = new URLSearchParams(location.search);
const id = parseInt(params.get("id"));

const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
const exercise = exercises.find(e => e.id === id);
const submited = localStorage.setItem('submited',0);

const form = document.getElementById("exercise-form");
const titleEl = document.getElementById("exercise-title");
const gradeEl = document.getElementById("exercise-grade");
const deadlineEl = document.getElementById("exercise-deadline");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");

let currentQuestionIndex = 0;
let userAnswers = {};

if (!exercise) {
  form.innerHTML = "<p>Không tìm thấy bài tập.</p>";
} else {

  const isExpired = checkDeadline();


  titleEl.textContent = exercise.title;

  if (gradeEl) {
    gradeEl.textContent = `Lớp: ${exercise.grade}`;
  }

  if (deadlineEl) {
    const deadline = exercise.deadline ? new Date(exercise.deadline).toLocaleDateString('vi-VN') : "Không có hạn";
    const status = isExpired ? " (Đã quá hạn)" : "";
    deadlineEl.textContent = `Hạn nộp: ${deadline}${status}`;
    deadlineEl.style.color = isExpired ? "#fa5252" : "#495057";
  }


  updateNavigation();
  showQuestion(currentQuestionIndex);


  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
        updateNavigation();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentQuestionIndex < exercise.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
        updateNavigation();
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", handleSubmit);
  }
}

function checkDeadline() {
  if (!exercise.deadline) return false;
  const now = new Date();
  const deadline = new Date(exercise.deadline);
  return now > deadline;
}

function showQuestion(index) {
  const question = exercise.questions[index];

  form.innerHTML = `
    <div class="question-block">
      <h3>Câu ${index + 1}</h3>
      <label>${question.question}</label><br>
      <input type="text" 
             name="answer-${index}" 
             value="${userAnswers[index] || ''}"
             placeholder="Nhập câu trả lời"
             required>
    </div>
  `;

 
  const input = form.querySelector(`input[name="answer-${index}"]`);
  input.addEventListener("input", (e) => {
    userAnswers[index] = e.target.value;
    console.log(`Saved answer for question ${index + 1}:`, e.target.value);
  });

 
  input.focus();
}

function updateNavigation() {
  if (prevBtn) {
    prevBtn.disabled = currentQuestionIndex === 0;
    prevBtn.style.opacity = currentQuestionIndex === 0 ? "0.5" : "1";
  }

  if (nextBtn) {
    const isLastQuestion = currentQuestionIndex === exercise.questions.length - 1;
    nextBtn.style.display = isLastQuestion ? "none" : "block";
  }

  if (submitBtn) {
    submitBtn.style.display = currentQuestionIndex === exercise.questions.length - 1 ? "block" : "none";
  }


  updateProgress();
}

function updateProgress() {
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");

  if (progressFill && progressText) {
    const progress = ((currentQuestionIndex + 1) / exercise.questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${currentQuestionIndex + 1}/${exercise.questions.length}`;
  }
}

function handleSubmit(e) {
  e.preventDefault();

  console.log("User Answers:", userAnswers);
  console.log("Exercise Questions:", exercise.questions);

  if (checkDeadline()) {
    showErrorMessage("Bài tập đã quá hạn nộp!");
    return;
  }

  const unansweredQuestions = [];
  exercise.questions.forEach((_, index) => {
    const answer = userAnswers[index];
    if (!answer || answer.trim() === "") {
      unansweredQuestions.push(index + 1);
    }
  });

  if (unansweredQuestions.length > 0) {
    showErrorMessage(`Vui lòng trả lời câu hỏi số: ${unansweredQuestions.join(", ")}`);
    return;
  }

  const answers = [];
  let total = 0;

  exercise.questions.forEach((q, index) => {
    const userAnswer = userAnswers[index] || "";
    
    
    let isCorrect = false;
    let score = 0;
    let status = "Đang chấm";
    
    if (q.answer && q.answer.trim() !== "") {
      
      isCorrect = userAnswer.toLowerCase().trim() === q.answer.toLowerCase().trim();
      score = isCorrect ? q.points : 0;
      status = isCorrect ? "ĐÚNG" : "SAI";
      total += score;
    } else {
      
      score = 0;
      status = "Đang chấm";
    }

    answers.push({
      question: q.question,
      userAnswer: userAnswer.trim(),
      correctAnswer: q.answer || "",
      isCorrect,
      points: q.points,
      score: score,
      status: status,
      hasAnswer: q.answer && q.answer.trim() !== ""
    });
  });

  const submission = {
    exerciseId: exercise.id,
    exerciseTitle: exercise.title,
    totalScore: total,
    maxScore: exercise.questions.reduce((sum, q) => sum + q.points, 0),
    answers,
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    studentName: `Học sinh lớp ${exercise.grade}`, 
    grade: exercise.grade
  };

  const allSubmissions = JSON.parse(localStorage.getItem("submittedExercises")) || [];
  allSubmissions.push(submission);
  localStorage.setItem("submittedExercises", JSON.stringify(allSubmissions));
  localStorage.removeItem(`exercise_${exercise.id}_draft`);

  
  const exerciseSubmissions = JSON.parse(localStorage.getItem(`exercise_${exercise.id}_submissions`)) || [];
  exerciseSubmissions.push(submission);
  localStorage.setItem(`exercise_${exercise.id}_submissions`, JSON.stringify(exerciseSubmissions));

  alert('Nộp bài thành công')
  window.location.href = `../exercise-result/exercise-result.html?id=${exercise.id}`;
}


function showErrorMessage(message) {
  alert(message);
}


document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
    updateNavigation();
  } else if (e.key === "ArrowRight" && currentQuestionIndex < exercise.questions.length - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
    updateNavigation();
  } else if (e.key === "Enter" && currentQuestionIndex < exercise.questions.length - 1) {

    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
    updateNavigation();
  }
});


setInterval(() => {
  if (exercise) {
    localStorage.setItem(`exercise_${exercise.id}_draft`, JSON.stringify(userAnswers));
  }
}, 5000);

window.addEventListener("load", () => {
  if (exercise) {
    const draft = localStorage.getItem(`exercise_${exercise.id}_draft`);
    if (draft) {
      userAnswers = JSON.parse(draft);
    }
  }
});


function toStudentDashboard() {
  window.location.href = "../student-dashboard/student-dashboard.html";
}