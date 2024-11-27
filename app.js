document.addEventListener("DOMContentLoaded", function () {
    // Inicializamos los selectores de fechas
    const checkinPicker = flatpickr("#checkin", {
        altInput: true,
        altFormat: "d M",
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: updateNights
    });

    const checkoutPicker = flatpickr("#checkout", {
        altInput: true,
        altFormat: "d M",
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: updateNights
    });

    // Función para actualizar la cantidad de noches y mostrar/ocultar el dropdown dinámicamente
    function updateNights() {
        const checkinDate = checkinPicker.selectedDates[0];
        const checkoutDate = checkoutPicker.selectedDates[0];
        const nightsText = document.getElementById("nights-text");
        const nightsCount = document.getElementById("nights-count");
        const dropdownContainer = document.getElementById("dropdown-container");

        if (checkinDate && checkoutDate) {
            const diffInTime = checkoutDate.getTime() - checkinDate.getTime();
            const diffInDays = diffInTime / (1000 * 3600 * 24);

            if (diffInDays > 0) {
                nightsText.textContent = `${diffInDays} noches`;
                nightsCount.textContent = diffInDays;
                dropdownContainer.classList.remove("hidden"); // Muestra el dropdown
            } else {
                nightsText.textContent = "0 noches";
                nightsCount.textContent = 0;
                dropdownContainer.classList.add("hidden"); // Oculta el dropdown si las fechas son inválidas
            }
        } else {
            nightsText.textContent = "0 noches";
            nightsCount.textContent = 0;
            dropdownContainer.classList.add("hidden"); // Oculta el dropdown si no hay fechas seleccionadas
        }
    }

    // Evento para el botón de dropdown
    document.getElementById("dropdown-button").addEventListener("click", function () {
        const dropdownMenu = document.getElementById("dropdown-menu");
        dropdownMenu.classList.toggle("hidden");
    });

    // Evento para el botón de limpiar fechas
    document.getElementById("clear-dates").addEventListener("click", function () {
        checkinPicker.clear();
        checkoutPicker.clear();
        updateNights(); // Actualiza el estado después de limpiar
        document.getElementById("dropdown-menu").classList.add("hidden"); // Cierra el dropdown después de limpiar
    });

    // Evento para el botón de "¡Vamos!"
    document.getElementById("submit-button").addEventListener("click", function () {
        console.log("Reserva procesada correctamente");
    });
});