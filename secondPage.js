document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "first.html";
});

const params = new URLSearchParams(window.location.search);
const district = params.get("district");

const mainTitle = document.querySelector(".title-main");
const subTitle = document.querySelector(".title-sub");
const chartCanvas = document.getElementById("earnings-chart");
const chartContainer = document.getElementById("chart-container");
const yearSlider = document.getElementById("year-slider");
const yearSliderValue = document.getElementById("year-slider-value");



// globals for the chart (set after Calculate is clicked)
let currentStartYear = null;
let currentLanesForChart = [];
let sliderAnimationId = null;
let prevValues = null;
let currentValues = null;
let animFrame = null;
let animStartTime = null;
let hoveredBarIndex = -1;
let lastChartLabels = [];
let lastChartValues = [];
let barHitboxes = [];

if (chartCanvas) {
    chartCanvas.style.cursor = "pointer";

    chartCanvas.addEventListener("click", (e) => {
        const rect = chartCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const hit = barHitboxes.find(b =>
            clickX >= b.x &&
            clickX <= b.x + b.width &&
            clickY >= b.y &&
            clickY <= b.y + b.height
        );

        if (!hit) return;

        const text = formatCurrency(hit.value);

        navigator.clipboard.writeText(text).then(() => {
            console.log("Copied:", text);
        }).catch(() => {
            // fallback for older browsers
            const t = document.createElement("textarea");
            t.value = text;
            t.style.position = "fixed";
            t.style.left = "-9999px";
            document.body.appendChild(t);
            t.select();
            document.execCommand("copy");
            document.body.removeChild(t);
        });
    });
}




if (district) {
    const words = district.split(" ");
    if (words.length > 3) {
        const mid = Math.ceil(words.length / 2);
        mainTitle.textContent = words.slice(0, mid).join(" ");
        subTitle.textContent = words.slice(mid).join(" ");
    } else {
        mainTitle.textContent = district;
        subTitle.textContent = "";
    }
}

const table = document.getElementById("salary-table");
const tableWrapper = document.getElementById("table-wrapper");
const buttonRow = document.getElementById("button-row");
const calculator = document.getElementById("calculator");

const YEAR_RANGES = [
    "1-2", "3", "4-5", "6", "7", "8", "9", "10",
    "11-13", "14", "15", "16", "17", "18", "19"
];

const SALARY_DATA = [
    { step: 1, years: "1-2",  B: 55050, B24: 56732, M: 59784, M15: 61284, M30: 62784, M45: 64284, M60: 65784 },
    { step: 2, years: "3",    B: 56150, B24: 58507, M: 61814, M15: 63314, M30: 64814, M45: 66314, M60: 67814 },
    { step: 3, years: "4-5",  B: 57250, B24: 60282, M: 63844, M15: 65344, M30: 66844, M45: 68344, M60: 69844 },
    { step: 4, years: "6",    B: 58350, B24: 62057, M: 65874, M15: 67374, M30: 68874, M45: 70374, M60: 71874 },
    { step: 5, years: "7",    B: 59450, B24: 63832, M: 67904, M15: 69404, M30: 70904, M45: 72404, M60: 73904 },
    { step: 6, years: "8",    B: 60550, B24: 65607, M: 69934, M15: 71434, M30: 72934, M45: 74434, M60: 75934 },
    { step: 7, years: "9",    B: 60550, B24: 67382, M: 71964, M15: 73464, M30: 74964, M45: 76464, M60: 77964 },
    { step: 8, years: "10",   B: 60550, B24: 69157, M: 73994, M15: 75494, M30: 76994, M45: 78494, M60: 79994 },
    { step: 9, years: "11-13",B: 60550, B24: 70932, M: 76024, M15: 77524, M30: 79024, M45: 80524, M60: 82024 },
    { step:10, years: "14",   B: 60550, B24: 72707, M: 78054, M15: 79554, M30: 81054, M45: 82554, M60: 84054 },
    { step:11, years: "15",   B: 60550, B24: 74482, M: 80084, M15: 81584, M30: 83084, M45: 84584, M60: 86084 },
    { step:12, years: "16",   B: 60550, B24: 76257, M: 82114, M15: 83614, M30: 85114, M45: 86614, M60: 88114 },
    { step:13, years: "17",   B: 60550, B24: 78032, M: 84144, M15: 85644, M30: 87144, M45: 88644, M60: 90144 },
    { step:14, years: "18",   B: 60550, B24: 79807, M: 86174, M15: 87674, M30: 89174, M45: 90674, M60: 92174 },
    { step:15, years: "19",   B: 60550, B24: 81582, M: 88204, M15: 89704, M30: 91204, M45: 92704, M60: 94204 }
];

const LANES = [
    { key: "B",   label: "B"     },
    { key: "B24", label: "B+24"  },
    { key: "M",   label: "M"     },
    { key: "M15", label: "M+15"  },
    { key: "M30", label: "M+30"  },
    { key: "M45", label: "M+45"  },
    { key: "M60", label: "M+60"  }
];

function formatCurrency(n) {
    return n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });
}

function yearToStep(year) {
    for (let i = 0; i < YEAR_RANGES.length; i++) {
        const label = YEAR_RANGES[i];
        if (label.includes("-")) {
            const parts = label.split("-");
            const start = parseInt(parts[0], 10);
            const end = parseInt(parts[1], 10);
            if (year >= start && year <= end) return i + 1;
        } else {
            const single = parseInt(label, 10);
            if (year === single) return i + 1;
        }
    }
    return YEAR_RANGES.length;
}

function getSalaryForYearAndLane(year, laneKey) {
    const stepNum = yearToStep(year);
    const index = Math.min(stepNum - 1, SALARY_DATA.length - 1);
    return SALARY_DATA[index][laneKey];
}

function sumForLane(startYear, numYears, laneKey) {
    let total = 0;
    for (let i = 0; i < numYears; i++) {
        const year = startYear + i;
        total += getSalaryForYearAndLane(year, laneKey);
    }
    return total;
}

function getUserLaneKey(degree, credits) {
    const c = Number(credits) || 0;
    if (degree === "bachelors") {
        if (c < 24) return "B";
        return "B24";
    }
    if (degree === "masters") {
        if (c < 15) return "M";
        if (c < 30) return "M15";
        if (c < 45) return "M30";
        if (c < 60) return "M45";
        return "M60";
    }
    return "B";
}

if (district === "SOUTH WESTERN SCHOOL DISTRICT YORK COUNTY") {
    buttonRow.style.display = "flex";
    tableWrapper.style.display = "flex";
    calculator.style.display = "block";
    buildTable(table);

    const buttons = Array.from(document.querySelectorAll("#button-row button"));
    buttons[0].classList.add("active");

    buttons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (index === 0) {
                tableWrapper.style.display = "flex";
                calculator.style.display = "block";
            } else {
                tableWrapper.style.display = "none";
                calculator.style.display = "none";
            }
        });
    });
} else {
    buttonRow.style.display = "none";
    tableWrapper.style.display = "none";
    calculator.style.display = "none";
}

function buildTable(tableElement) {
    const cols = 9;
    tableElement.innerHTML = "";

    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("td");
    headerCell.colSpan = cols;
    headerCell.className = "full-width-header";
    headerCell.textContent = "2023-2024 Salary Schedule (4.00%)";
    headerRow.appendChild(headerCell);
    tableElement.appendChild(headerRow);

    const columnLabels = ["Step", "Years", "B", "B+24", "M", "M+15", "M+30", "M+45", "M+60"];
    const labelRow = document.createElement("tr");
    columnLabels.forEach(text => {
        const td = document.createElement("td");
        td.textContent = text;
        labelRow.appendChild(td);
    });
    tableElement.appendChild(labelRow);

    SALARY_DATA.forEach(row => {
        const tr = document.createElement("tr");

        const stepCell = document.createElement("td");
        stepCell.textContent = row.step;
        tr.appendChild(stepCell);

        const yearsCell = document.createElement("td");
        yearsCell.textContent = row.years;
        tr.appendChild(yearsCell);

        LANES.forEach(lane => {
            const td = document.createElement("td");
            td.textContent = formatCurrency(row[lane.key]);
            tr.appendChild(td);
        });

        tableElement.appendChild(tr);
    });
}

const yearInput = document.getElementById("calc-step");
const creditInput = document.getElementById("calc-credits");
const calcBtn = document.getElementById("calc-btn");
const result = document.getElementById("calc-result");
const degreeInputs = document.querySelectorAll("input[name='degree']");

if (yearInput) {
    yearInput.addEventListener("input", () => {
        const value = parseInt(yearInput.value, 10);
        if (!Number.isNaN(value) && (value < 1 || value > 19)) {
            alert("Year must be between 1 and 19.");
            yearInput.value = "";
        }
    });
}

function validateCalculator() {
    const degreeSelected = Array.from(degreeInputs).some(r => r.checked);

    // Year must be a number between 1 and 19
    const yearStr = yearInput.value.trim();
    const year = Number(yearStr);
    const yearValid =
        /^\d+$/.test(yearStr) &&   // only digits
        year >= 1 &&
        year <= 19;

    // Credits must be a *positive integer* (1, 2, 3, ...)
    const creditsStr = creditInput.value.trim();
    const credits = Number(creditsStr);
    const creditsValid =
        /^\d+$/.test(creditsStr) &&  // only digits, no letters/decimals
        credits > 0;                 // positive

    if (degreeSelected && yearValid && creditsValid) {
        calcBtn.disabled = false;
        calcBtn.classList.add("enabled");
    } else {
        calcBtn.disabled = true;
        calcBtn.classList.remove("enabled");
    }
}



degreeInputs.forEach(r => r.addEventListener("change", validateCalculator));
yearInput.addEventListener("input", validateCalculator);
creditInput.addEventListener("input", validateCalculator);

// keep slider label in sync on load
if (yearSlider && yearSliderValue) {
    yearSliderValue.textContent = yearSlider.value;
}

calcBtn.addEventListener("click", () => {
    if (calcBtn.disabled) return;

    const startYear = Number(yearInput.value);

    const selectedDegreeInput = Array.from(degreeInputs).find(r => r.checked);
    const selectedDegree = selectedDegreeInput ? selectedDegreeInput.value : "bachelors";
    const credits = Number(creditInput.value) || 0;
    const userLaneKey = getUserLaneKey(selectedDegree, credits);

    const startIndex = LANES.findIndex(l => l.key === userLaneKey);
    const lanesToShow = startIndex === -1 ? LANES : LANES.slice(startIndex);

    // ---------- BUILD HTML TABLE ----------
    const horizons = [1, 5, 10, 20, 30];

    let html = `
        <div class="calc-result-title">
            Earnings starting at Year ${startYear}
        </div>
        <div class="calc-result-wrapper">
            <table class="calc-result-table">
                <tr>
                    <th>Lane</th>
                    ${horizons.map(h => `<th>${h === 1 ? "1 Year" : h + " Years"}</th>`).join("")}
                </tr>
    `;

    lanesToShow.forEach(lane => {
        html += `<tr><td>${lane.label}</td>`;
        horizons.forEach(h => {
            const total = h === 1
                ? getSalaryForYearAndLane(startYear, lane.key)
                : sumForLane(startYear, h, lane.key);
            html += `<td>${formatCurrency(total)}</td>`;
        });
        html += `</tr>`;
    });

    html += `
            </table>
        </div>
    `;

    result.innerHTML = html;

    result.classList.remove("visible");
    void result.offsetWidth; // force reflow so animation can restart
    result.classList.add("visible");

    // store for the slider-driven chart
    currentStartYear = startYear;
    currentLanesForChart = lanesToShow;

    // show chart & draw using current slider value
    chartContainer.classList.remove("visible");
    void chartContainer.offsetWidth; // allow animation to restart
    chartContainer.classList.add("visible");
    updateChartFromSlider();
});


// slider changes -> redraw chart
if (yearSlider) {
    // while dragging: update text + redraw instantly (no tween)
    yearSlider.addEventListener("input", () => {
        if (yearSliderValue) {
            yearSliderValue.textContent = yearSlider.value;
        }

        if (sliderAnimationId !== null) {
            cancelAnimationFrame(sliderAnimationId);
        }

        sliderAnimationId = requestAnimationFrame(() => {
            sliderAnimationId = null;
            updateChartFromSlider(false); // ⬅️ no animation while sliding
        });
    });

    // when user releases the thumb: optional smooth tween to final value
    yearSlider.addEventListener("change", () => {
        updateChartFromSlider(true); // ⬅️ animate once at the end
    });
}




function updateChartFromSlider() {
    if (!currentStartYear || !currentLanesForChart.length || !yearSlider) return;

    const numYears = Number(yearSlider.value) || 1;

    const newValues = currentLanesForChart.map(l =>
        numYears === 1
            ? getSalaryForYearAndLane(currentStartYear, l.key)
            : sumForLane(currentStartYear, numYears, l.key)
    );

    // Initialize prevValues on first run
    if (!prevValues) {
        prevValues = newValues;
        currentValues = newValues;
        drawEarningsChart(currentLanesForChart.map(l => l.label), newValues);
        return;
    }

    // Cancel any existing animation
    if (animFrame) cancelAnimationFrame(animFrame);

    const startValues = currentValues.slice();
    animStartTime = performance.now();
    const DURATION = 300; // 300ms = super smooth

    function animate(now) {
        const progress = Math.min((now - animStartTime) / DURATION, 1);

        // Ease-out curve: fast at start, smooth at end
        const eased = 1 - Math.pow(1 - progress, 3);

        currentValues = startValues.map((start, i) =>
            start + (newValues[i] - start) * eased
        );

        drawEarningsChart(currentLanesForChart.map(l => l.label), currentValues);

        if (progress < 1) {
            animFrame = requestAnimationFrame(animate);
        } else {
            // Finish cleanly
            currentValues = newValues;
            prevValues = newValues;
        }
    }

    animFrame = requestAnimationFrame(animate);
}


function ensureChartSize() {
    if (!chartCanvas || !chartContainer) return 1;

    const dpr = window.devicePixelRatio || 1;

    // Keep the chart itself at a fixed logical size
    const displayWidth = 720;   // chart width (same as before)
    const displayHeight = 550;  // chart height

    const neededWidth = Math.floor(displayWidth * dpr);
    const neededHeight = Math.floor(displayHeight * dpr);

    if (chartCanvas.width !== neededWidth || chartCanvas.height !== neededHeight) {
        chartCanvas.width = neededWidth;
        chartCanvas.height = neededHeight;
    }

    return dpr;
}


// Single-series bar chart: one bar per lane
function drawEarningsChart(labels, values) {
    if (!chartCanvas || !labels.length || !values.length) return;

    const dpr = ensureChartSize();
    const ctx = chartCanvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = chartCanvas.width / dpr;
    const h = chartCanvas.height / dpr;

    ctx.clearRect(0, 0, w, h);

    // ---- LAYOUT (SHIFT CHART LEFT) ----
    const paddingLeft   = 80;   // reduced from 120
    const paddingRight  = 85;   // increased from 45
    const titleY        = 30;
    const paddingTop    = 80;
    const paddingBottom = 50;

    const usableW = w - paddingLeft - paddingRight;
    const usableH = h - paddingTop - paddingBottom;

    // right end of x-axis + grid lines (the little extension you liked)
    const xAxisRight = w - 60;

    // ---- FIXED Y RANGE ----
    const minVal = 0;
    const maxVal = 3000000;
    const range  = maxVal - minVal || 1;

    function yPos(v) {
        return paddingTop + usableH - (usableH * (v - minVal)) / range;
    }

    // ---- HORIZONTAL GRID LINES + Y-AXIS LABELS ----
    const gridValues = [500000, 1000000, 1500000, 2000000, 2500000];

    ctx.strokeStyle = "rgba(0,0,0,0.10)";
    ctx.lineWidth = 1;
    ctx.font = "12px Georgia, serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    gridValues.forEach(v => {
        if (v >= minVal && v <= maxVal) {
            const y = yPos(v);

            // faint line
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(xAxisRight, y);
            ctx.stroke();

            // label (e.g. $500,000) just to the left of the y-axis
            const label = formatCurrency(v);
            ctx.fillText(label, paddingLeft - 10, y);
        }
    });

    const groupStep = usableW / labels.length;
    const barWidth = groupStep * 0.6;

    // extra space between y-axis and first bar
    function xCenter(i) {
        return paddingLeft + 10 + groupStep * (i + 0.5);
    }

    const baseY = yPos(0);

    // ---- BARS ----
    const barColors = [
        "#5e32a899",
        "#f2dc6f99",
        "#9132a899",
        "#facd0799",
        "#a8329c99",
        "#e3de4d99",
        "#a8326f99"
    ];

    barHitboxes = [];

    labels.forEach((_, i) => {
        const value = values[i];
        const xC = xCenter(i);
        const x = xC - barWidth / 2;
        const topY = yPos(value);

        const barBottom = baseY;
        const height = Math.max(0, barBottom - topY);

        ctx.fillStyle = barColors[i % barColors.length];
        ctx.beginPath();
        ctx.rect(x, topY, barWidth, height);
        ctx.fill();

        barHitboxes.push({
            x: x,
            y: topY - 25,
            width: barWidth,
            height: height + 40,
            value: Math.round(value)
        });
    });

    // ---- VALUE LABELS ABOVE BARS ----
    ctx.fillStyle = "#000";
    ctx.font = "14px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    values.forEach((val, i) => {
        const xC = xCenter(i);
        const topY = yPos(val);
        const text = formatCurrency(Math.round(val));
        const labelY = topY - 10;
        ctx.fillText(text, xC, labelY);
    });

    // ---- AXES ----
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, paddingTop);
    ctx.lineTo(paddingLeft, baseY);
    ctx.lineTo(xAxisRight, baseY);
    ctx.stroke();

    // ---- TITLE ----
    ctx.fillStyle = "#000";
    ctx.font = "bold 24px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const titleX = paddingLeft + usableW / 2;
    ctx.fillText("Total Earnings", titleX, titleY);

    // ---- X LABELS ----
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    ctx.font = "16px Georgia, serif";

    labels.forEach((lab, i) => {
        const x = xCenter(i);
        const y = h - paddingBottom + 20;
        const tw = ctx.measureText(lab).width;
        ctx.fillText(lab, x - tw / 2, y);
    });
}

validateCalculator();
