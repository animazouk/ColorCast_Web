// Initialize an empty object to store brand color data
let brandColors = {};

// Load color data from the external colors.json file
fetch("colors.json")
    .then(response => response.json())
    .then(data => {
        brandColors = data;
    })
    .catch(error => console.error("Error loading color data:", error));

// Event listener for image upload
document.getElementById("colorInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            // Create a canvas to draw and analyze the image
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            // Get color data from the center pixel of the image
            const { data } = context.getImageData(img.width / 2, img.height / 2, 1, 1);
            const [r, g, b] = data;
            const hexColor = rgbToHex(r, g, b);

            // Find and display the nearest color match based on hex
            findNearestColor(hexColor);
        };
    }
});

// Function to convert RGB to hex
function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

// Find the nearest color in the selected brand and display its unique color code
function findNearestColor(hexColor) {
    const selectedBrand = document.getElementById("brandSelect").value;
    const colors = brandColors[selectedBrand];

    if (!colors) {
        document.getElementById("result").textContent = "Brand colors not found.";
        return;
    }

    let closestColor = null;
    let smallestDistance = Infinity;

    // Loop through each color in the selected brand to find the closest match
    for (const color of colors) {
        const distance = colorDistance(hexColor, color.hex);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestColor = color;
        }
    }

    const resultDiv = document.getElementById("result");
    if (closestColor) {
        // Display the closest color's unique code (e.g., "7110" or "2265D")
        resultDiv.textContent = `Closest color in ${selectedBrand} is "${closestColor.name}" with code: ${closestColor.code}`;
    } else {
        resultDiv.textContent = "No close color found.";
    }
}

// Calculate color distance in RGB space
function colorDistance(hex1, hex2) {
    const [r1, g1, b1] = hexToRgb(hex1);
    const [r2, g2, b2] = hexToRgb(hex2);
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

// Convert hex to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
