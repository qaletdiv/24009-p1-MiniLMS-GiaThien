

const typeSelect = document.getElementById("type");
const lectureForm = document.getElementById("lecture-form");
const exerciseForm = document.getElementById("exercise-form");
const lectureSection = document.getElementById("lecture-section");
const exerciseSection = document.getElementById("exercise-section");
const addButton = document.getElementById("add-exercise");
const exercisesContainer = document.getElementById("exercises-container");


lectureSection.style.display = 'none';
exerciseSection.style.display = 'none';


typeSelect.addEventListener("change", function () {
  const selectedType = typeSelect.value;

  if (selectedType === "Lesson") {
    lectureSection.style.display = "block";
    exerciseSection.style.display = "none";
  } else if (selectedType === "Exercise") {
    lectureSection.style.display = "none";
    exerciseSection.style.display = "block";
    if (exercisesContainer.querySelectorAll(".exercise-item").length === 0) {
      addButton.click();
    }
  } else {
    lectureSection.style.display = "none";
    exerciseSection.style.display = "none";
  }
});



lectureForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const grade = document.getElementById("grade").value;
  const content = document.getElementById("content").value.trim();

  const lessons = JSON.parse(localStorage.getItem("lessons")) || [];

  const newLesson = {
    id: lessons.length + 1,
    title,
    grade,
    content,
    createdAt: new Date().toISOString(),
  };

  lessons.push(newLesson);
  localStorage.setItem("lessons", JSON.stringify(lessons));

  alert("Tạo bài giảng thành công!");
  lectureForm.reset();
  lectureSection.style.display = "none";
  typeSelect.value = "";
});


exerciseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("exercise-title").value.trim();
  const grade = document.getElementById("class-select").value;
  const deadline = document.getElementById("deadline").value;

  const questionEls = document.querySelectorAll(".exercise-item");
  const questions = [];

  questionEls.forEach((el, index) => {
    const question = el.querySelector(".exercise-question").value.trim();
    const answer = el.querySelector(".correct-answer").value.trim();
    const points = parseFloat(el.querySelector(".exercise-points").value);

    if (question && answer && !isNaN(points)) {
      questions.push({
        id: index + 1,
        question,
        answer,
        points
      });
    }
  });

  if (!title || !grade || !deadline || questions.length === 0) {
    alert("Vui lòng điền đầy đủ thông tin và ít nhất một câu hỏi.");
    return;
  }

  const exercises = JSON.parse(localStorage.getItem("exercises")) || [];

  const newExercise = {
    id: exercises.length + 1,
    title,
    grade,
    deadline,
    createdAt: new Date().toISOString(),
    questions,
  };

  exercises.push(newExercise);
  localStorage.setItem("exercises", JSON.stringify(exercises));

  alert("Lưu bài tập thành công!");
  exerciseForm.reset();
  exercisesContainer.innerHTML = "";
  addButton.click(); 
  exerciseSection.style.display = "none";
  typeSelect.value = "";
});



addButton.addEventListener("click", () => {
  const count = exercisesContainer.querySelectorAll(".exercise-item").length + 1;

  const div = document.createElement("div");
  div.classList.add("exercise-item");
  div.innerHTML = `
    <hr>
    <div class="form-group">
      <label>Câu hỏi ${count}</label>
      <textarea class="form-control exercise-question" name="question-${count}" rows="3" placeholder="Nhập câu hỏi" required></textarea>
    </div>
    <div class="form-group">
      <label>Đáp án đúng</label>
      <input type="text" class="form-control correct-answer" name="answer-${count}" placeholder="Nhập đáp án đúng" required>
    </div>
    <div class="form-group">
      <label>Điểm số</label>
      <input type="number" class="form-control exercise-points" name="points-${count}" placeholder="Nhập điểm số" min="1" required>
    </div>
  `;

  exercisesContainer.appendChild(div);
});
