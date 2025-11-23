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

const stateInput = document.getElementById("state-input");
const stateDropdown = document.getElementById("state-dropdown");
const districtInput = document.getElementById("district-input");
const districtDropdown = document.getElementById("district-dropdown");
const goButton = document.getElementById("go-btn");
const resultBox = document.getElementById("result"); // ok if this is null

let selectedState = "";
let selectedDistrict = "";

// start disabled
goButton.disabled = true;
goButton.classList.remove("enabled");

// helper to turn button on/off
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

// ----- STATE INPUT -----
stateInput.addEventListener("input", () => {
    const value = stateInput.value.toLowerCase().trim();
    stateDropdown.innerHTML = "";
    selectedState = "";          // typing resets selected state
    selectedDistrict = "";       // and clears district selection
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

    // reset district when state changes
    districtInput.value = "";
    selectedDistrict = "";
    districtDropdown.style.display = "none";

    if (resultBox) {
        resultBox.textContent = "";
    }

    updateGoButtonState();
}

document.addEventListener("click", e => {
    if (!stateDropdown.contains(e.target) && e.target !== stateInput) {
        stateDropdown.style.display = "none";
    }
});

// ----- DISTRICT INPUT -----
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
    selectedDistrict = "";          // typing breaks the old selection
    buildDistrictDropdown(value);
    updateGoButtonState();
});

function selectDistrict(district) {
    selectedDistrict = district;
    districtInput.value = district;
    districtDropdown.style.display = "none";

    if (resultBox) {
        resultBox.textContent = "";
    }

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
            selectedDistrict = value;  // manual entry
            updateGoButtonState();
        }
    }
});

document.addEventListener("click", e => {
    if (!districtDropdown.contains(e.target) && e.target !== districtInput) {
        districtDropdown.style.display = "none";
    }
});

// ----- GO BUTTON -----
goButton.addEventListener("click", () => {
    if (!(selectedState && selectedDistrict)) return; // double-check
    window.location.href = `secondPage.html?district=${encodeURIComponent(selectedDistrict)}`;
});
