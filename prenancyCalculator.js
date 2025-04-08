document.getElementById('calculate').addEventListener('click', function() {
    const lmpInput = document.getElementById('lmp').value;
    if (!lmpInput) {
        alert('Please enter a valid date.');
        return;
    }

    const lmpDate = new Date(lmpInput);
    const dueDate = new Date(lmpDate);
    dueDate.setDate(lmpDate.getDate() + 280); // 280 days = 40 weeks

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDueDate = dueDate.toLocaleDateString(undefined, options);

    document.getElementById('result').innerText = `Your estimated due date is: ${formattedDueDate}`;
});