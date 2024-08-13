document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const grid = document.getElementById("grid");
    const toggleBtn = document.getElementById("toggleBtn");
    const gridSizeSelect = document.getElementById("gridSize");
    const messageContainer = document.getElementById("message-container");
    const messageElement = document.getElementById("message");
    const closeButton = document.getElementById("close-message");

    // Initialize state variables
    let hoverActive = false; // Controls whether the grid reacts to hover events
    let hoverCount = 0; // Counts the number of cells hovered over
    let imagePlaced = false; // Tracks whether the image has been placed in the grid
    let selectedImageCell = null; // Stores the cell where the image will be placed

    // Function to create the grid based on the selected size
    function createGrid(size) {
        grid.innerHTML = ''; // Clear any existing grid content
        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // Set up grid columns
        grid.style.gridTemplateRows = `repeat(${size}, 1fr)`; // Set up grid rows
        const cells = [];

        // Create individual grid cells
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            grid.appendChild(cell);
            cells.push(cell);
        }

        // Randomly select one cell where the image will be placed later
        selectedImageCell = cells[Math.floor(Math.random() * cells.length)];
    }

    // Function to handle hover events on grid cells
    function toggleHover(event) {
        if (!hoverActive) return; // Exit if hover interaction is disabled

        if (event.target.classList.contains("cell")) {
            if (event.target.classList.contains("hover-active")) {
                // Revert cell to original state if already active
                event.target.classList.remove("hover-active");
                hoverCount--;
            } else {
                // Activate cell and check if it is the special image cell
                hoverCount++;
                event.target.classList.add("hover-active");

                // If the image cell is found, place the image in it
                if (event.target === selectedImageCell) {
                    placeImageInCell(event.target);
                }
            }
        }
    }

    // Function to place the image in the selected cell
    function placeImageInCell(cell) {
        if (imagePlaced) return; // Prevent placing the image more than once
        cell.classList.add('image-cell');
        const img = document.createElement('img');
        img.src = 'Mask-group-5.jpg'; // Ensure this path is correct
        img.alt = 'Squirrel Image';
        cell.appendChild(img);
        imagePlaced = true;

        // Display a message to the user after the image is placed
        setTimeout(() => {
            showMessage(`Image found! Hovered over ${hoverCount} cells before the image appeared.`);
            hoverActive = false; // Disable further hover interactions
            toggleBtn.textContent = 'Stop'; // Update button text
            toggleBtn.setAttribute("aria-pressed", "true");
        }, 100); // Short delay to ensure visual placement of the image
    }

    // Function to show an on-screen message
    function showMessage(text) {
        messageElement.textContent = text;
        messageContainer.classList.remove("hidden");
    }

    // Function to close the on-screen message
    function closeMessage() {
        messageContainer.classList.add("hidden");
        hoverActive = false; // Ensure hover interactions are disabled when closing the message
    }

    // Event listener for the message close button
    closeButton.addEventListener("click", closeMessage);

    // Event listener for grid cell hover events
    grid.addEventListener("mouseover", toggleHover);

    // Function to reset the game state and grid
    function resetGame() {
        hoverActive = false;
        hoverCount = 0;
        imagePlaced = false;
        selectedImageCell = null;
        resetGrid(); // Clear grid cells
        toggleBtn.textContent = 'Start';
        toggleBtn.setAttribute("aria-pressed", "false");
        closeMessage(); // Ensure any message is closed when resetting the game
    }

    // Function to clear grid cell styles and content
    function resetGrid() {
        document.querySelectorAll(".cell.hover-active").forEach(cell => {
            cell.classList.remove("hover-active");
        });
        document.querySelectorAll(".image-cell").forEach(cell => {
            cell.classList.remove("image-cell");
            cell.innerHTML = ''; // Remove image
        });
    }

    // Event listener for the start/stop button
    toggleBtn.addEventListener("click", () => {
        const selectedSize = gridSizeSelect.value;

        if (!selectedSize) {
            // If no grid size is selected, show a message and do not start the game
            showMessage("Please pick a grid size.");
            return; 
        }

        if (!hoverActive && !imagePlaced) {
            // If the game is not active, start a new session
            hoverActive = true;
            hoverCount = 0;
            imagePlaced = false;
            toggleBtn.textContent = 'Stop';
            toggleBtn.setAttribute("aria-pressed", "true");
            createGrid(parseInt(selectedSize, 10)); // Create the grid based on the selected size
        } else {
            // If the game is active, stop it and reset everything
            resetGame();
        }
    });

    // Event listener for grid size changes
    gridSizeSelect.addEventListener("change", () => {
        const selectedSize = gridSizeSelect.value;

        if (selectedSize) {
            resetGame(); // Reset the game before creating a new grid
            createGrid(parseInt(selectedSize, 10)); // Create the grid based on the new size
        }
    });

    // Initial setup - create an empty grid on page load
});
