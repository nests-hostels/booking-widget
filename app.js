document.addEventListener("DOMContentLoaded", function () {
    const datepicker = flatpickr("#datepicker", {
        mode: "range",
        altInput: true,
        altFormat: "d M",
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function (selectedDates) {
            if (selectedDates.length === 2) {
                document.getElementById("checkin").value = flatpickr.formatDate(selectedDates[0], "Y-m-d");
                document.getElementById("checkout").value = flatpickr.formatDate(selectedDates[1], "Y-m-d");

                const diffInDays = Math.ceil((selectedDates[1] - selectedDates[0]) / (1000 * 3600 * 24));
                document.getElementById("nights-text").textContent = `${diffInDays} noches`;
                document.getElementById("nights-container").classList.remove("hidden");

                // Cambia al paso 3
                updateBreadcrumb(3);
            } else {
                document.getElementById("checkin").value = "";
                document.getElementById("checkout").value = "";
                document.getElementById("nights-text").textContent = "0 noches";
                document.getElementById("nights-container").classList.add("hidden");

                // Regresa al paso 2
                updateBreadcrumb(2);
            }
        }
    });

    // Incremento y decremento de huéspedes
    const guestInput = document.getElementById("guests");
    const incrementButton = document.getElementById("increment-guests");
    const decrementButton = document.getElementById("decrement-guests");
    const minGuests = parseInt(guestInput.min) || 1;
    const maxGuests = parseInt(guestInput.max) || 10;

    incrementButton.addEventListener("click", function () {
        let currentValue = parseInt(guestInput.value);
        if (currentValue < maxGuests) {
            guestInput.value = currentValue + 1;

            // Cambia al paso 4 si se seleccionaron huéspedes
            updateBreadcrumb(4);
        }
    });

    decrementButton.addEventListener("click", function () {
        let currentValue = parseInt(guestInput.value);
        if (currentValue > minGuests) {
            guestInput.value = currentValue - 1;
        }
    });

    // Detecta la selección de un destino y avanza al siguiente paso
    const propertySelect = document.getElementById("property");
    propertySelect.addEventListener("change", function () {
        if (propertySelect.value) {
            // Cambia al paso 2 al seleccionar un destino
            updateBreadcrumb(2);
        }
    });

    // Funcionalidad del botón Limpiar
    const clearButton = document.getElementById("clear-button");
    clearButton.addEventListener("click", function () {
        // Restablece los campos del formulario
        propertySelect.value = "";
        datepicker.clear();
        guestInput.value = 1;
        document.getElementById("checkin").value = "";
        document.getElementById("checkout").value = "";
        document.getElementById("nights-text").textContent = "0 noches";
        document.getElementById("nights-container").classList.add("hidden");

        // Reinicia el breadcrumb al paso 1
        updateBreadcrumb(1);
    });

    // Actualización dinámica del breadcrumb
    function updateBreadcrumb(currentStep) {
        for (let i = 1; i <= 4; i++) {
            const stepElement = document.getElementById(`step-${i}`);
            const lineElement = stepElement.parentElement.nextElementSibling;

            if (i < currentStep) {
                stepElement.classList.add("bg-orange-500", "text-white");
                stepElement.classList.remove("bg-white", "text-orange-500");
                if (lineElement && lineElement.classList.contains("breadcrumb-line")) {
                    lineElement.classList.add("bg-orange-500");
                }
            } else if (i === currentStep) {
                stepElement.classList.add("bg-white", "text-orange-500", "border-orange-500");
                stepElement.classList.remove("bg-orange-500", "text-white");
            } else {
                stepElement.classList.remove("bg-orange-500", "text-white");
                stepElement.classList.add("bg-white", "text-orange-500");
                if (lineElement && lineElement.classList.contains("breadcrumb-line")) {
                    lineElement.classList.remove("bg-orange-500");
                }
            }
        }
    }

    // Inicializa el breadcrumb en el paso 1
    updateBreadcrumb(1);

    // Ajuste para abrir la URL en una nueva ventana con los parámetros como URL completa
    document.getElementById("widgetBookingForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const property = document.getElementById("property").value;
        const checkin = document.getElementById("checkin").value;
        const checkout = document.getElementById("checkout").value;
        const guests = guestInput.value;

        if (!property || !checkin || !checkout) {
            alert("Por favor, completa todos los campos de destino, fechas y huéspedes antes de continuar.");
            return;
        }

        // Construcción de la URL con los parámetros
        const baseUrl = "https://hotels.cloudbeds.com/reservas/";
        const fullUrl = `${baseUrl}${property}?checkin=${checkin}&checkout=${checkout}&adults=${guests}`;

        console.log("Abriendo URL en nueva pestaña:", fullUrl);

        // Abre la URL en una nueva pestaña
        window.open(fullUrl, "_self");
    });
});