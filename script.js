const densities = {
  iron_cube: { label: "مكعب حديد", density: 7.87 },
  orange: { label: "برتقالة", density: 0.94 },
  wood_cylinder: { label: "قطعة خشب", density: 0.6 }
};

let totalMassG = 0;
let addedItems = [];

function calculateMass(id) {
  let volume = 0;

  try {
    if (id === "iron_cube") {
      const size = parseFloat(document.getElementById("iron_cube_size").value) || 0;
      volume = size ** 3;
    } else if (id === "orange") {
      const r = parseFloat(document.getElementById("orange_radius").value) || 0;
      volume = (4 / 3) * Math.PI * r ** 3;
    } else if (id === "wood_cylinder") {
      const r = parseFloat(document.getElementById("wood_cylinder_radius").value) || 0;
      const h = parseFloat(document.getElementById("wood_cylinder_height").value) || 0;
      volume = Math.PI * r ** 2 * h;
    }

    const density = densities[id].density;
    return volume * density;
  } catch (err) {
    console.error("خطأ في حساب الكتلة:", err);
    return 0;
  }
}

function updateDisplay() {
  const totalKg = totalMassG / 1000;
  document.getElementById("kg-value").textContent = totalKg.toFixed(3);
  document.getElementById("g-value").textContent = totalMassG.toFixed(2);
  document.getElementById("item-count").textContent = addedItems.length;

  const list = document.getElementById("material-list");
  list.innerHTML = "";

  addedItems.forEach(item => {
    const li = document.createElement("li");

    let icon = "";
    let cls = "";
    if (item === "iron_cube") {
      icon = "🟫";
      cls = "iron";
    } else if (item === "orange") {
      icon = "🟠";
      cls = "orange";
    } else if (item === "wood_cylinder") {
      icon = "🪵";
      cls = "wood";
    }

    li.textContent = `${icon} ${densities[item].label}`;
    li.classList.add(cls);
    list.appendChild(li);
  });
}

function handleDrop(event) {
  event.preventDefault();
  const itemId = event.dataTransfer.getData("text");
  if (!itemId || !densities[itemId]) return;

  addItemToScale(itemId);
}

function resetScale() {
  totalMassG = 0;
  addedItems = [];
  updateDisplay();
  const sound = document.getElementById("drop-sound");
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function addItemToScale(itemId) {
  const mass = calculateMass(itemId);
  totalMassG += mass;
  addedItems.push(itemId);

  const sound = document.getElementById("drop-sound");
  sound.currentTime = 0;
  sound.play().catch(e => console.log("لم يتم تشغيل الصوت:", e));

  const scale = document.getElementById("scale-area");
  scale.classList.add("shake");
  setTimeout(() => scale.classList.remove("shake"), 500);

  updateDisplay();
}

// دعم السحب على الكمبيوتر
document.querySelectorAll(".draggable").forEach(el => {
  el.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text", e.target.id);
  });
});

// دعم اللمس/الضغط على الهاتف
document.querySelectorAll(".draggable").forEach(el => {
  el.addEventListener("click", () => {
    const itemId = el.id;
    if (!densities[itemId]) return;
    addItemToScale(itemId);
  });
});



