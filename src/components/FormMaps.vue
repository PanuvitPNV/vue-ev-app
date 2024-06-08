<template>
  <div class="container mt-4">
    <form @submit.prevent="handleSubmit">
      <div class="row mb-3">
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
          <div class="row">
            <div class="col-md-6">
              <fieldset class="mb-3">
                <legend class="mb-1" style="font-size: larger;">Charging port:</legend>
                <div class="form-check">
                  <input
                    id="charger-type1"
                    class="form-check-input"
                    type="checkbox"
                    name="Type1"
                    :checked="selectedAvailableChargers.includes('Type1')"
                    :disabled="!manualInputChecked"
                    @change="updateSelectedChargers"
                  />
                  <label class="form-check-label" for="charger-type1"
                    >Type1</label
                  >
                </div>
                <div class="form-check">
                  <input
                    id="charger-type2"
                    class="form-check-input"
                    type="checkbox"
                    name="Type2"
                    :checked="selectedAvailableChargers.includes('Type2')"
                    :disabled="!manualInputChecked"
                    @change="updateSelectedChargers"
                  />
                  <label class="form-check-label" for="charger-type2"
                    >Type2</label
                  >
                </div>
                <div class="form-check">
                  <input
                    id="charger-ccs2"
                    class="form-check-input"
                    type="checkbox"
                    name="CCS2"
                    :checked="selectedAvailableChargers.includes('CCS2')"
                    :disabled="!manualInputChecked"
                    @change="updateSelectedChargers"
                  />
                  <label class="form-check-label" for="charger-ccs2"
                    >CCS2</label
                  >
                </div>
                <div class="form-check">
                  <input
                    id="charger-chademo"
                    class="form-check-input"
                    type="checkbox"
                    name="CHAdeMO"
                    :checked="selectedAvailableChargers.includes('CHAdeMO')"
                    :disabled="!manualInputChecked"
                    @change="updateSelectedChargers"
                  />
                  <label class="form-check-label" for="charger-chademo"
                    >CHAdeMO</label
                  >
                </div>
                <div class="form-check">
                  <input
                    id="charger-superchargers"
                    class="form-check-input"
                    type="checkbox"
                    name="Superchargers"
                    :checked="selectedAvailableChargers.includes('Superchargers')"
                    :disabled="!manualInputChecked"
                    @change="updateSelectedChargers"
                  />
                  <label class="form-check-label" for="charger-superchargers"
                    >Superchargers</label
                  >
                </div>
              </fieldset>
            </div>

            <div class="col-md-6">
              <fieldset class="mb-3">
                <label class="mb-1">Provider filter:</label>
                <div class="form-check">
                  <input
                    id="provider-ppt"
                    class="form-check-input"
                    type="checkbox"
                    name="PTT"
                    :checked="selectedProvider.includes('PTT')"
                    @change="updateSelectedProvider"
                  />
                  <label class="form-check-label" for="provider-ppt">
                    <img
                      src="../assets/station_logo/ptt.png"
                      alt="PTT"
                      style="width: 20px; height: 20px"
                      class="img-fluid rounded-circle me-2"
                    />PTT
                  </label>
                </div>
                <div class="form-check">
                  <input
                    id="provider-pea"
                    class="form-check-input"
                    type="checkbox"
                    name="PEA"
                    :checked="selectedProvider.includes('PEA')"
                    @change="updateSelectedProvider"
                  />
                  <label class="form-check-label" for="provider-pea">
                    <img
                      src="../assets/station_logo/pea.png"
                      alt="PEA"
                      style="width: 20px; height: 20px"
                      class="img-fluid rounded-circle me-2"
                    />PEA
                  </label>
                </div>
                <div class="form-check">
                  <input
                    id="provider-elex"
                    class="form-check-input"
                    type="checkbox"
                    name="EleX"
                    :checked="selectedProvider.includes('EleX')"
                    @change="updateSelectedProvider"
                  />
                  <label class="form-check-label" for="provider-elex">
                    <img
                      src="../assets/station_logo/elex.png"
                      alt="EleX"
                      style="width: 20px; height: 20px"
                      class="img-fluid rounded-circle me-2"
                    />EleX
                  </label>
                </div>
                <div class="form-check">
                  <input
                    id="provider-altervim"
                    class="form-check-input"
                    type="checkbox"
                    name="Altervim"
                    :checked="selectedProvider.includes('Altervim')"
                    @change="updateSelectedProvider"
                  />
                  <label class="form-check-label" for="provider-altervim">
                    <img
                      src="../assets/station_logo/altervim.png"
                      alt="Altervim"
                      style="width: 20px; height: 20px"
                      class="img-fluid rounded-circle me-2"
                    />Altervim
                  </label
                  >
                </div>
                <div class="form-check">
                  <input
                    id="provider-ea"
                    class="form-check-input"
                    type="checkbox"
                    name="EA"
                    :checked="selectedProvider.includes('EA')"
                    @change="updateSelectedProvider"
                  />
                  <label class="form-check-label" for="provider-ea">
                    <img
                      src="../assets/station_logo/ea.png"
                      alt="EA"
                      style="width: 20px; height: 20px"
                      class="img-fluid rounded-circle me-2"
                    />EA
                  </label
                  >
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label"
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
            <label class="form-label"
              >Reserve battery (%):</label
            >
            <div class="d-flex align-items-center">
              <input
                id="reserveInputId"
                class="form-range col-11 me-1"
                type="range"
                min="1"
                max="100"
                value="10"
                oninput="reserveOutputId.value = reserveInputId.value"
                required
                style="width: 93%;"
              />
              <output id="reserveOutputId" class="col-1" style="text-align: center;">10</output>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label"
              >Initial battery (%):</label
            >
            <div class="d-flex align-items-center">
              <input
                id="initInputId"
                class="form-range col-11 me-1"
                type="range"
                min="1"
                max="100"
                value="50"
                oninput="initOutputId.value = initInputId.value"
                required
                style="width: 93%;"
              />
              <output id="initOutputId" class="col-1" style="text-align: center;">50</output>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label"
              >Arrival battery (%):</label
            >
            <div class="d-flex align-items-center">
              <input
                id="arrivalInputId"
                class="form-range col-11 me-1"
                type="range"
                min="1"
                max="100"
                value="50"
                oninput="arrivalOutputId.value = arrivalInputId.value"
                required
                style="width: 93%;"
              />
              <output id="arrivalOutputId" class="col-1" style="text-align: center;">50</output>
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
import { ref, computed} from 'vue';
import { Loader } from "@googlemaps/js-api-loader";
// import { onForm, Form, Field, ErrorMessage } from 'vee-validate';
// import * as yup from 'yup';

const cars_data = ref([]);
const selectedBrand = ref("");
const selectedModel = ref("");
const selectedCar = ref({});
const selectedBatteryCapacity = ref("");
const selectedAvailableChargers = ref([]);
const selectedProvider = ref([]);
const manualInputChecked = ref(false);
const submitError = ref(false);

// const schema = yup.object({
//   selectedBrand: yup.string().required('Please select your car brand.'),
//   selectedModel: yup.string().required('Please select your car model.'),
//   selectedBatteryCapacity: yup.number().required('Please enter the battery capacity.'),
//   selectedAvailableChargers: yup.array().min(1, 'Please select at least one charging port.'),
//   selectedProvider: yup.array().min(1, 'Please select at least one provider.'),
//   selectedReserveBattery: yup.number().required('Please enter the reserve battery.'),
//   selectedInitBattery: yup.number().required('Please enter the initial battery.'),
//   selectedArrivalBattery: yup.number().required('Please enter the arrival battery.'),
// });

// const form = ref({
//   selectedBrand: "",
//   selectedModel: "",
//   selectedBatteryCapacity: "",
//   selectedAvailableChargers: [],
//   selectedProvider: [],
//   selectedReserveBattery: 10,
//   selectedInitBattery: 50,
//   selectedArrivalBattery: 50,
// });

fetch(process.env.VUE_APP_API_URL + "/ev_cars")
  .then((response) => response.json())
  .then((data) => (cars_data.value = data))
  .catch((error) => console.error(error));

const uniqueBrands = computed(() => {
  const brands = cars_data.value.map((car) => car.brand);
  return [...new Set(brands)];
});

const filteredModels = computed(() => {
  if (!selectedBrand.value) return [];
  return cars_data.value
    .filter((car) => car.brand === selectedBrand.value)
    .map((car) => car.model);
});

const onBrandChange = () => {
  selectedModel.value = ""; // Reset selected model when brand changes
  selectedBatteryCapacity.value = null; // Reset battery capacity
  selectedAvailableChargers.value = []; // Reset available chargers
};

const onModelChange = () => {
  selectedCar.value = cars_data.value.find(
    (car) => car.model === selectedModel.value
  );
  selectedBatteryCapacity.value = selectedCar.value
    ? selectedCar.value.battery.useable_capacity.split(" ")[0]
    : null;
  selectedAvailableChargers.value = selectedCar.value
    ? selectedCar.value.charging_port
    : [];
};

const onManualInputChange = () => {
  if (manualInputChecked.value) {
    selectedBrand.value = ""; // Reset selected brand
    selectedModel.value = ""; // Reset selected model
    selectedBatteryCapacity.value = null; // Reset battery capacity
  }
  selectedAvailableChargers.value = [];
  selectedCar.value = {};
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

const updateSelectedProvider = (event) => {
  const checkboxName = event.target.name;
  if (event.target.checked) {
    // Add provider to selectedProvider
    selectedProvider.value.push(checkboxName);
  } else {
    // Remove provider from selectedProvider
    const index = selectedProvider.value.indexOf(checkboxName);
    if (index !== -1) {
      selectedProvider.value.splice(index, 1);
    }
  }
};

const handleSubmit = () => {
  if (manualInputChecked.value) {
    if (!selectedBatteryCapacity.value) {
      submitError.value = true;
      alert("Please enter the battery capacity");
    }
    if (selectedAvailableChargers.value.length === 0) {
      submitError.value = true;
      alert("Please select at least one charging port");
    }
  }else{
    if (!selectedBrand.value || !selectedModel.value) {
      submitError.value = true;
      alert("Please select your car brand and model");
    }
  }

  if (selectedProvider.value.length === 0) {
    submitError.value = true;
    alert("Please select at least one provider");
  }

  console.log({
    selectedBrand: selectedBrand.value,
    selectedModel: selectedModel.value,
    selectedCar: selectedCar.value,
    selectedBatteryCapacity: selectedBatteryCapacity.value,
    selectedAvailableChargers: selectedAvailableChargers.value,
    selectedProvider: selectedProvider.value,
    submitError: submitError.value,
  });

};

</script>



<script>

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
