
const categories = {
    "Local Shops": ["Camden Books", "Hackney Market"],
    "Coffee & Food": ["Bean & Bloom", "Southbank Vegan"],
    "Creative Services": ["DesignMint", "ArtLabs Shoreditch"],
    "Beauty & Wellness": ["Zen Spa", "Eco Nails Studio"],
    "Ethical & Eco Brands": ["EarthKind", "Green Threads"]
};

let container = document.getElementById("categories");
for (let cat in categories) {
    let div = document.createElement("div");
    div.className = "category";
    div.innerHTML = `<h2>${cat}</h2>` + categories[cat].map(b => `<a href="${b.replace(/ /g,'')}.html">${b}</a><br/>`).join("");
    container.appendChild(div);
}
