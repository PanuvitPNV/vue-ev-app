<template>
  <div class="container mt-4">
    <form id="user-input" method="POST" onsubmit="return false">
      <div class="row mb-3">
        <div class="col-md-6">
          <div v-if="!manualInputChecked">
            <div class="mb-3">
              <label for="car-brand" id="car-brand-label" class="form-label"
                >Select your car brand:</label
              >
              <select
                name="car-brand"
                id="car-brand"
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
              <label for="car-model" id="car-model-label" class="form-label"
                >Select your car model:</label
              >
              <select
                name="car-model"
                id="car-model"
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

          <fieldset class="mb-3">
            <label class="mb-1">Charging port:</label>
            <div class="form-check">
              <input
                id="charging-checkbox"
                class="form-check-input"
                type="checkbox"
                name="Type1"
                :checked="selectedAvailableChargers.includes('Type1')"
                :disabled="!manualInputChecked"
                @change="updateSelectedChargers"
              />
              <label class="form-check-label" for="charging-checkbox"
                >Type1</label
              >
            </div>
            <div class="form-check">
              <input
                id="charging-checkbox"
                class="form-check-input"
                type="checkbox"
                name="Type2"
                :checked="selectedAvailableChargers.includes('Type2')"
                :disabled="!manualInputChecked"
                @change="updateSelectedChargers"
              />
              <label class="form-check-label" for="charging-checkbox"
                >Type2</label
              >
            </div>
            <div class="form-check">
              <input
                id="charging-checkbox"
                class="form-check-input"
                type="checkbox"
                name="CCS2"
                :checked="selectedAvailableChargers.includes('CCS2')"
                :disabled="!manualInputChecked"
                @change="updateSelectedChargers"
              />
              <label class="form-check-label" for="charging-checkbox"
                >CCS2</label
              >
            </div>
            <div class="form-check">
              <input
                id="charging-checkbox"
                class="form-check-input"
                type="checkbox"
                name="CHAdeMO"
                :checked="selectedAvailableChargers.includes('CHAdeMO')"
                :disabled="!manualInputChecked"
                @change="updateSelectedChargers"
              />
              <label class="form-check-label" for="charging-checkbox"
                >CHAdeMO</label
              >
            </div>
            <div class="form-check">
              <input
                id="charging-checkbox"
                class="form-check-input"
                type="checkbox"
                name="Superchargers"
                :checked="selectedAvailableChargers.includes('Superchargers') && !manualInputChecked"
                :disabled="!manualInputChecked"
                @change="updateSelectedChargers"
              />
              <label class="form-check-label" for="charging-checkbox"
                >Superchargers</label
              >
            </div>
          </fieldset>
        </div>

        <div class="col-md-6">
          <div class="mb-3">
            <label for="battery-capacity" class="form-label"
              >Battery capacity (kWh):</label
            >
            <input
              id="battery-capacity"
              class="form-control"
              placeholder="Enter the battery capacity"
              pattern="\d+(\.\d+)?"
              :value="selectedBatteryCapacity"
              required
              :disabled="!manualInputChecked"
            />
            <small class="form-text" style="color: #ffa23a"
              >E.g., 100, 50.5, 123.456 or 220.0</small
            >
          </div>

          <div class="mb-3">
            <label for="initial-battery" class="form-label"
              >Initial battery (%):</label
            >
            <div class="d-flex align-items-center">
              <input
                id="initInputId"
                class="form-range"
                type="range"
                min="1"
                max="100"
                oninput="initOutputId.value = initInputId.value"
                required
              />
              <output id="initOutputId" class="ms-2">50</output>
            </div>
          </div>

          <div class="mb-3">
            <label for="arrival-battery" class="form-label"
              >Arrival battery (%):</label
            >
            <div class="d-flex align-items-center">
              <input
                id="arrivalInputId"
                class="form-range"
                type="range"
                min="1"
                max="100"
                oninput="arrivalOutputId.value = arrivalInputId.value"
                required
              />
              <output id="arrivalOutputId" class="ms-2">50</output>
            </div>
          </div>

          <div class="form-check form-switch mb-3">
            <input
              id="manual-input"
              class="form-check-input"
              type="checkbox"
              role="switch"
              @change="onManualInputChange"
              v-model="manualInputChecked"
            />
            <label class="form-check-label" for="manual-input"
              >Enable manual customization</label
            >
          </div>
        </div>
      </div>

      <hr />

      <fieldset class="mb-3">
        <div class="mb-3">
          <label for="search-origin" class="form-label">Origin Location</label>
          <input
            type="text"
            id="search-origin"
            class="form-control"
            placeholder="Enter an origin location"
            required
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

    <div class="mt-4" ref="googleMap" style="width: 100%; height: 100vh"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const cars_data = ref([]);
const selectedBrand = ref('');
const selectedModel = ref('');
const selectedCar = ref('');
const selectedBatteryCapacity = ref('');
const selectedAvailableChargers = ref([]);
const manualInputChecked = ref(false);

fetch(process.env.VUE_APP_API_URL + '/ev_cars')
  .then(response => response.json())
  .then(data => cars_data.value = data)
  .catch(error => console.error(error));

const uniqueBrands = computed(() => {
  const brands = cars_data.value.map(car => car.brand);
  return [...new Set(brands)];
});

const filteredModels = computed(() => {
  if (!selectedBrand.value) return [];
  return cars_data.value
    .filter(car => car.brand === selectedBrand.value)
    .map(car => car.model);
});

const onBrandChange = () => {
  selectedModel.value = '';  // Reset selected model when brand changes
  selectedBatteryCapacity.value = null; // Reset battery capacity
  selectedAvailableChargers.value = []; // Reset available chargers
};

const onModelChange = () => {
  selectedCar.value = cars_data.value.find(car => car.model === selectedModel.value);
  selectedBatteryCapacity.value = selectedCar.value ? selectedCar.value.battery.useable_capacity.split(" ")[0] : null;
  selectedAvailableChargers.value = selectedCar.value ? selectedCar.value.charging_port : [];
};

const onManualInputChange = () => {
  if (manualInputChecked.value) {
    selectedBrand.value = ''; // Reset selected brand
    selectedModel.value = ''; // Reset selected model
    selectedBatteryCapacity.value = null; // Reset battery capacity
  }
  selectedAvailableChargers.value = [];
};

const updateSelectedChargers = (event) => {
  const checkboxName = event.target.name;
  if (event.target.checked) {
    // Add charger type to selectedAvailableChargers
    selectedAvailableChargers.value.push(checkboxName);
  } else {
    // Remove charger type from selectedAvailableChargers
    const index = selectedAvailableChargers.value.indexOf(checkboxName);
    if (index !== -1) {
      selectedAvailableChargers.value.splice(index, 1);
    }
  }
};

</script>


<script>
import { Loader } from "@googlemaps/js-api-loader";

export default {
  name: "FormMaps",
  data() {
    return {
      google: null,
      map: null,
    };
  },
  mounted() {
    const loader = new Loader({
      apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["maps", "routes", "places", "marker"],
    });

    loader.load().then((google) => {
      // (async () => {
      //     const { Map } = await google.maps.importLibrary("maps");
      //     const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");
      //     const { Autocomplete } = await google.maps.importLibrary("places");
      //     const { AdvancedMarkerElement, Marker } = await google.maps.importLibrary("marker");
      // })();

      this.google = google;
      this.map = new google.maps.Map(this.$refs.googleMap, {
        center: { lat: 18.80377379840586, lng: 98.95255970304493 },
        zoom: 16,
        mapId: "aa02cb992666fba3",
        disableDefaultUI: true,
      });
    });
  },
};
</script>
