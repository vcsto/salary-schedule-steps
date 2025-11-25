document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "index.html";
});

const params = new URLSearchParams(window.location.search);
const district = params.get("district");

const mainTitle = document.querySelector(".title-main");
const subTitle = document.querySelector(".title-sub");
const chartCanvas = document.getElementById("earnings-chart");
const chartContainer = document.getElementById("chart-container");
const yearSlider = document.getElementById("year-slider");
const yearSliderValue = document.getElementById("year-slider-value");

const table = document.getElementById("salary-table");
const tableWrapper = document.getElementById("table-wrapper");
const buttonRow = document.getElementById("button-row");
const calculator = document.getElementById("calculator");

const yearInput = document.getElementById("calc-step");
const creditInput = document.getElementById("calc-credits");
const calcBtn = document.getElementById("calc-btn");
const result = document.getElementById("calc-result");
const degreeInputs = document.querySelectorAll("input[name='degree']");

const SCHEDULES = {
    "2023-2024": {
        title: "2023-2024 Salary Schedule (4.00%)",
        yearRanges: [
            "1-2", "3", "4-5", "6", "7", "8", "9", "10",
            "11-13", "14", "15", "16", "17", "18", "19"
        ],
        rows: [
            { step: 1,  years: "1-2",   B: 55050, B24: 56732, M: 59784, M15: 61284, M30: 62784, M45: 64284, M60: 65784 },
            { step: 2,  years: "3",     B: 56150, B24: 58507, M: 61814, M15: 63314, M30: 64814, M45: 66314, M60: 67814 },
            { step: 3,  years: "4-5",   B: 57250, B24: 60282, M: 63844, M15: 65344, M30: 66844, M45: 68344, M60: 69844 },
            { step: 4,  years: "6",     B: 58350, B24: 62057, M: 65874, M15: 67374, M30: 68874, M45: 70374, M60: 71874 },
            { step: 5,  years: "7",     B: 59450, B24: 63832, M: 67904, M15: 69404, M30: 70904, M45: 72404, M60: 73904 },
            { step: 6,  years: "8",     B: 60550, B24: 65607, M: 69934, M15: 71434, M30: 72934, M45: 74434, M60: 75934 },
            { step: 7,  years: "9",     B: 60550, B24: 67382, M: 71964, M15: 73464, M30: 74964, M45: 76464, M60: 77964 },
            { step: 8,  years: "10",    B: 60550, B24: 69157, M: 73994, M15: 75494, M30: 76994, M45: 78494, M60: 79994 },
            { step: 9,  years: "11-13", B: 60550, B24: 70932, M: 76024, M15: 77524, M30: 79024, M45: 80524, M60: 82024 },
            { step: 10, years: "14",    B: 60550, B24: 72707, M: 78054, M15: 79554, M30: 81054, M45: 82554, M60: 84054 },
            { step: 11, years: "15",    B: 60550, B24: 74482, M: 80084, M15: 81584, M30: 83084, M45: 84584, M60: 86084 },
            { step: 12, years: "16",    B: 60550, B24: 76257, M: 82114, M15: 83614, M30: 85114, M45: 86614, M60: 88114 },
            { step: 13, years: "17",    B: 60550, B24: 78032, M: 84144, M15: 85644, M30: 87144, M45: 88644, M60: 90144 },
            { step: 14, years: "18",    B: 60550, B24: 79807, M: 86174, M15: 87674, M30: 89174, M45: 90674, M60: 92174 },
            { step: 15, years: "19",    B: 60550, B24: 81582, M: 88204, M15: 89704, M30: 91204, M45: 92704, M60: 94204 }
        ]
    },

    "2024-2025": {
        title: "2024-2025 Salary Schedule (3.75%)",
        yearRanges: [
            "1", "2-3", "4", "5-6", "7",
            "8", "9", "10", "11", "12-14",
            "15", "16", "17", "18", "19"
        ],
        rows: [
            { step: 1,  years: "1",     B: 56933, B24: 58615, M: 61667, M15: 63167, M30: 64667, M45: 66167, M60: 67667 },
            { step: 2,  years: "2-3",   B: 58033, B24: 60390, M: 63697, M15: 65197, M30: 66697, M45: 68197, M60: 69697 },
            { step: 3,  years: "4",     B: 59133, B24: 62165, M: 65727, M15: 67227, M30: 68727, M45: 70227, M60: 71727 },
            { step: 4,  years: "5-6",   B: 60233, B24: 63940, M: 67757, M15: 69257, M30: 70757, M45: 72257, M60: 73757 },
            { step: 5,  years: "7",     B: 61333, B24: 65715, M: 69787, M15: 71287, M30: 72787, M45: 74287, M60: 75787 },
            { step: 6,  years: "8",     B: 62433, B24: 67490, M: 71817, M15: 73317, M30: 74817, M45: 76317, M60: 77817 },
            { step: 7,  years: "9",     B: 62433, B24: 69265, M: 73847, M15: 75347, M30: 76847, M45: 78347, M60: 79847 },
            { step: 8,  years: "10",    B: 62433, B24: 71040, M: 75877, M15: 77377, M30: 78877, M45: 80377, M60: 81877 },
            { step: 9,  years: "11",    B: 62433, B24: 72815, M: 77907, M15: 79407, M30: 80907, M45: 82407, M60: 83907 },
            { step: 10, years: "12-14", B: 62433, B24: 74590, M: 79937, M15: 81437, M30: 82937, M45: 84437, M60: 85937 },
            { step: 11, years: "15",    B: 62433, B24: 76365, M: 81967, M15: 83467, M30: 84967, M45: 86467, M60: 87967 },
            { step: 12, years: "16",    B: 62433, B24: 78140, M: 83997, M15: 85497, M30: 86997, M45: 88497, M60: 89997 },
            { step: 13, years: "17",    B: 62433, B24: 79915, M: 86027, M15: 87527, M30: 89027, M45: 90527, M60: 92027 },
            { step: 14, years: "18",    B: 62433, B24: 81690, M: 88057, M15: 89557, M30: 91057, M45: 92557, M60: 94057 },
            { step: 15, years: "19",    B: 62433, B24: 83465, M: 90087, M15: 91587, M30: 93087, M45: 94587, M60: 96087 }
        ]
    },

    "2025-2026": {
        title: "2025-2026 Salary Schedule (3.00%)",
        yearRanges: [
            "1", "2", "3-4", "5", "6-7",
            "8", "9", "10", "11", "12",
            "13-15", "16", "17", "18", "19"
        ],
        rows: [
            { step: 1,  years: "1",     B: 58416, B24: 60098, M: 63150, M15: 64650, M30: 66150, M45: 67650, M60: 69150 },
            { step: 2,  years: "2",     B: 59516, B24: 61873, M: 65180, M15: 66680, M30: 68180, M45: 69680, M60: 71180 },
            { step: 3,  years: "3-4",   B: 60616, B24: 63648, M: 67210, M15: 68710, M30: 70210, M45: 71710, M60: 73210 },
            { step: 4,  years: "5",     B: 61716, B24: 65423, M: 69240, M15: 70740, M30: 72240, M45: 73740, M60: 75240 },
            { step: 5,  years: "6-7",   B: 62816, B24: 67198, M: 71270, M15: 72770, M30: 74270, M45: 75770, M60: 77270 },
            { step: 6,  years: "8",     B: 63916, B24: 68973, M: 73300, M15: 74800, M30: 76300, M45: 77800, M60: 79300 },
            { step: 7,  years: "9",     B: 63916, B24: 70748, M: 75330, M15: 76830, M30: 78330, M45: 79830, M60: 81330 },
            { step: 8,  years: "10",    B: 63916, B24: 72523, M: 77360, M15: 78860, M30: 80360, M45: 81860, M60: 83360 },
            { step: 9,  years: "11",    B: 63916, B24: 74298, M: 79390, M15: 80890, M30: 82390, M45: 83890, M60: 85390 },
            { step: 10, years: "12",    B: 63916, B24: 76073, M: 81420, M15: 82920, M30: 84420, M45: 85920, M60: 87420 },
            { step: 11, years: "13-15", B: 63916, B24: 77848, M: 83450, M15: 84950, M30: 86450, M45: 87950, M60: 89450 },
            { step: 12, years: "16",    B: 63916, B24: 79623, M: 85480, M15: 86980, M30: 88480, M45: 89980, M60: 91480 },
            { step: 13, years: "17",    B: 63916, B24: 81398, M: 87510, M15: 89010, M30: 90510, M45: 92010, M60: 93510 },
            { step: 14, years: "18",    B: 63916, B24: 83173, M: 89540, M15: 91040, M30: 92540, M45: 94040, M60: 95540 },
            { step: 15, years: "19",    B: 63916, B24: 84948, M: 91570, M15: 93070, M30: 94570, M45: 96070, M60: 97570 }
        ]
    },

    "2026-2027": {
        title: "2026-2027 Salary Schedule (3.00%)",
        yearRanges: [
            "1", "2", "3", "4-5", "6",
            "7-8", "9", "10", "11", "12",
            "13", "14-16", "17", "18", "19"
        ],
        rows: [
            { step: 1,  years: "1",     B: 60058, B24: 61740, M: 64792, M15: 66292, M30: 67792, M45: 69292, M60: 70792 },
            { step: 2,  years: "2",     B: 61158, B24: 63515, M: 66822, M15: 68322, M30: 69822, M45: 71322, M60: 72822 },
            { step: 3,  years: "3",     B: 62258, B24: 65290, M: 68852, M15: 70352, M30: 71852, M45: 73352, M60: 74852 },
            { step: 4,  years: "4-5",   B: 63358, B24: 67065, M: 70882, M15: 72382, M30: 73882, M45: 75382, M60: 76882 },
            { step: 5,  years: "6",     B: 64458, B24: 68840, M: 72912, M15: 74412, M30: 75912, M45: 77412, M60: 78912 },
            { step: 6,  years: "7-8",   B: 65558, B24: 70615, M: 74942, M15: 76442, M30: 77942, M45: 79442, M60: 80942 },
            { step: 7,  years: "9",     B: 65558, B24: 72390, M: 76972, M15: 78472, M30: 79972, M45: 81472, M60: 82972 },
            { step: 8,  years: "10",    B: 65558, B24: 74165, M: 79002, M15: 80502, M30: 82002, M45: 83502, M60: 85002 },
            { step: 9,  years: "11",    B: 65558, B24: 75940, M: 81032, M15: 82532, M30: 84032, M45: 85532, M60: 87032 },
            { step: 10, years: "12",    B: 65558, B24: 77715, M: 83062, M15: 84562, M30: 86062, M45: 87562, M60: 89062 },
            { step: 11, years: "13",    B: 65558, B24: 79490, M: 85092, M15: 86592, M30: 88092, M45: 89592, M60: 91092 },
            { step: 12, years: "14-16", B: 65558, B24: 81265, M: 87122, M15: 88622, M30: 90122, M45: 91622, M60: 93122 },
            { step: 13, years: "17",    B: 65558, B24: 83040, M: 89152, M15: 90652, M30: 92152, M45: 93652, M60: 95152 },
            { step: 14, years: "18",    B: 65558, B24: 84815, M: 91182, M15: 92682, M30: 94182, M45: 95682, M60: 97182 },
            { step: 15, years: "19",    B: 65558, B24: 86590, M: 93212, M15: 94712, M30: 96212, M45: 97712, M60: 99212 }
        ]
    },

    "2027-2028": {
        title: "2027-2028 Salary Schedule (3.00%)",
        yearRanges: [
            "1", "2", "3", "4", "5-6", "7", "8-9", "10",
            "11", "12", "13", "14", "15-17", "18", "19"
        ],
        rows: [
            { step: 1,  years: "1",     B: 61912, B24: 63594, M: 66646, M15: 68146, M30: 69646, M45: 71146, M60: 72646 },
            { step: 2,  years: "2",     B: 63012, B24: 65369, M: 68676, M15: 70176, M30: 71676, M45: 73176, M60: 74676 },
            { step: 3,  years: "3",     B: 64112, B24: 67144, M: 70706, M15: 72206, M30: 73706, M45: 75206, M60: 76706 },
            { step: 4,  years: "4",     B: 65212, B24: 68919, M: 72736, M15: 74236, M30: 75736, M45: 77236, M60: 78736 },
            { step: 5,  years: "5-6",   B: 66312, B24: 70694, M: 74766, M15: 76266, M30: 77766, M45: 79266, M60: 80766 },
            { step: 6,  years: "7",     B: 67412, B24: 72469, M: 76796, M15: 78296, M30: 79796, M45: 81296, M60: 82796 },
            { step: 7,  years: "8-9",   B: 67412, B24: 74244, M: 78826, M15: 80326, M30: 81826, M45: 83326, M60: 84826 },
            { step: 8,  years: "10",    B: 67412, B24: 76019, M: 80856, M15: 82356, M30: 83856, M45: 85356, M60: 86856 },
            { step: 9,  years: "11",    B: 67412, B24: 77794, M: 82886, M15: 84386, M30: 85886, M45: 87386, M60: 88886 },
            { step: 10, years: "12",    B: 67412, B24: 79569, M: 84916, M15: 86416, M30: 87916, M45: 89416, M60: 90916 },
            { step: 11, years: "13",    B: 67412, B24: 81344, M: 86946, M15: 88446, M30: 89946, M45: 91446, M60: 92946 },
            { step: 12, years: "14",    B: 67412, B24: 83119, M: 88976, M15: 90476, M30: 91976, M45: 93476, M60: 94976 },
            { step: 13, years: "15-17", B: 67412, B24: 84894, M: 91006, M15: 92506, M30: 94006, M45: 95506, M60: 97006 },
            { step: 14, years: "18",    B: 67412, B24: 86669, M: 93036, M15: 94536, M30: 96036, M45: 97536, M60: 99036 },
            { step: 15, years: "19",    B: 67412, B24: 88444, M: 95066, M15: 96566, M30: 98066, M45: 99566, M60: 101066 }
        ]
    }
};

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

let activeScheduleKey = "2023-2024";

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

// 🔹 Use the active schedule's yearRanges to map year→step
function yearToStep(year) {
    const schedule = SCHEDULES[activeScheduleKey];
    const ranges = schedule.yearRanges;

    for (let i = 0; i < ranges.length; i++) {
        const label = ranges[i];
        if (label.includes("-")) {
            const [startStr, endStr] = label.split("-");
            const start = parseInt(startStr, 10);
            const end = parseInt(endStr, 10);
            if (year >= start && year <= end) return i + 1;
        } else {
            const single = parseInt(label, 10);
            if (year === single) return i + 1;
        }
    }

    return ranges.length;
}

function getSalaryForYearAndLane(year, laneKey) {
    const schedule = SCHEDULES[activeScheduleKey];
    const stepNum = yearToStep(year);
    const index = Math.min(stepNum - 1, schedule.rows.length - 1);
    return schedule.rows[index][laneKey];
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

    const buttons = Array.from(document.querySelectorAll("#button-row button"));
    if (buttons.length > 0) {
        activeScheduleKey = buttons[0].dataset.year;
        buttons[0].classList.add("active");
    }

    buildTable(table, activeScheduleKey);

    requestAnimationFrame(() => {
        tableWrapper.classList.add("visible");
        calculator.classList.add("visible");
    });

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            activeScheduleKey = btn.dataset.year;

            tableWrapper.classList.remove("visible");
            calculator.classList.remove("visible");
            void tableWrapper.offsetWidth; // force reflow
            buildTable(table, activeScheduleKey);
            tableWrapper.classList.add("visible");
            calculator.classList.add("visible");

            result.innerHTML = "";
            result.classList.remove("visible");
            chartContainer.classList.remove("visible");
            currentStartYear = null;
            currentLanesForChart = [];
            prevValues = null;
            currentValues = null;
        });
    });
} else {
    buttonRow.style.display = "none";
    tableWrapper.style.display = "none";
    calculator.style.display = "none";
}

function buildTable(tableElement, scheduleKey) {
    const schedule = SCHEDULES[scheduleKey];
    const rows = schedule.rows;

    const cols = 9;
    tableElement.innerHTML = "";

    const colGroup = document.createElement("colgroup");
    colGroup.innerHTML = `
        <col class="col-step">
        <col class="col-years">
        <col class="col-salary">
        <col class="col-salary">
        <col class="col-salary">
        <col class="col-salary">
        <col class="col-salary">
        <col class="col-salary">
        <col class="col-salary">
    `;
    tableElement.appendChild(colGroup);

    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("td");
    headerCell.colSpan = cols;
    headerCell.className = "full-width-header";
    headerCell.textContent = schedule.title;
    headerRow.appendChild(headerCell);
    tableElement.appendChild(headerRow);

    const columnLabels = ["Step", "Years", "B", "B+24", "M", "M+15", "M+30", "M+45", "M+60"];
    const labelRow = document.createElement("tr");
    labelRow.classList.add("degree-header-row");
    columnLabels.forEach(text => {
        const td = document.createElement("td");
        td.textContent = text;
        labelRow.appendChild(td);
    });
    tableElement.appendChild(labelRow);

    rows.forEach(row => {
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

    const yearStr = yearInput.value.trim();
    const year = Number(yearStr);
    const yearValid =
        /^\d+$/.test(yearStr) &&
        year >= 1 &&
        year <= 19;

    const creditsStr = creditInput.value.trim();
    const credits = Number(creditsStr);
    const creditsValid =
        /^\d+$/.test(creditsStr) &&
        credits > 0;

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
    void result.offsetWidth;
    result.classList.add("visible");

    currentStartYear = startYear;
    currentLanesForChart = lanesToShow;

    chartContainer.classList.remove("visible");
    void chartContainer.offsetWidth;
    chartContainer.classList.add("visible");
    updateChartFromSlider();
});

if (yearSlider) {
    yearSlider.addEventListener("input", () => {
        if (yearSliderValue) {
            yearSliderValue.textContent = yearSlider.value;
        }

        if (sliderAnimationId !== null) {
            cancelAnimationFrame(sliderAnimationId);
        }

        sliderAnimationId = requestAnimationFrame(() => {
            sliderAnimationId = null;
            updateChartFromSlider();
        });
    });

    yearSlider.addEventListener("change", () => {
        updateChartFromSlider();
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

    if (!prevValues) {
        prevValues = newValues;
        currentValues = newValues;
        drawEarningsChart(currentLanesForChart.map(l => l.label), newValues);
        return;
    }

    if (animFrame) cancelAnimationFrame(animFrame);

    const startValues = currentValues.slice();
    animStartTime = performance.now();
    const DURATION = 300;

    function animate(now) {
        const progress = Math.min((now - animStartTime) / DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        currentValues = startValues.map((start, i) =>
            start + (newValues[i] - start) * eased
        );

        drawEarningsChart(currentLanesForChart.map(l => l.label), currentValues);

        if (progress < 1) {
            animFrame = requestAnimationFrame(animate);
        } else {
            currentValues = newValues;
            prevValues = newValues;
        }
    }

    animFrame = requestAnimationFrame(animate);
}

function ensureChartSize() {
    if (!chartCanvas || !chartContainer) return 1;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = 720;
    const displayHeight = 550;

    const neededWidth = Math.floor(displayWidth * dpr);
    const neededHeight = Math.floor(displayHeight * dpr);

    if (chartCanvas.width !== neededWidth || chartCanvas.height !== neededHeight) {
        chartCanvas.width = neededWidth;
        chartCanvas.height = neededHeight;
    }

    return dpr;
}

function drawEarningsChart(labels, values) {
    if (!chartCanvas || !labels.length || !values.length) return;

    const dpr = ensureChartSize();
    const ctx = chartCanvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = chartCanvas.width / dpr;
    const h = chartCanvas.height / dpr;

    ctx.clearRect(0, 0, w, h);

    const paddingLeft   = 80;
    const paddingRight  = 85;
    const titleY        = 30;
    const paddingTop    = 80;
    const paddingBottom = 50;

    const usableW = w - paddingLeft - paddingRight;
    const usableH = h - paddingTop - paddingBottom;

    const xAxisRight = w - 60;

    const minVal = 0;
    const maxVal = 3000000;
    const range  = maxVal - minVal || 1;

    function yPos(v) {
        return paddingTop + usableH - (usableH * (v - minVal)) / range;
    }

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

            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(xAxisRight, y);
            ctx.stroke();

            const label = formatCurrency(v);
            ctx.fillText(label, paddingLeft - 10, y);
        }
    });

    const groupStep = usableW / labels.length;
    const barWidth = groupStep * 0.6;

    function xCenter(i) {
        return paddingLeft + 10 + groupStep * (i + 0.5);
    }

    const baseY = yPos(0);

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

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, paddingTop);
    ctx.lineTo(paddingLeft, baseY);
    ctx.lineTo(xAxisRight, baseY);
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.font = "bold 24px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const titleX = paddingLeft + usableW / 2;
    ctx.fillText("Total Earnings", titleX, titleY);

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
