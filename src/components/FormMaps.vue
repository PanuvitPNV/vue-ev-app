<template>
  <div class="container mt-4">
    <form ref="formRef" @submit.prevent="handleSubmit">
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
                :disabled="manualInputChecked || isLoading"
                required
              >
                <option selected disabled value="null">
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
                :disabled="manualInputChecked || !selectedBrand || isLoading"
                required
              >
                <option selected disabled value="null">
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
                <label class="mb-1">Charging port:</label>
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
                    :disabled="!manualInputChecked || isLoading"
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
                    :disabled="isLoading"
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
              :disabled="!manualInputChecked || isLoading"
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
                :disabled="isLoading"
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
                :disabled="isLoading"
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
                :disabled="isLoading"
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
              :disabled="isLoading"
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
            :disabled="isLoading"
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
            :disabled="isLoading"
          />
          <small class="form-text" style="color: #ffa23a"
            >* Please select a location from the dropdown list</small
          >
        </div>
      </fieldset>

      <div class="d-grid gap-2">
        <button
          v-if="!isLoading"
          id="search-direction"
          type="submit"
          class="btn btn-primary"
        >
          Search Direction
        </button>
        <button
          v-else
          id="search-direction"
          type="button"
          class="btn btn-primary"
          disabled
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Loading...
        </button>
      </div>
    </form>

    <div class="mt-4" id="GoogleMaps" style="width: 100%; height: 100vh"></div>
  </div>

  <div
    class="modal fade"
    id="infoModal"
    tabindex="-1"
    aria-labelledby="infoModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="infoModalLabel">
            💡 Direction Information
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Accordion -->
          <div class="accordion">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Charging Stops
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  charging stops details...
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Summary
                </button>
              </h2>
              <div
                id="collapseTwo"
                class="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  summary details...
                </div>
              </div>
            </div>
          </div>
          <!-- Accordion -->
        </div>
        <div class="modal-footer">
          <a
            id="gmap-links"
            type="button"
            target="_blank"
            href="https://www.google.com/maps"
            class="btn btn-success"
            >Open in Google Maps</a
          >
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <button
    type="button"
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#errorModal"
  >
    test
  </button>
  <div
    class="modal fade"
    id="errorModal"
    tabindex="-1"
    aria-labelledby="errorModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="errorModalLabel">⚠️ Error</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            An unexpected issue occurred. Please try again later or contact
            support for further assistance.
          </p>
          <p v-if="errorMessage" class="text-danger">
            <b>ERROR: {{ errorMessage }}</b>
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Loading Overlay -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const cars_data = ref([]);
const selectedBrand = ref(null);
const selectedModel = ref(null);
const selectedCar = ref({});
const selectedBatteryCapacity = ref(null);
const selectedAvailableChargers = ref([]);
const selectedProvider = ref([]);
const selectedReverseBattery = ref(10);
const selectedInitBattery = ref(50);
const selectedArrivalBattery = ref(50);
const manualInputChecked = ref(false);
const submitError = ref(false);
const isLoading = ref(false);
const errorMessage = ref(null);
const formRef = ref(null);

const providers = [
  { name: "PTT", logo: require("@/assets/station_logo/ptt.png") },
  { name: "PEA", logo: require("@/assets/station_logo/pea.png") },
  { name: "EleX", logo: require("@/assets/station_logo/elex.png") },
  { name: "Altervim", logo: require("@/assets/station_logo/altervim.png") },
  { name: "EA", logo: require("@/assets/station_logo/ea.png") },
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
  selectedModel.value = null; // Reset selected model when brand changes
  selectedBatteryCapacity.value = null; // Reset battery capacity
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
  event.target.value = null;
};

watch(manualInputChecked, () => {
  selectedBrand.value = null;
  selectedModel.value = null;
  selectedBatteryCapacity.value = null;
  selectedAvailableChargers.value = [];
});

onMounted(async () => {
  let map;
  let markers = [];

  const loader = new Loader({
    apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["maps", "routes", "places", "marker"],
  });
  const infoButton = () => {
    const infoButton = document.createElement("button");
    infoButton.classList.add("btn", "btn-info");
    infoButton.style.margin = "10px";
    infoButton.style.height = "50px";
    infoButton.style.width = "50px";
    infoButton.style.display = "flex"; // Add flexbox display
    infoButton.style.alignItems = "center"; // Center vertically
    infoButton.style.justifyContent = "center"; // Center horizontally
    infoButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>`;
    infoButton.setAttribute("data-bs-toggle", "modal");
    infoButton.setAttribute("data-bs-target", "#infoModal");
    return infoButton;
  };

  try {
    const response = await fetch(process.env.VUE_APP_API_URL + "/ev_cars");
    const data = await response.json();
    cars_data.value = data;
  } catch (error) {
    console.error(error);
  }

  let directionsService;
  let directionsRenderer;

  loader.load().then(async (google) => {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
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

  /* eslint-disable no-unused-vars */
  const handleSubmit = (event) => {
    submitError.value = false;
    if (!manualInputChecked.value) {
      if (!selectedBrand.value || !selectedModel.value) {
        alert("Please select your car brand and model!");
        submitError.value = true;
      }
    }

    if (!selectedBatteryCapacity.value) {
      alert("Please enter the battery capacity!");
      submitError.value = true;
    }

    if (!selectedAvailableChargers.value.length) {
      alert("Please select at least one charging port!");
      submitError.value = true;
    }

    if (!selectedProvider.value.length) {
      alert("Please select at least one provider!");
      submitError.value = true;
    }

    const origin = document.getElementById("search-origin").value;
    const destination = document.getElementById("search-destination").value;

    if (submitError.value) {
      console.error("Error in form submission!");
      return;
    } else {
      console.log("Form submitted successfully!");

      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
      directionsRenderer.setDirections({ routes: [] });

      const request = {
        origin_address: origin,
        destination_address: destination,
        car_brand: selectedBrand.value,
        car_model: selectedModel.value,
        battery_initial: selectedInitBattery.value,
        battery_arrival: selectedArrivalBattery.value,
        battery_capacity: selectedBatteryCapacity.value,
        charging_ports: selectedAvailableChargers.value.join(","),
        provider_filter: selectedProvider.value.join(","),
        method: "forward",
      };

      // Show loading overlay
      isLoading.value = true;

      fetch(process.env.VUE_APP_API_URL + "/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })
        .then((response) => response.json())
        .then((data) => {
          // Hide loading overlay
          isLoading.value = false;
          console.log("Success:", data);

          loader.load().then((google) => {
            function create_marker(location, title, data = null) {
              const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: title,
                icon: {
                  url: require(`@/assets/station_marker/${title.toLowerCase()}.png`),
                  scaledSize: new google.maps.Size(36, 45),
                },
              });
              markers.push(marker);
            }

            const waypts = data["solution detail"].map((station) => {
              create_marker(
                { lat: station.Latitude, lng: station.Longitude },
                station.Provider.toLowerCase(),
                station
              );
              return {
                location: { lat: station.Latitude, lng: station.Longitude },
                stopover: true,
              };
            });

            directionsService.route(
              {
                origin: origin,
                destination: destination,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === "OK") {
                  directionsRenderer.setDirections(result);

                  var origin_leg = result.routes[0].legs[0];
                  var destination_leg =
                    result.routes[0].legs[result.routes[0].legs.length - 1];

                  create_marker(origin_leg.start_location, "origin");
                  create_marker(destination_leg.end_location, "destination");
                } else {
                  alert("Directions request failed due to " + status);
                }
              }
            );

            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  if (formRef.value) {
    formRef.value.addEventListener("submit", handleSubmit);
  }
});
</script>

<script>
export default {
  name: "FormMaps",
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>
