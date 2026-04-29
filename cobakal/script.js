const mainDisplay = document.getElementById('mainDisplay');
const historyDisplay = document.getElementById('history');
const buttons = document.querySelectorAll('.number, .operator');
const clearBtn = document.getElementById('clear');
const deleteBtn = document.getElementById('delete');
const equalsBtn = document.getElementById('equals');

let currentInput = "";
let isFinished = false;

// Fungsi update layar
function updateScreen(value) {
    mainDisplay.innerText = value || "0";
}

// Event untuk angka dan operator
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');

        if (isFinished) {
            // Jika baru selesai hitung, dan tekan angka, reset layar
            if (!isNaN(val)) {
                currentInput = val;
            } else {
                currentInput += val;
            }
            isFinished = false;
        } else {
            currentInput += val;
        }
        updateScreen(currentInput);
    });
});

// Tombol Clear
clearBtn.addEventListener('click', () => {
    currentInput = "";
    historyDisplay.innerText = "";
    updateScreen("0");
});

// Tombol Delete
deleteBtn.addEventListener('click', () => {
    currentInput = currentInput.toString().slice(0, -1);
    updateScreen(currentInput);
});

// Logika Kalkulasi
equalsBtn.addEventListener('click', () => {
    if (!currentInput) return;

    // FITUR KHUSUS: 1/0
    if (currentInput === "1/0") {
        updateScreen("infinity");
        historyDisplay.innerText = "";
        currentInput = "";
        isFinished = true;
        return;
    }

    try {
        historyDisplay.innerText = currentInput;
        // Menggunakan Function constructor sebagai alternatif eval yang sedikit lebih aman
        let result = new Function('return ' + currentInput)();
        
        // Batasi desimal agar tidak terlalu panjang
        if (result % 1 !== 0) result = result.toFixed(4);
        
        updateScreen(result);
        currentInput = result.toString();
        isFinished = true;
    } catch (e) {
        updateScreen("Error");
        currentInput = "";
    }
});