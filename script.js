let colorData = [];

// Fetch color data from the JSON file
fetch("colors.json")
  .then((response) => response.json())
  .then((data) => {
    colorData = data;
  })
  .catch((error) => console.error("Error loading color data:", error));

document.querySelector(".btn-primary").addEventListener("click", () => {
  // Collect form inputs
  const brand1 = document.getElementById("brand1").value;
  const brand2 = document.getElementById("select-brand-2").value;
  const code = document.getElementById("input-code").value.trim();

  // Find the row with the matching color code for brand1
  const row = colorData.find((row) => row[brand1] === code);

  // Display the color code for brand2 if found, otherwise show an error message
  const resultDiv = document.getElementById("result");
  if (row && row[brand2]) {
    resultDiv.textContent = `The color code for ${brand2} is: ${row[brand2]}`;
  } else {
    resultDiv.textContent = "Color code not found.";
  }
});
