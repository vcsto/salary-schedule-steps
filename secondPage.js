const states = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
    "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
    "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
    "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
    "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
    "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
    "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
    "Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

const paDistricts = [
    "District 1",
    "District 2",
    "SOUTH WESTERN SCHOOL DISTRICT YORK COUNTY",
    "District 4"
];

const stateInput       = document.getElementById("state-input");
const stateDropdown    = document.getElementById("state-dropdown");
const districtInput    = document.getElementById("district-input");
const districtDropdown = document.getElementById("district-dropdown");
const goButton         = document.getElementById("go-btn");
const resultBox        = document.getElementById("result"); // ok if null

let selectedState    = "";
let selectedDistrict = "";

function syncInputHighlight() {
    stateInput.classList.toggle("input-selected", !!selectedState);
    districtInput.classList.toggle("input-selected", !!selectedDistrict);
}

function updateGoButtonState() {
    const ready = !!(selectedState && selectedDistrict);
    if (ready) {
        goButton.disabled = false;
        goButton.classList.add("enabled");
    } else {
        goButton.disabled = true;
        goButton.classList.remove("enabled");
    }
}

goButton.disabled = true;
goButton.classList.remove("enabled");
syncInputHighlight();


stateInput.addEventListener("input", () => {
    const value = stateInput.value.toLowerCase().trim();
    stateDropdown.innerHTML = "";

    selectedState    = "";
    selectedDistrict = "";
    districtInput.value = "";
    syncInputHighlight();
    updateGoButtonState();

    if (value === "") {
        stateDropdown.style.display = "none";
        return;
    }

    const matches = states.filter(s => s.toLowerCase().startsWith(value));

    if (matches.length === 0) {
        stateDropdown.style.display = "none";
        return;
    }

    stateDropdown.style.display = "block";

    matches.forEach(state => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.textContent = state;
        item.onclick = () => selectState(state);
        stateDropdown.appendChild(item);
    });
});

function selectState(state) {
    selectedState = state;
    stateInput.value = state;
    stateDropdown.style.display = "none";

    districtInput.value = "";
    selectedDistrict = "";
    districtDropdown.style.display = "none";

    if (resultBox) {
        resultBox.textContent = "";
    }

    syncInputHighlight();
    updateGoButtonState();
}

document.addEventListener("click", e => {
    if (!stateDropdown.contains(e.target) && e.target !== stateInput) {
        stateDropdown.style.display = "none";
    }
});


function buildDistrictDropdown(filterText = "") {
    if (selectedState !== "Pennsylvania") {
        districtDropdown.style.display = "none";
        return;
    }

    districtDropdown.innerHTML = "";

    const lower = filterText.toLowerCase();
    const matches = paDistricts.filter(d => d.toLowerCase().includes(lower));

    if (matches.length === 0) {
        districtDropdown.style.display = "none";
        return;
    }

    districtDropdown.style.display = "block";

    matches.forEach(district => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.textContent = district;
        item.onclick = () => selectDistrict(district);
        districtDropdown.appendChild(item);
    });
}

districtInput.addEventListener("focus", () => {
    buildDistrictDropdown("");
});

districtInput.addEventListener("input", () => {
    const value = districtInput.value.trim();

    selectedDistrict = "";
    buildDistrictDropdown(value);

    syncInputHighlight();
    updateGoButtonState();
});

function selectDistrict(district) {
    selectedDistrict = district;
    districtInput.value = district;
    districtDropdown.style.display = "none";

    if (resultBox) {
        resultBox.textContent = "";
    }

    syncInputHighlight();
    updateGoButtonState();
}

districtInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        const value = districtInput.value.trim();
        if (value === "") return;

        if (districtDropdown.style.display === "block") {
            const first = districtDropdown.querySelector(".dropdown-item");
            if (first) {
                selectDistrict(first.textContent);
            }
        } else {
            selectedDistrict = value;
            syncInputHighlight();
            updateGoButtonState();
        }
    }
});

document.addEventListener("click", e => {
    if (!districtDropdown.contains(e.target) && e.target !== districtInput) {
        districtDropdown.style.display = "none";
    }
});


goButton.addEventListener("click", () => {
    if (!(selectedState && selectedDistrict)) return; 
    window.location.href =
        `secondPage.html?district=${encodeURIComponent(selectedDistrict)}`;
});
