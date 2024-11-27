document.addEventListener("DOMContentLoaded", function () {
    // Referencias a los elementos del DOM
    const propertyInput = document.getElementById("property");
    const datepicker = flatpickr("#datepicker", {
        mode: "range",
        altInput: true,
        altFormat: "d M",
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: handleDateSelection
    });
    const guestInput = document.getElementById("guests");
    const incrementButton = document.getElementById("increment-guests");
    const decrementButton = document.getElementById("decrement-guests");
    const clearButton = document.getElementById("clear-button");
    const bookingForm = document.getElementById("widgetBookingForm");
    const bookingModal = document.getElementById("bookingModal");
    const bookingIframe = document.getElementById("bookingIframe");
    const closeModalButton = document.getElementById("closeModalButton");
    const breadcrumb = document.getElementById("breadcrumb");
    const breadcrumbSteps = document.querySelectorAll(".breadcrumb-step");
    const breadcrumbLines = document.querySelectorAll(".breadcrumb-line");
    const rateCheckMessage = document.getElementById("rateCheckMessage");
    const loadingIndicator = document.getElementById("loadingIndicator");

    // Función genérica para mostrar/ocultar elementos
    const toggleVisibility = (element, show) => {
        if (show) {
            element.classList.remove("hidden", "opacity-0");
            element.classList.add("opacity-100");
        } else {
            element.classList.add("hidden", "opacity-0");
            element.classList.remove("opacity-100");
        }
    };

    // Muestra el breadcrumb con animaciones
    function showBreadcrumb() {
        toggleVisibility(breadcrumb, true);
        breadcrumb.classList.remove("-translate-y-2");
        breadcrumb.classList.add("translate-y-0");
    }

    // Oculta el breadcrumb y reinicia su estado
    function resetBreadcrumb() {
        breadcrumbSteps.forEach((step) => {
            step.classList.remove("bg-orange-500", "text-white");
            step.classList.add("bg-white", "text-orange-500");
            step.removeAttribute("aria-current");
        });

        breadcrumbLines.forEach((line) => {
            line.classList.remove("w-full");
        });

        toggleVisibility(breadcrumb, false);
    }

    // Marca un paso del breadcrumb como verificado
    function markBreadcrumbStep(stepIndex) {
        if (breadcrumbSteps[stepIndex]) {
            const step = breadcrumbSteps[stepIndex];
            step.classList.add("bg-orange-500", "text-white");
            step.classList.remove("bg-white", "text-orange-500");
            step.setAttribute("aria-current", "step");

            const line = breadcrumbLines[stepIndex];
            if (line) {
                line.classList.add("w-full");
            }
        }
    }

    // Actualiza la cantidad de huéspedes
    function updateGuestCount(delta) {
        const minGuests = parseInt(guestInput.min, 10) || 1;
        const maxGuests = parseInt(guestInput.max, 10) || 10;
        const currentValue = parseInt(guestInput.value, 10);

        const newValue = currentValue + delta;
        if (newValue >= minGuests && newValue <= maxGuests) {
            guestInput.value = newValue;
            validateGuestStep();
        }
    }

    // Valida el paso de huéspedes
    function validateGuestStep() {
        if (parseInt(guestInput.value, 10) > 0) {
            markBreadcrumbStep(2);
        }
    }

    // Limpia los campos de fecha
    function clearDateFields() {
        document.getElementById("checkin").value = "";
        document.getElementById("checkout").value = "";
        document.getElementById("nights-text").textContent = "0 noches";
        document.getElementById("nights-container").classList.add("hidden");
    }

    // Limpia todos los campos y reinicia el formulario
    function clearForm() {
        propertyInput.value = "";
        datepicker.clear();
        guestInput.value = 1;
        clearDateFields();
        resetBreadcrumb();
    }

    // Maneja la selección de fechas
    function handleDateSelection(selectedDates) {
        const checkinInput = document.getElementById("checkin");
        const checkoutInput = document.getElementById("checkout");
        const nightsText = document.getElementById("nights-text");
        const nightsContainer = document.getElementById("nights-container");

        if (selectedDates.length === 2) {
            const [checkinDate, checkoutDate] = selectedDates;

            checkinInput.value = flatpickr.formatDate(checkinDate, "Y-m-d");
            checkoutInput.value = flatpickr.formatDate(checkoutDate, "Y-m-d");

            const diffInDays = Math.ceil(
                (checkoutDate - checkinDate) / (1000 * 3600 * 24)
            );
            nightsText.textContent = `${diffInDays} noches`;
            nightsContainer.classList.remove("hidden");
            markBreadcrumbStep(1);
        } else {
            clearDateFields();
        }
    }

    // Maneja el envío del formulario
    function handleFormSubmit(event) {
        event.preventDefault();

        const property = propertyInput.value;
        const checkin = document.getElementById("checkin").value;
        const checkout = document.getElementById("checkout").value;
        const guests = guestInput.value;

        if (!property || !checkin || !checkout) {
            alert(
                "Por favor, completa todos los campos de destino, fechas y huéspedes antes de continuar."
            );
            return;
        }

        markBreadcrumbStep(3);

        const baseUrl = "https://hotels.cloudbeds.com/reservas/";
        const fullUrl = `${baseUrl}${property}?checkin=${checkin}&checkout=${checkout}&adults=${guests}`;

        bookingIframe.src = fullUrl;
        toggleVisibility(bookingModal, true);
        showRateCheckMessage();
    }

    // Muestra el mensaje de Rate Check
    function showRateCheckMessage() {
        toggleVisibility(rateCheckMessage, true);
        setTimeout(() => toggleVisibility(rateCheckMessage, false), 4000);
    }

    // Cierra el modal y limpia el iframe
    function closeModal() {
        toggleVisibility(bookingModal, false);
        bookingIframe.src = "";
    }

    // Eventos
    propertyInput.addEventListener("change", () => {
        if (propertyInput.value) {
            showBreadcrumb();
            markBreadcrumbStep(0);
        }
    });

    incrementButton.addEventListener("click", () => updateGuestCount(1));
    decrementButton.addEventListener("click", () => updateGuestCount(-1));
    clearButton.addEventListener("click", clearForm);
    bookingForm.addEventListener("submit", handleFormSubmit);
    closeModalButton.addEventListener("click", closeModal);

    datepicker.input.addEventListener("change", function () {
        if (datepicker.selectedDates.length === 2) {
            markBreadcrumbStep(1);
        }
    });
});
