let travelData = {};

fetch('./travel_recommendation_api.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    travelData = data; // Store the fetched data
                })
                .catch(error => console.error('There was a problem with the fetch operation:', error));

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
}

function handleInput() {
    const keyword = document.getElementById("keyword").value.trim();
    if (keyword.length >= 3) {
        fetchRecommendations();
    }
}

function fetchRecommendations() {
    const keyword = document.getElementById("keyword").value.trim();
    const recommendations = document.getElementById("recommendation-list");
    recommendations.innerHTML = ''; // Clear previous recommendations

    // Show recommendations if there are three or more characters
    if (keyword.length < 3) {
        document.getElementById("recommendations").style.display = 'none'; // Hide recommendations
        return;
    }   

    // Check by terms
    let allCountrys = [];
    let allTemples = [];
    let allBeaches = [];
    let countryResults = [];
    let cityResults = [];
    let templeResults = [];
    let beachResults = [];

    if(keyword.toLowerCase().startsWith("cou")) {
        allCountrys = travelData.countries.filter(country => country);
    } else if(keyword.toLowerCase().startsWith("tem")) {
        allTemples = travelData.temples.filter(temple => temple);
    } else if(keyword.toLowerCase().startsWith("bea")){
        allBeaches = travelData.beaches.filter(beach => beach);
    } else {
        // Check in countries        
        cityResults = travelData.countries.flatMap(country => 
            country.cities.filter(city => city.name.toLowerCase().includes(keyword))
        );

        // Check in temples
        templeResults = travelData.temples.filter(temple => temple.name.toLowerCase().includes(keyword));

        // Check in beaches
        beachResults = travelData.beaches.filter(beach => beach.name.toLowerCase().includes(keyword));
    }

    // Combine results
    const allResults = [...allCountrys, ...allTemples, ...allBeaches, ...countryResults, ...cityResults, ...templeResults, ...beachResults];

    if (allResults.length > 0) {
        allResults.forEach(result => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="card">
                    <img src="${result.imageUrl || result.cities?.[0]?.imageUrl}" class="card-img-top" alt="${result.name}">
                    <div class="card-body">
                        <h5 class="card-title">${result.name}</h5>
                        <p class="card-text">${result.description || 'No description available.'}</p>
                    </div>
                </div>
            `;
            recommendations.appendChild(card);
        });
        document.getElementById("recommendations").style.display = 'block'; // Show recommendations section
    } else {
        recommendations.innerHTML = '<p>No recommendations found.</p>';
        document.getElementById("recommendations").style.display = 'block'; // Show recommendations section
    }
}

function resetRecommendations() {
    document.getElementById("keyword").value = '';
    document.getElementById("recommendations").style.display = 'none'; // Hide recommendations
    document.getElementById("recommendation-list").innerHTML = ''; // Clear recommendations
}
