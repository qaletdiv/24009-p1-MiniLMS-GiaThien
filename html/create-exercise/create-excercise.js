function signOut() {
  localStorage.removeItem('currentUser');
  window.location.href = "../signIn/signIn.html";
}


  const form = document.getElementById("exercise-form");
  const exercisesContainer = document.getElementById("exercises-container");
  const addButton = document.getElementById("add-exercise");

  
  addButton.addEventListener("click", () => {
    const count = exercisesContainer.querySelectorAll(".exercise-item").length + 1;

    const div = document.createElement("div");
    div.classList.add("exercise-item");
    div.innerHTML = `
      <hr>
      <div class="form-group">
          <label>Câu hỏi ${count}</label>
          <textarea class="form-control exercise-question" rows="3" placeholder="Nhập câu hỏi" required></textarea>
      </div>
      <div class="form-group">
          <label>Đáp án đúng</label>
          <input type="text" class="form-control correct-answer" placeholder="Nhập đáp án đúng" required>
      </div>
      <div class="form-group">
          <label>Điểm số</label>
          <input type="number" class="form-control exercise-points" placeholder="Nhập điểm số" min="1" required>
      </div>
    `;
    exercisesContainer.appendChild(div);
  });

  
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("exercise-title").value.trim();
    const grade = document.getElementById("class-select").value;
    const questionEls = document.querySelectorAll(".exercise-item");

    const questions = [];

    questionEls.forEach((el) => {
      const question = el.querySelector(".exercise-question").value.trim();
      const answer = el.querySelector(".correct-answer").value.trim();
      const points = parseFloat(el.querySelector(".exercise-points").value);

      if (question && answer && !isNaN(points)) {
        questions.push({ question, answer, points });
      }
    });

    if (questions.length === 0) {
      alert("Bạn cần nhập ít nhất một câu hỏi hợp lệ.");
      return;
    }

    const newExercise = {
      title,
      grade,
      createdAt: new Date().toISOString(),
      questions,
    };

    const existing = JSON.parse(localStorage.getItem("exercises")) || [];
    existing.push(newExercise);
    localStorage.setItem("exercises", JSON.stringify(existing));

    alert("Lưu bài tập thành công!");
    form.reset();
    exercisesContainer.innerHTML = ""; // xóa hết câu hỏi
    addButton.click(); // thêm câu hỏi đầu tiên mới
  });

