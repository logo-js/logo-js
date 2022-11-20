import { Model, Timer } from "https://vimtaai.github.io/agent/lib/index.js";
import { Random } from "https://vimtaai.github.io/agent/lib/utils.js";

const EMPTY_FIELD_CHANCE = 0.20;

const model = new Model(100, 100, 5);
const timer = new Timer(step, 20);

function updateFieldColor(field) {
  if (field.burnedDown) {
    field.color = `rgb(20, 0, 0)`;
  } else if (field.fire > 0) {
    field.color = `rgb(${field.fire * 255}, 0, 0)`;
  } else {
    field.color = `rgb(0, ${field.vegetation * 255}, 0)`;
  }
}

function setup() {
  for (const field of model.fields) {
    const isEmpty = Random.getBoolean(EMPTY_FIELD_CHANCE);

    field.burnedDown = false;
    field.vegetation = isEmpty ? 0 : Random.getFloat(0, 1);
    field.fire = 0;

    updateFieldColor(field);
  }

  const fieldOnFire = model.fieldAt(0, model.height / 2);

  fieldOnFire.fire = 1;
  updateFieldColor(fieldOnFire);
}

function step() {
  const fieldsOnFire = model.fields.filter((field) => field.fire > 0);

  for (const fieldOnFire of fieldsOnFire) {
    const neighborsNotOnFire = fieldOnFire.neighbors.filter(
      (neighbor) => neighbor.fire === 0
    );

    for (const neighbor of neighborsNotOnFire) {
      const chanceToCatchFire = fieldOnFire.fire * neighbor.vegetation;

      if (Random.getBoolean(chanceToCatchFire)) {
        neighbor.fire = neighbor.vegetation;
        updateFieldColor(neighbor);
      }
    }

    fieldOnFire.fire = Math.max(fieldOnFire.fire - 0.1, 0);
    fieldOnFire.vegetation = Math.max(fieldOnFire.vegetation - 0.1, 0);

    if (fieldOnFire.fire === 0) {
      fieldOnFire.burnedDown = true;
    }

    updateFieldColor(fieldOnFire);
  }
}

document.getElementById("setup").addEventListener("click", () => setup());
document.getElementById("start").addEventListener("click", () => timer.start());
document.getElementById("stop").addEventListener("click", () => timer.stop());