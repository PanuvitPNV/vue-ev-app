<template>
  <div class="container mt-4">
    <form @submit.prevent="handleSubmit">
      <div class="row mb-3">
        <!-- Car brand and model selection -->
        <div class="col-md-6">
          <div v-if="!manualInputChecked">
            <div class="mb-3">
              <label id="car-brand-label" class="form-label"
                >Select your car brand:</label
              >
              <select
                name="car-brand"
                id="car-brand-select"
                class="form-select"
                aria-label="Select your car brand..."
                v-model="selectedBrand"
                @change="onBrandChange"
                :disabled="manualInputChecked"
                required
              >
                <option selected disabled value="">
                  Select your car brand...
                </option>
                <template v-for="(brand, index) in uniqueBrands" :key="index">
                  <option :value="brand">{{ brand }}</option>
                </template>
              </select>
            </div>

            <div class="mb-3">
              <label id="car-model-label" class="form-label"
                >Select your car model:</label
              >
              <select
                name="car-model"
                id="car-model-select"
                class="form-select"
                aria-label="Select your car model..."
                v-model="selectedModel"
                @change="onModelChange"
                :disabled="manualInputChecked || !selectedBrand"
                required
              >
                <option selected disabled value="">
                  Select your car model...
                </option>
                <template v-for="(model, index) in filteredModels" :key="index">
                  <option :value="model">{{ model }}</option>
                </template>
              </select>
            </div>
          </div>
          <!-- Charging port selection and provider filter -->
          <div class="row">
            <div class="col-md-6">
              <fieldset class="mb-3">
                <legend class="mb-1" style="font-size: larger">
                  Charging port:
                </legend>
                <div
                  class="form-check"
                  v-for="port in ['Type2', 'CCS2', 'CHAdeMO']"
                  :key="port"
                >
                  <input
                    :id="'charger-' + port.toLowerCase()"
                    class="form-check-input"
                    type="checkbox"
                    :name="port"
                    :checked="selectedAvailableChargers.includes(port)"
                    :disabled="!manualInputChecked"
                    @change="updateSelectedChargers"
                  />
                  <label
                    class="form-check-label"
                    :for="'charger-' + port.toLowerCase()"
                    >{{ port }}</label
                  >
                </div>
              </fieldset>
            </div>

            <div class="col-md-6">
              <fieldset class="mb-3">
                <label class="mb-1">Provider filter:</label>
                <div
                  class="form-check"
                  v-for="provider in providers"
                  :key="provider.name"
                >
                  <input
                    :id="'provider-' + provider.name.toLowerCase()"
                    class="form-check-input"
                    type="checkbox"
                    :name="provider.name"
                    :checked="selectedProvider.includes(provider.name)"
                    @change="updateSelectedProvider"
                  />
                  <label
                    class="form-check-label"
                    :for="'provider-' + provider.name.toLowerCase()"
                  >
                    <img
                      :src="provider.logo"
                      :alt="provider.name"
                      style="width: 20px; height: 20px"
                      class="img-fluid rounded-circle me-2"
                    />{{ provider.name }}
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <!-- Battery and other inputs -->
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Battery capacity (kWh):</label>
            <input
              id="battery-capacity"
              class="form-control"
              placeholder="Enter the battery capacity"
              pattern="\d+(\.\d+)?"
              v-model="selectedBatteryCapacity"
              required
              :disabled="!manualInputChecked"
            />
            <small class="form-text" style="color: #ffa23a"
              >E.g., 100, 50.5, 123.456 or 220.0</small
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Reserve battery (%):</label>
            <div class="d-flex align-items-center">
              <input
                id="reserveInputId"
                class="form-range col-11 me-1"
                type="range"
                min="1"
                max="100"
                v-model="selectedReverseBattery"
                required
                style="width: 93%"
              />
              <output
                id="reserveOutputId"
                class="col-1"
                style="text-align: center"
                >{{ selectedReverseBattery }}</output
              >
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Initial battery (%):</label>
            <div class="d-flex align-items-center">
              <input
                id="initInputId"
                class="form-range col-11 me-1"
                type="range"
                min="1"
                max="100"
                v-model="selectedInitBattery"
                required
                style="width: 93%"
              />
              <output
                id="initOutputId"
                class="col-1"
                style="text-align: center"
                >{{ selectedInitBattery }}</output
              >
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Arrival battery (%):</label>
            <div class="d-flex align-items-center">
              <input
                id="arrivalInputId"
                class="form-range col-11 me-1"
                type="range"
                min="1"
                max="100"
                v-model="selectedArrivalBattery"
                required
                style="width: 93%"
              />
              <output
                id="arrivalOutputId"
                class="col-1"
                style="text-align: center"
                >{{ selectedArrivalBattery }}</output
              >
            </div>
          </div>

          <div class="form-check form-switch mb-3">
            <input
              id="manual-input"
              class="form-check-input"
              type="checkbox"
              role="switch"
              v-model="manualInputChecked"
            />
            <label class="form-check-label" for="manual-input"
              >Enable manual customization</label
            >
          </div>
        </div>
      </div>

      <hr />

      <!-- Location inputs -->
      <fieldset class="mb-3">
        <div class="mb-3">
          <label for="search-origin" class="form-label">Origin Location</label>
          <input
            type="text"
            id="search-origin"
            class="form-control"
            placeholder="Enter an origin location"
            required
            @focus="clearInput"
          />
          <small class="form-text" style="color: #ffa23a"
            >* Please select a location from the dropdown list</small
          >
        </div>

        <div class="mb-3">
          <label for="search-destination" class="form-label"
            >Destination Location</label
          >
          <input
            type="text"
            id="search-destination"
            class="form-control"
            placeholder="Enter a destination location"
            required
            @focus="clearInput"
          />
          <small class="form-text" style="color: #ffa23a"
            >* Please select a location from the dropdown list</small
          >
        </div>
      </fieldset>

      <div class="d-grid gap-2">
        <input
          id="search-direction"
          type="submit"
          class="btn btn-primary"
          value="Search Direction"
        />
      </div>
    </form>

    <div class="mt-4" id="GoogleMaps" style="width: 100%; height: 100vh"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

import ptt_ico from "@/assets/station_logo/ptt.png";
import pea_ico from "@/assets/station_logo/pea.png";
import altervim_ico from "@/assets/station_logo/altervim.png";
import elex_ico from "@/assets/station_logo/elex.png";
import ea_ico from "@/assets/station_logo/ea.png";

const cars_data = ref([]);
const selectedBrand = ref("");
const selectedModel = ref("");
const selectedCar = ref({});
const selectedBatteryCapacity = ref("");
const selectedAvailableChargers = ref([]);
const selectedProvider = ref([]);
const selectedReverseBattery = ref(10);
const selectedInitBattery = ref(50);
const selectedArrivalBattery = ref(50);
const manualInputChecked = ref(false);
// const submitError = ref(false);

const providers = [
  { name: "PTT", logo: ptt_ico },
  { name: "PEA", logo: pea_ico },
  { name: "EleX", logo: elex_ico },
  { name: "Altervim", logo: altervim_ico },
  { name: "EA", logo: ea_ico },
];

const uniqueBrands = computed(() => {
  const brands = cars_data.value.map((car) => car.brand);
  return [...new Set(brands)];
});

const filteredModels = computed(() => {
  return cars_data.value
    .filter((car) => car.brand === selectedBrand.value)
    .map((car) => car.model);
});

watch(selectedBrand, () => {
  selectedModel.value = ""; // Reset selected model when brand changes
  selectedBatteryCapacity.value = ""; // Reset battery capacity
  selectedAvailableChargers.value = []; // Reset available chargers
});

watch(selectedModel, () => {
  selectedCar.value = cars_data.value.find(
    (car) => car.model === selectedModel.value
  );
  selectedBatteryCapacity.value = selectedCar.value
    ? selectedCar.value.battery.useable_capacity.split(" ")[0]
    : null;
  selectedAvailableChargers.value = selectedCar.value
    ? selectedCar.value.charging_port
    : [];
});

const updateSelectedChargers = (event) => {
  const charger = event.target.name;
  if (event.target.checked) {
    selectedAvailableChargers.value.push(charger);
  } else {
    selectedAvailableChargers.value = selectedAvailableChargers.value.filter(
      (item) => item !== charger
    );
  }
};

const updateSelectedProvider = (event) => {
  const provider = event.target.name;
  if (event.target.checked) {
    selectedProvider.value.push(provider);
  } else {
    selectedProvider.value = selectedProvider.value.filter(
      (item) => item !== provider
    );
  }
};

const clearInput = (event) => {
  event.target.value = "";
};

watch(manualInputChecked, () => {
  selectedBrand.value = "";
  selectedModel.value = "";
  selectedBatteryCapacity.value = "";
  selectedAvailableChargers.value = [];
});

// const handleSubmit = (event) => {
//   if (selectedBrand.value === "" || selectedModel.value === "") {
//     submitError.value = true;
//   } else {
//     submitError.value = false;
//   }
// };

onMounted(async () => {
  let map = null;

  const infoButton = () => {
    const infoButton = document.createElement("button");
    infoButton.classList.add("btn", "btn-warning");
    infoButton.style.margin = "10px";
    infoButton.style.height = "50px";
    infoButton.style.width = "50px";
    infoButton.style.display = "flex"; // Add flexbox display
    infoButton.style.alignItems = "center"; // Center vertically
    infoButton.style.justifyContent = "center"; // Center horizontally
    infoButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>`;
    infoButton.onclick = () => {
      alert("This is an info button");
    };
    return infoButton;
  };

  try {
    const response = await fetch(process.env.VUE_APP_API_URL + "/ev_cars");
    const data = await response.json();
    cars_data.value = data;
  } catch (error) {
    console.error(error);
  }

  const loader = new Loader({
    apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["maps", "routes", "places", "marker"],
  });

  loader.load().then(async (google) => {
    // const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });

    map = new google.maps.Map(document.getElementById("GoogleMaps"), {
      center: { lat: 18.80377379840586, lng: 98.95255970304493 },
      zoom: 16,
      mapId: "aa02cb992666fba3",
      disableDefaultUI: true,
    });

    directionsRenderer.setMap(map);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(infoButton());

    const AutocompleteOptions = {
      fields: ["place_id", "formatted_address", "geometry", "name"],
      componentRestrictions: { country: "th" },
    };

    const originInput = document.getElementById("search-origin");
    const destinationInput = document.getElementById("search-destination");

    /* eslint-disable no-unused-vars */
    const originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      AutocompleteOptions
    );

    /* eslint-disable no-unused-vars */
    const destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      AutocompleteOptions
    );

  });
});
</script>

<script>
export default {
  name: "FormMaps",
};
</script>
