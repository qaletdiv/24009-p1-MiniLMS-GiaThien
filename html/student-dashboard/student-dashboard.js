function signOut() {
  localStorage.removeItem('currentUser');
  window.location.href = "../signIn/signIn.html";
}

window.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
 

  const grade = currentUser.grade;
  const lessonList = document.getElementById('lesson-list');
  const exerciseList = document.getElementById('exercise-list');

  const lessons = JSON.parse(localStorage.getItem('lessons')) || [];
  const exercises = JSON.parse(localStorage.getItem('exercises')) || [];

  const lessonsForStudent = lessons.filter(lesson => lesson.grade == grade);
  const exercisesForStudent = exercises.filter(ex => ex.grade == grade);

  
  if (lessonsForStudent.length === 0) {
    lessonList.innerHTML = "<li>Chưa có bài giảng nào cho lớp của bạn.</li>";
  } else {
    lessonsForStudent.forEach((lesson, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${index + 1}. ${lesson.title}</strong>
        <button class="btn-show" onclick="toggleLesson(${index})">Xem</button>
        <div id="lesson-content-${index}" class="lesson-content" style="display: none;"></div>
      `;
      lessonList.appendChild(li);
    });
  }

  
  if (exercisesForStudent.length === 0) {
    exerciseList.innerHTML = "<li>Chưa có bài tập nào cho lớp của bạn.</li>";
    return;
  }

  exercisesForStudent.forEach((exercise, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${index + 1}. ${exercise.title}</strong> - Số câu hỏi: ${exercise.questions.length}<br>
      <small>Tạo lúc: ${new Date(exercise.createdAt).toLocaleString()}</small>
      <button class="btn-show" onclick="showExercise(${index})">Làm bài</button>
      <div id="exercise-${index}" class="exercise-form-container" style="display:none;"></div>
    `;
    exerciseList.appendChild(li);
  });

  window.toggleLesson = function(index) {
    const contentDiv = document.getElementById(`lesson-content-${index}`);
    const button = contentDiv.previousElementSibling;
    const lesson = lessonsForStudent[index];

    if (contentDiv.style.display === "block") {
      contentDiv.style.display = "none";
      button.textContent = "Xem";
      return;
    }

    contentDiv.innerHTML = `
      <p><strong>Nội dung:</strong></p>
      <p>${lesson.content}</p>
    `;
    contentDiv.style.display = "block";
    button.textContent = "Ẩn";
  };

  window.showExercise = function(index) {
    const container = document.getElementById(`exercise-${index}`);
    if (container.style.display === "block") {
      container.style.display = "none";
      container.innerHTML = "";
      return;
    }

    const exercise = exercisesForStudent[index];

    container.innerHTML = "";

    exercise.questions.forEach((q, i) => {
      const div = document.createElement('div');
      div.classList.add('question-box');
      div.innerHTML = `
        <p><strong>Câu ${i + 1}:</strong> ${q.question}</p>
        <input type="text" class="student-answer" placeholder="Nhập câu trả lời của bạn" data-index="${i}">
      `;
      container.appendChild(div);
    });

    const submitBtn = document.createElement('button');
    submitBtn.textContent = "Nộp bài";
    submitBtn.classList.add('btn-submit');

    submitBtn.onclick = function () {
      const answers = Array.from(container.querySelectorAll('.student-answer')).map(input => input.value.trim());

      if (answers.some(ans => ans === "")) {
        alert("Vui lòng điền đầy đủ tất cả câu trả lời!");
        return;
      }

      let totalScore = 0;
      let maxScore = 0;
      const detailedResults = [];

      exercise.questions.forEach((q, i) => {
        const correctAnswer = q.answer.trim().toLowerCase();
        const studentAnswer = answers[i].trim().toLowerCase();
        const isCorrect = studentAnswer === correctAnswer;
        const score = isCorrect ? q.points : 0;

        totalScore += score;
        maxScore += q.points;

        detailedResults.push({
          question: q.question,
          correctAnswer: q.answer,
          studentAnswer: answers[i],
          isCorrect,
          score
        });
      });

      const result = {
        student: currentUser.username,
        grade: currentUser.grade,
        exerciseTitle: exercise.title,
        submittedAt: new Date().toISOString(),
        answers: detailedResults,
        totalScore,
        maxScore
      };

      const submitted = JSON.parse(localStorage.getItem('submittedExercises')) || [];
      submitted.push(result);
      localStorage.setItem('submittedExercises', JSON.stringify(submitted));

      alert(`Nộp bài thành công!\nĐiểm của bạn: ${totalScore}/${maxScore}`);
      container.style.display = "none";
      container.innerHTML = "";
    };

    container.appendChild(submitBtn);
    container.style.display = "block";
  };
});
