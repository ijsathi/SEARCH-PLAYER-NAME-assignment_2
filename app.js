const defaultImageUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
let currentPage = 1;
const itemsPerPage = 6;
let allPlayerData = [];

// Fetch all players data
const allPlayers = (playerName) => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`)
        .then(res => res.json())
        .then(data => {
            console.log(data.player);
            if (data.player) {
                allPlayerData = data.player;
                displayPlayers(allPlayerData, currentPage);
                setupPagination(allPlayerData.length, itemsPerPage);
            } else {
                document.getElementById('players-container').innerHTML = '<h4 class="text-danger">Sorry !!! No Players Found Of This Name.</h4>';
                document.getElementById('pagination').innerHTML = '';
            }
        });
};

allPlayers('bo');

// Display players for the current page
const displayPlayers = (data, page) => {
    const playersContainer = document.getElementById("players-container");
    playersContainer.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach(player => {
        const personImage = player.strCutout ? player.strCutout : defaultImageUrl;
        const playerDiv = document.createElement('div');
        playerDiv.classList.add("col");
        playerDiv.innerHTML = `
            <div class="card p-card">
                <img src="${personImage}" class="card-img alt="${player.strPlayer}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <div>
                            <h5 class="p-name" style="text-transform: uppercase; color:#FFFFFF;">
                            ${player.strPlayer.slice(0, 12)}
                            <span>
                                <a href=${player.strInstagram} target="_blank"><i class="fa-brands fa-instagram fa-2x"></i></a>
                                <a href=${player.strTwitter} target="_blank"><i class="fa-brands fa-twitter fa-2x"></i></a>
                            </span>
                            </h5>
                        </div>
                    </div>
                    <h6 class="text-white">Team: ${player.strTeam}</h6>
                    <p class="text-white m-0">Nationality: ${player.strNationality}</p>
                    <p class="text-white m-0">Plays: ${player.strSport}</p>
                    <p class="text-white m-0">Position: ${player.strPosition}</p>
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                    <button onclick="singlePlayer('${player.idPlayer}')" class="btn details-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>
                    <button id="add-player-button-${player.idPlayer}" onclick="addSinglePlayer('${player.idPlayer}')" class="btn add-btn">Add To Team</button>
                </div>
            </div>
        `;
        playersContainer.appendChild(playerDiv);
    });
};

// Setup pagination buttons
const setupPagination = (totalItems, itemsPerPage) => {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayPlayers(allPlayerData, currentPage);
            setupPagination(totalItems, itemsPerPage);
        }
    };
    prevButton.disabled = currentPage === 1;
    paginationContainer.appendChild(prevButton);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayPlayers(allPlayerData, currentPage);
            setupPagination(totalItems, itemsPerPage);
        };
        pageButton.disabled = currentPage === i;
        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayPlayers(allPlayerData, currentPage);
            setupPagination(totalItems, itemsPerPage);
        }
    };
    nextButton.disabled = currentPage === totalPages;
    paginationContainer.appendChild(nextButton);
};

// Search function by clicking the search button
const handleSearch = (event) => {
    event.preventDefault();
    const playerName = document.getElementById('searchInput').value;
    if (playerName) {
        allPlayers(playerName);
    } else {
        document.getElementById('players-container').innerHTML = '';
        document.getElementById('pagination').innerHTML = '';
    }
    document.getElementById('searchInput').value = '';
};

document.getElementById('searchForm').addEventListener('submit', handleSearch);

// Search every letter
document.getElementById('searchInput').addEventListener('input', function (event) {
    const playerName = event.target.value;
    if (playerName) {
        allPlayers(playerName);
    } else {
        document.getElementById('players-container').innerHTML = '';
        document.getElementById('pagination').innerHTML = '';
    }
});

const singlePlayer = (id) => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            viewSingleProduct(data.players[0]);
        });
};

const viewSingleProduct = (player) => {
    const title = document.getElementById("single-player-title");
    const body = document.getElementById("single-player-body");
    console.log(player.strPlayer);
    title.innerText = player.strPlayer;
    const personImage = player.strCutout ? player.strCutout : defaultImageUrl;

    body.innerHTML = `
    <div class="card ">
        <div class="row bg-dark g-0">
            <div class="col-md-4 d-flex justify-content-center align-items-center">
                <img src=${personImage} class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <p class="card-title text-info">Place of Birth: ${player.strBirthLocation}</p>
                    <small class="text-white m-0">Date of Birth: ${player.dateBorn}</small>
                    <p class="card-title text-info">Nationality: ${player.strNationality}</p>
                    <p class="card-title text-info">Play: ${player.strSport}</p>
                    <p class="card-title text-info">Position: ${player.strPosition}</p>
                    <p class="text-white">${player.strDescriptionEN.slice(0, 100)}</p>
                    <p class="text-white"><small class="text-white">Gender: ${player.strGender}</small></p>
                </div>
            </div>
        </div>
    </div>
    `;
};

const addSinglePlayer = (id) => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            handleAddToTeam(data.players[0]);
        });
};

let addedPlayers = [];
document.getElementById("added-players-qunatity").innerText = 0;

const handleAddToTeam = (player) => {
    if (addedPlayers.length < 11) {
        if (addedPlayers.some(p => p.idPlayer === player.idPlayer)) {
            alert('Already added');
        } else {
            addedPlayers.push(player);
            document.getElementById(`add-player-button-${player.idPlayer}`).disabled = true;
            document.getElementById(`add-player-button-${player.idPlayer}`).innerText = "Already Added";
            viewAddedPlayers();
        }
    } else {
        alert("Sorry You Can't Add More Than 11 Players !!!");
    }
};

const viewAddedPlayers = () => {
    document.getElementById("added-players-qunatity").innerText = addedPlayers.length;

    const addedPlayersContainer = document.getElementById("added-players-container");
    addedPlayersContainer.innerHTML = '';

    if (addedPlayers) {
        addedPlayers.forEach(player => {
            const playerDiv = document.createElement('div');
            const personImage = player.strCutout ? player.strCutout : defaultImageUrl;
            playerDiv.classList.add("col");

            document.getElementById("added-players-container").classList.add("add-part");

            playerDiv.innerHTML = `

            <div class="card mb-3" style="width: 100%; height: 100%; ">
                <div class="row g-0">
                    <div class="col-md-4">
                    <img src="${personImage}" class="img-fluid rounded-start" alt="...">
                    </div>
                    <div class="col-md-8">
                    <div class="card-body" >
                        <h5 class="card-title">Name: ${player.strPlayer}</h5>
                        <p> <span class="fw-bold">${player.strSport}</span> <br> ${player.strNationality}</p>
                        <button onclick="singlePlayer('${player.idPlayer}')" class="btn details-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>
                    </div>
                    </div>
                </div>
            </div>
            `;
            addedPlayersContainer.appendChild(playerDiv);
        });
    } else {
        addedPlayersContainer.innerHTML = `<h4 class="text-danger">Sorry !!! No Players Found.</h4>`;
    }
};

const removeFormTeam = (playerID) => {
    document.getElementById(`add-player-button-${playerID}`).disabled = false;
    document.getElementById(`add-player-button-${playerID}`).innerText = "Add To Team";
    addedPlayers = addedPlayers.filter(player => player.idPlayer !== playerID);
    viewAddedPlayers();
};
