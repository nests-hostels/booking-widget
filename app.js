document.addEventListener("DOMContentLoaded", function () {
    const breadcrumb = document.getElementById("breadcrumb");
    const submitButton = document.getElementById("submit-button");
    const clearButton = document.getElementById("clear-button");
    const guestInput = document.getElementById("guests");
    const incrementButton = document.getElementById("increment-guests");
    const decrementButton = document.getElementById("decrement-guests");
    const propertySelect = document.getElementById("property");
    const datepickerInput = document.getElementById("datepicker");
    const checkinInput = document.getElementById("checkin");
    const checkoutInput = document.getElementById("checkout");
    const nightsText = document.getElementById("nights-text");
    const nightsContainer = document.getElementById("nights-container");

    let breadcrumbActivated = false;
    let propertySelected = false;
    let datesSelected = false;
    let guestsSelected = false;

    // Inicialización de flatpickr con el campo en modo readonly
    const datepicker = flatpickr(datepickerInput, {
        mode: "range",
        altInput: true,
        altFormat: "d M",
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: handleDateChange
    });
    datepickerInput.setAttribute("readonly", true); // El calendario está inicialmente inactivo

    // Configuración inicial de UI
    initializeUI();

    function initializeUI() {
        breadcrumb.classList.add("hidden", "opacity-0", "invisible", "-translate-y-2");
        disableButton(clearButton, false); // El botón limpiar siempre está activo
        disableInput(guestInput, true);
    }

    function showBreadcrumb() {
        if (!breadcrumbActivated) {
            breadcrumb.classList.remove("hidden", "opacity-0", "invisible", "-translate-y-2");
            breadcrumbActivated = true;
        }
    }

    function handleDateChange(selectedDates) {
        if (!propertySelected) return;

        if (selectedDates.length === 2) {
            checkinInput.value = flatpickr.formatDate(selectedDates[0], "Y-m-d");
            checkoutInput.value = flatpickr.formatDate(selectedDates[1], "Y-m-d");

            const diffInDays = Math.ceil((selectedDates[1] - selectedDates[0]) / (1000 * 3600 * 24));
            nightsText.textContent = `${diffInDays} noches`;
            nightsContainer.classList.remove("hidden");

            datesSelected = true;
            enableGuestSelection(); // Habilitar selección de huéspedes después de elegir fechas
            updateBreadcrumb(2);
        } else {
            resetDates();
            datesSelected = false;
            updateBreadcrumb(1);
        }
    }

    function handleGuestChange(increment = true) {
        if (!datesSelected) return;

        const currentGuests = parseInt(guestInput.value);
        const maxGuests = parseInt(guestInput.max);
        const minGuests = parseInt(guestInput.min);

        if (increment && currentGuests < maxGuests) {
            guestInput.value = currentGuests + 1;
        } else if (!increment && currentGuests > minGuests) {
            guestInput.value = currentGuests - 1;
        }
        guestsSelected = true;
        updateBreadcrumb(3);
    }

    function resetDates() {
        checkinInput.value = "";
        checkoutInput.value = "";
        nightsText.textContent = "0 noches";
        nightsContainer.classList.add("hidden");
        datesSelected = false;
    }

    function resetWidget() {
        // Restablecer todos los campos del formulario
        propertySelect.value = "";
        datepicker.clear(); // Limpiar el calendario
        datepickerInput.setAttribute("readonly", true); // Deshabilitar el datepicker al reiniciar
        guestInput.value = 1; // Reiniciar el número de huéspedes
        disableInput(guestInput, true); // Deshabilitar el campo de huéspedes
        resetDates(); // Restablecer las fechas
        resetBreadcrumb(); // Restablecer el breadcrumb visualmente

        // Restablecer los estados de activación
        breadcrumb.classList.add("opacity-0", "invisible", "-translate-y-2");
        setTimeout(() => breadcrumb.classList.add("hidden"), 1000);

        breadcrumbActivated = false;
        propertySelected = false;
        datesSelected = false;
        guestsSelected = false;
    }

    function updateBreadcrumb(currentStep) {
        for (let i = 1; i <= 4; i++) {
            const stepElement = document.getElementById(`step-${i}`);
            const lineElement = stepElement.parentElement.nextElementSibling?.querySelector(".breadcrumb-line");

            if (i < currentStep) {
                stepElement.classList.add("bg-orange-500", "text-white");
                stepElement.classList.remove("bg-white", "text-orange-500");
                if (lineElement) lineElement.style.width = "100%";
            } else if (i === currentStep) {
                stepElement.classList.add("bg-orange-500", "text-white");
                stepElement.classList.remove("bg-white", "text-orange-500");
                if (lineElement) lineElement.style.width = "0";
            } else {
                stepElement.classList.add("bg-white", "text-orange-500");
                stepElement.classList.remove("bg-orange-500", "text-white");
                if (lineElement) lineElement.style.width = "0";
            }
        }
    }

    function resetBreadcrumb() {
        updateBreadcrumb(1);
    }

    function disableButton(button, disable) {
        button.disabled = disable;
    }

    function disableInput(input, disable) {
        input.disabled = disable;
    }

    function enableDatepicker() {
        datepickerInput.removeAttribute("readonly"); // Habilita el datepicker
    }

    function enableGuestSelection() {
        disableInput(guestInput, false); // Habilita el campo de huéspedes
    }

    // Eventos de interacción del usuario
    propertySelect.addEventListener("change", function () {
        if (propertySelect.value) {
            showBreadcrumb();
            propertySelected = true;
            enableDatepicker(); // Habilitar el datepicker al seleccionar un destino
            updateBreadcrumb(1);
        } else {
            resetWidget();
        }
    });

    incrementButton.addEventListener("click", function () {
        handleGuestChange(true);
    });

    decrementButton.addEventListener("click", function () {
        handleGuestChange(false);
    });

    clearButton.addEventListener("click", function () {
        resetWidget(); // Restablece todo el formulario al hacer clic en "Limpiar"
    });

    document.getElementById("widgetBookingForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const property = propertySelect.value;
        const checkin = checkinInput.value;
        const checkout = checkoutInput.value;
        const guests = guestInput.value;

        if (!property || !checkin || !checkout) {
            alert("Por favor, completa todos los campos de destino, fechas y huéspedes antes de continuar.");
            return;
        }

        const baseUrl = "https://hotels.cloudbeds.com/reservas/";
        bookingIframe.src = `${baseUrl}${property}?checkin=${checkin}&checkout=${checkout}&adults=${guests}`;
        bookingModal.classList.remove("hidden");

        updateBreadcrumb(4);
    });

    document.getElementById("closeModalButton").addEventListener("click", function () {
        bookingModal.classList.add("hidden");
        bookingIframe.src = "";
        setTimeout(() => breadcrumb.classList.add("hidden"), 1000);
    });
});