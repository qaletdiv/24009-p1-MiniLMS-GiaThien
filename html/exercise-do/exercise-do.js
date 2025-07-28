const params = new URLSearchParams(location.search);
    const id = parseInt(params.get("id"));

    const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
    const exercise = exercises.find(e => e.id === id);

    const form = document.getElementById("exercise-form");
    const titleEl = document.getElementById("exercise-title");

    if (!exercise) {
      form.innerHTML = "<p>Không tìm thấy bài tập.</p>";
    } else {
      titleEl.textContent = exercise.title;

      exercise.questions.forEach((q, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <label>Câu ${index + 1}: ${q.question}</label><br>
          <input type="text" name="answer-${index}" required placeholder="Nhập câu trả lời"><br><br>
        `;
        form.appendChild(div);
      });

      const submitBtn = document.createElement("button");
      submitBtn.type = "submit";
      submitBtn.textContent = "Nộp bài";
      submitBtn.className="btn"
      form.appendChild(submitBtn);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      let total = 0;
      const answers = [];

      exercise.questions.forEach((q, index) => {
        const userAnswer = formData.get(`answer-${index}`).trim();
        const isCorrect = userAnswer.toLowerCase() === q.answer.toLowerCase();
        if (isCorrect) total += q.points;
        answers.push({ question: q.question, userAnswer, correctAnswer: q.answer, isCorrect, points: q.points });
      });

      const submission = { 
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        totalScore: total,
        maxScore: exercise.questions.reduce((sum, q) => sum + q.points, 0),
        answers,
        submittedAt: new Date().toISOString()
      };

      const allSubmissions = JSON.parse(localStorage.getItem("submittedExercises")) || [];
      allSubmissions.push(submission);
      localStorage.setItem("submittedExercises", JSON.stringify(allSubmissions));

      alert("Đã nộp bài thành công!");
      window.location.href = `../exercise-result/exercise-result.html?id=${exercise.id}`;
    });