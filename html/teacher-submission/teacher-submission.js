function toTeacherDashboard() {
    window.location.href = "../teacher-dashboard/teacher-dashboard.html";
}
document.addEventListener("DOMContentLoaded", () => {
    const submissions = JSON.parse(localStorage.getItem("submittedExercises")) || [];
    const container = document.getElementById("submission-box");

    if (submissions.length === 0) {
        container.innerHTML += "<p>Chưa có bài nào được nộp.</p>";
        return;
    }

    submissions.forEach((sub, idx) => {
        const div = document.createElement("div");
        div.classList.add("submission");

        div.innerHTML = `
      <h3>${idx + 1}. ${sub.exerciseTitle}</h3>
      <p><strong>Học sinh:</strong> ${sub.student}</p>
      <p><strong>Ngày nộp:</strong> ${new Date(sub.submittedAt).toLocaleString()}</p>
      <form id="form-${idx}"></form>
    `;

        const form = div.querySelector(`#form-${idx}`);
        sub.answers.forEach((ans, i) => {
            const item = document.createElement("div");
            item.innerHTML = `
        <p><strong>Câu ${i + 1}:</strong> ${ans.question}</p>
        <p>Học sinh trả lời: ${ans.studentAnswer}</p>
        <label>Đáp án đúng:</label><br>
        <textarea name="correct${i}" class="resizable-textarea" rows="2">${ans.correctAnswer}</textarea><br>

        <label>Điểm: <input type="number" min="0" max="${ans.points}" value="${ans.score}" name="score${i}" /></label>
        <hr>
      `;
            form.appendChild(item);
        });

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Lưu chấm điểm";
        saveBtn.classList.add("btn-save");
        saveBtn.type = "button";

        saveBtn.onclick = () => {
            let newTotal = 0;

            sub.answers.forEach((ans, i) => {
                const correctInput = form.querySelector(`input[name=correct${i}]`);
                const scoreInput = form.querySelector(`input[name=score${i}]`);

                const newCorrect = correctInput.value.trim();
                const newScore = parseFloat(scoreInput.value) || 0;

                ans.correctAnswer = newCorrect;
                ans.score = newScore;
                ans.isCorrect = ans.studentAnswer.trim().toLowerCase() === newCorrect.toLowerCase();

                newTotal += newScore;
            });

            sub.totalScore = newTotal;

            const allSubs = JSON.parse(localStorage.getItem("submittedExercises")) || [];
            allSubs[idx] = sub;
            localStorage.setItem("submittedExercises", JSON.stringify(allSubs));

            alert("✅ Đã lưu chấm điểm và cập nhật đáp án đúng!");
        };

        form.appendChild(saveBtn);
        container.appendChild(div);
    });
});
