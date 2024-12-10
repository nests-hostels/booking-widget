class BookingWidget {
    constructor(config, widget) {
        this.config = config;
        this.widgetContainer = widget;
        if (!this.widgetContainer) {
            console.error(`Booking Widget container no encontrado.`);
            return;
        }
        this.initElements();
        this.init();
    }

    initElements() {
        try {
            this.form = this.widgetContainer.querySelector(
                `.${this.config.formClass}`
            );
            this.propertySelect = this.form.querySelector(
                `.${this.config.propertyClass}`
            );
            this.datepicker = this.form.querySelector(
                `.${this.config.datepickerClass}`
            );
            this.checkinInput = this.form.querySelector(
                `.${this.config.checkinClass}`
            );
            this.checkoutInput = this.form.querySelector(
                `.${this.config.checkoutClass}`
            );
            this.guestsInput = this.form.querySelector(`.${this.config.guestsClass}`);
            this.decrementGuestsButton = this.form.querySelector(
                `.${this.config.decrementGuestsClass}`
            );
            this.incrementGuestsButton = this.form.querySelector(
                `.${this.config.incrementGuestsClass}`
            );
            this.submitButton = this.form.querySelector(
                `.${this.config.submitButtonClass}`
            );
            this.clearButton = this.form.querySelector(
                `.${this.config.clearButtonClass}`
            );
            this.bookingModal = document.querySelector(`.${this.config.modalClass}`);
            this.closeModalButton = this.bookingModal.querySelector(
                `.${this.config.closeModalButtonClass}`
            );
            this.loadingIndicator = this.bookingModal.querySelector(
                `.${this.config.loadingIndicatorClass}`
            );
            this.rateCheckMessage = this.bookingModal.querySelector(
                `.${this.config.rateCheckMessageClass}`
            );
            this.bookingIframe = this.bookingModal.querySelector(
                `.${this.config.bookingIframeClass}`
            );
            this.breadcrumbContainer = this.widgetContainer.querySelector(
                `.${this.config.breadcrumbContainerClass}`
            );
            this.breadcrumbSteps = this.breadcrumbContainer.querySelectorAll(
                ".breadcrumb-step"
            );
            this.nightsContainer = this.widgetContainer.querySelector(
                `.${this.config.nightsContainerClass}`
            );
            this.nightsText = this.widgetContainer.querySelector(
                `.${this.config.nightsTextClass}`
            );
            this.errorPopup = this.widgetContainer.querySelector(
                `.${this.config.errorPopupClass}`
            );
            this.errorText = this.errorPopup.querySelector(
                `.${this.config.errorTextClass}`
            );
            this.errorCloseButton = this.errorPopup.querySelector(
                `.${this.config.errorCloseButtonClass}`
            );
        } catch (error) {
            console.error("Error al inicializar elementos:", error);
        }
    }

    init() {
        if (!this.form) {
            console.error("Formulario no encontrado en el widget.");
            return;
        }
        this.initDatepicker();
        this.initGuestsButtons();
        this.initFormSubmission();
        this.initClearButton();
        this.initCloseModalButton();
        this.initBreadcrumb();
        this.initErrorPopup();
    }

    // Métodos de gestión y lógica del widget permanecen iguales
    // (resetBreadcrumb, showBreadcrumb, hideBreadcrumb, initBreadcrumb, etc.)
    initErrorPopup() {
        this.errorCloseButton.addEventListener("click", () => {
            this.errorPopup.classList.add("hidden");
        });
    }

    /*showErrorPopup(message) {
        this.errorText.textContent = message;
        this.errorPopup.classList.remove("hidden");
    }*/

    resetBreadcrumb() {
        this.breadcrumbSteps.forEach((stepElement) => {
            const circle = stepElement.querySelector(".circle");
            const label = stepElement.querySelector(".label");
            circle.classList.add("bg-gray-100", "text-gray-500");
            circle.classList.remove("bg-orange-500", "text-white");
            label.classList.add("text-gray-500");
            label.classList.remove("text-orange-500");
        });
        this.hideBreadcrumb();
    }

    showBreadcrumb() {
        this.breadcrumbContainer.classList.remove("hidden");
        setTimeout(() => {
            this.breadcrumbContainer.classList.remove("opacity-0", "-translate-y-4");
            this.breadcrumbContainer.classList.add("opacity-100", "translate-y-0");
        }, 100);
    }

    hideBreadcrumb() {
        this.breadcrumbContainer.classList.add("opacity-0", "-translate-y-4");
        this.breadcrumbContainer.classList.remove("opacity-100", "translate-y-0");
        setTimeout(() => {
            this.breadcrumbContainer.classList.add("hidden");
        }, 300);
    }

    initBreadcrumb() {
        this.propertySelect.addEventListener("change", () => {
            if (this.propertySelect.value) {
                this.showBreadcrumb();
                this.updateBreadcrumb(1);
            } else {
                this.resetBreadcrumb();
            }
        });

        this.datepicker.addEventListener("change", () => {
            if (this.propertySelect.value && this.datepicker.value) {
                this.showBreadcrumb();
                this.updateBreadcrumb(2);
                this.updateNights();
            }
        });

        this.decrementGuestsButton.addEventListener("click", () => {
            if (this.propertySelect.value && this.guestsInput.value > 0) {
                this.showBreadcrumb();
                this.updateBreadcrumb(3);
            }
        });

        this.incrementGuestsButton.addEventListener("click", () => {
            if (this.propertySelect.value && this.guestsInput.value > 0) {
                this.showBreadcrumb();
                this.updateBreadcrumb(3);
            }
        });

        this.submitButton.addEventListener("click", (event) => {
            if (
                this.propertySelect.value &&
                this.datepicker.value &&
                this.guestsInput.value > 0
            ) {
                this.showBreadcrumb();
                this.updateBreadcrumb(4);
            } else {
                event.preventDefault();
                this.showErrorPopup("Por favor, completa todos los campos.");
            }
        });
    }

    updateBreadcrumb(step) {
        this.breadcrumbSteps.forEach((stepElement) => {
            const stepNumber = parseInt(stepElement.dataset.step, 10);
            const circle = stepElement.querySelector(".circle");
            const label = stepElement.querySelector(".label");

            if (stepNumber < step) {
                circle.classList.add("bg-orange-500", "text-white");
                circle.classList.remove("bg-gray-100", "text-gray-500");
                label.classList.add("text-orange-500");
                label.classList.remove("text-gray-300");
            } else if (stepNumber === step) {
                circle.classList.add("bg-orange-500", "text-white");
                circle.classList.remove("bg-gray-100", "text-gray-500");
                label.classList.add("text-orange-500");
                label.classList.remove("text-gray-300");
            } else {
                circle.classList.add("bg-gray-100", "text-gray-500");
                circle.classList.remove("bg-orange-500", "text-white");
                label.classList.add("text-gray-300");
                label.classList.remove("text-orange-500");
            }
        });
    }

    updateNights() {
        const checkinDate = new Date(this.checkinInput.value);
        const checkoutDate = new Date(this.checkoutInput.value);

        if (checkinDate && checkoutDate && checkoutDate > checkinDate) {
            const nights = Math.ceil(
                (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)
            );

            this.nightsContainer.classList.remove(
                "hidden",
                "opacity-0",
                "-translate-y-4"
            );
            this.nightsContainer.classList.add("opacity-100", "translate-y-0");
            this.nightsText.textContent = `${nights} noche${nights > 1 ? "s" : ""}`;
        } else {
            this.nightsContainer.classList.add("opacity-0", "-translate-y-4");
            this.nightsContainer.classList.remove("opacity-100", "translate-y-0");
            setTimeout(() => {
                this.nightsContainer.classList.add("hidden");
            }, 300);
            this.nightsText.textContent = "0 noches";
        }
    }

    handleCloseModal() {
        this.hideBreadcrumb();
        this.bookingModal.classList.add("opacity-0", "scale-95");
        this.bookingModal.classList.remove("opacity-100", "scale-100");

        // Reiniciar el widget al cerrar el modal
        this.handleClear();

        setTimeout(() => {
            this.bookingModal.classList.add("hidden");
            this.bookingIframe.src = "";
        }, 300);
    }

    handleClear() {
        this.form.reset();
        this.resetBreadcrumb();
        this.datepickerInstance.clear();
        this.bookingIframe.src = "";

        this.hideBreadcrumb();
        this.nightsContainer.classList.add("opacity-0", "-translate-y-4");
        this.nightsContainer.classList.remove("opacity-100", "translate-y-0");
        setTimeout(() => {
            this.nightsContainer.classList.add("hidden");
        }, 300);
        this.nightsText.textContent = "0 noches";
    }

    initDatepicker() {
        if (!this.datepicker || !this.checkinInput || !this.checkoutInput) {
            console.error("Elementos del datepicker no encontrados");
            return;
        }
        this.datepickerInstance = flatpickr(this.datepicker, {
            mode: "range",
            dateFormat: "d-m",
            onChange: this.handleDateChange.bind(this),
            locale: {
                firstDayOfWeek: 1
            },
            minDate: "today"
        });
    }

    handleDateChange(selectedDates) {
        if (selectedDates.length === 2) {
            const [checkinDate, checkoutDate] = selectedDates;
            this.checkinInput.value = this.formatDate(checkinDate);
            this.checkoutInput.value = this.formatDate(checkoutDate);
            this.updateNights();
        } else {
            this.checkinInput.value = "";
            this.checkoutInput.value = "";
            this.updateNights();
        }
    }

    formatDate(date) {
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - offset * 60 * 1000);
        return date.toISOString().split("T")[0];
    }

    initGuestsButtons() {
        if (
            !this.decrementGuestsButton ||
            !this.incrementGuestsButton ||
            !this.guestsInput
        ) {
            console.error("Botones o input de huéspedes no encontrados");
            return;
        }
        this.decrementGuestsButton.addEventListener(
            "click",
            this.decrementGuests.bind(this)
        );
        this.incrementGuestsButton.addEventListener(
            "click",
            this.incrementGuests.bind(this)
        );
    }

    decrementGuests() {
        const currentValue = parseInt(this.guestsInput.value, 10);
        if (currentValue > 1) {
            this.guestsInput.value = currentValue - 1;
        }
    }

    incrementGuests() {
        const currentValue = parseInt(this.guestsInput.value, 10);
        if (currentValue < 10) {
            this.guestsInput.value = currentValue + 1;
        }
    }

    initFormSubmission() {
        this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault();

        const propertyId = this.propertySelect.value;
        const checkinDate = this.checkinInput.value;
        const checkoutDate = this.checkoutInput.value;
        const guests = this.guestsInput.value;

        if (!propertyId || !checkinDate || !checkoutDate || !guests) {
            this.showErrorPopup("Por favor, completa todos los campos.");
            return;
        }

        const cloudbedsUrl = `https://hotels.cloudbeds.com/reservas/${propertyId}?checkin=${checkinDate}&checkout=${checkoutDate}&adults=${guests}`;

        this.bookingModal.classList.remove("hidden", "opacity-0", "scale-95");
        this.bookingModal.classList.add("opacity-100", "scale-100");
        this.loadingIndicator.classList.remove("hidden");

        setTimeout(() => {
            this.loadingIndicator.classList.add("hidden");
            this.bookingIframe.src = cloudbedsUrl;

            this.rateCheckMessage.classList.remove("opacity-0");
            setTimeout(() => {
                this.rateCheckMessage.classList.add("opacity-0");
            }, 4000);
        }, 2000);
    }

    showErrorPopup(message) {
        // Usar las clases configuradas para seleccionar los elementos
        const errorPopup = document.querySelector(
            `.${this.config.errorPopupClass}`
        );
        const errorPopupMessage = errorPopup.querySelector(
            `.${this.config.errorTextClass}`
        );
        const errorPopupClose = errorPopup.querySelector(
            `.${this.config.errorCloseButtonClass}`
        );

        if (!errorPopup || !errorPopupMessage || !errorPopupClose) {
            console.error("Error popup elements are missing in the DOM");
            return;
        }

        // Actualizar el mensaje de error y mostrar el popup
        errorPopupMessage.textContent = message;
        errorPopup.classList.remove("hidden");

        // Agregar evento para cerrar el popup
        errorPopupClose.addEventListener("click", () => {
            errorPopup.classList.add("hidden");
        });
    }

    initClearButton() {
        this.clearButton.addEventListener("click", this.handleClear.bind(this));
    }

    initCloseModalButton() {
        this.closeModalButton.addEventListener(
            "click",
            this.handleCloseModal.bind(this)
        );
    }
}

// Configuración del widget
const widgetConfig = {
    formClass: "widget-form",
    propertyClass: "property-select",
    datepickerClass: "datepicker",
    checkinClass: "checkin",
    checkoutClass: "checkout",
    guestsClass: "guests",
    decrementGuestsClass: "decrement-guests",
    incrementGuestsClass: "increment-guests",
    submitButtonClass: "submit-button",
    clearButtonClass: "clear-button",
    modalClass: "booking-modal",
    closeModalButtonClass: "close-modal-button",
    loadingIndicatorClass: "loading-indicator",
    rateCheckMessageClass: "rate-check-message",
    bookingIframeClass: "booking-iframe",
    breadcrumbContainerClass: "breadcrumb-container",
    nightsContainerClass: "nights-container",
    nightsTextClass: "nights-text",
    errorPopupClass: "error-popup",
    errorTextClass: "error-text",
    errorCloseButtonClass: "error-close-button"
};

// Inicialización de widgets
document.addEventListener("DOMContentLoaded", () => {
    const widgets = document.querySelectorAll('.widget-container');

    widgets.forEach(widget => {
        // console.log(widget)
        new BookingWidget(widgetConfig, widget);
    })
    /*new BookingWidget(widgetConfig, "widget-1");
    new BookingWidget(widgetConfig, "widget-2");

    if (document.querySelector('[data-widget-id="3"]')) {
        console.log(`widget-3`)
        new BookingWidget(widgetConfig, "widget-3");
    }
    if (document.querySelector('[data-widget-id="111"]')) {
        console.log(`widget-111`);
        new BookingWidget(widgetConfig, "widget-111");
    }*/
});
