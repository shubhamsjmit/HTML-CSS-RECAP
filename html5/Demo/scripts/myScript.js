//drag and drop
function addDnDHandlers() {
    var coffeeimages = document.getElementsByClassName("productarticlewide");
    var shoppingCartDropzone = document.getElementById("shoppingcart");
    var shoppingcart = document.querySelectorAll("#shoppingcart ul")[0];

    var Cart = (function () {
        this.coffees = new Array();
    });

    var Coffee = (function (id, price) {
        this.coffeeId = id;
        this.price = price;
    });

    var currentCart = null;
    currentCart = JSON.parse(localStorage.getItem('cart'));
    if (!currentCart) {
        createEmptyCart();
    } 
    UpdateShoppingCartUI();
    currentCart.addCoffee = function (coffee) {
        currentCart.coffees.push(coffee);

        // insert the new cart into the storage as string
        localStorage.setItem('cart', JSON.stringify(currentCart));

    }

    for (var i = 0; i < coffeeimages.length; i++) {
        coffeeimages[i].addEventListener("dragstart", function (ev) {
            ev.dataTransfer.effectAllowed = 'copy';
            ev.dataTransfer.setData("Text", this.getAttribute("id"));
        }, false);
    }
    shoppingCartDropzone.addEventListener("dragover", function (ev) {
        if (ev.preventDefault)
            ev.preventDefault();
        ev.dataTransfer.dropEffect = "copy";
        return false;
    }, false);
    shoppingCartDropzone.addEventListener("drop", function (ev) {
        if (ev.stopPropagation)
            ev.stopPropagation();

        var coffeeId = ev.dataTransfer.getData("Text");
        var element = document.getElementById(coffeeId);

        addCoffeeToShoppingCart(element, coffeeId);
        ev.stopPropagation();

        return false;
    }, false);
    function addCoffeeToShoppingCart(item, id) {
        var price = item.getAttribute("data-price");
        var coffee = new Coffee(id, price);
        currentCart.addCoffee(coffee);
        UpdateShoppingCartUI();
    }
    function createEmptyCart() {
        localStorage.setItem("cart", JSON.stringify(new Cart()));
        currentCart = JSON.parse(localStorage.getItem("cart"));
    }
    function UpdateShoppingCartUI() {
        shoppingcart.innerHTML = "";
        for (var i = 0; i < currentCart.coffees.length; i++) {
            var liElement = document.createElement('li');
            liElement.innerHTML = currentCart.coffees[i].coffeeId + " " + currentCart.coffees[i].price;
            shoppingcart.appendChild(liElement);
        }
    };
}

function createDrivingDirectionsMap() {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(OnSuccess, OnError, {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 500
        });
    }
    else {
        document.getElementById(map).innerHTML = "No support for geolocation, we can't find you :(";
    }
};

function OnSuccess(position) {
    showMap(
        position.coords.latitude,
        position.coords.longitude
    );
};

function OnError() {
    var mapDiv = document.getElementById("map");
    switch (error.code) {
        case error.PERMISSION_DENIED:
            mapDiv.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            mapDiv.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            mapDiv.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            mapDiv.innerHTML = "An unknown error occurred."
            break;
    }
};


function showMap(lat, lang) {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var route = {
        origin: new google.maps.LatLng(lat, lang),
        destination: "Grote Markt, Brussel",
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(50.8504500, 4.3487800),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("driving-directions"));
    directionsService.route(route, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        }
    });
}

//play video
function initializeVideoPlayerControls() {

    var video = document.getElementById("videoplayer");
    function playVideo(evt) {

        button = evt.target;
        if (video.paused) {
            video.play();
            button.textContent = "Pause";
        } else {
            video.pause();
            button.textContent = "Play";
        }
    }
    function seek(numberOfSeconds) {
        try {
            if (numberOfSeconds == 0) {
                video.currentTime = numberOfSeconds;
            }
            else {
                video.currentTime += numberOfSeconds;
            }

        } catch (err) {
            displayError("Something went wrong...");
        }
    }
    //event handlers on the buttons
    document.getElementById("playButton").addEventListener("click", playVideo, false);
    document.getElementById("backButton").addEventListener("click", function () {
        seek(-5);
    }, false);
    document.getElementById("forwardButton").addEventListener("click", function () {
        seek(5);
    }, false);
    document.getElementById("slowerButton").addEventListener("click", function () {
        video.playbackRate -= .25;
    }, false);
    document.getElementById("fasterButton").addEventListener("click", function () {
        video.playbackRate += .25;
    }, false);
    document.getElementById("muteButton").addEventListener("click", function (s) {
        if (video.muted) {
            video.muted = false;
        } else {
            video.muted = true;
        }
    }, false);

    video.addEventListener("error", function (err) {
        errMessage(err);
    }, true);

    function displayError(error) {
        document.getElementById("errorDiv").textContent = error;
    }
}
var coffeeSales = new Array();
coffeeSales[0] = "Jan, 170";
coffeeSales[1] = "Feb, 320";
coffeeSales[2] = "Mar, 432";
coffeeSales[3] = "Apr, 548";
coffeeSales[4] = "May, 342";
coffeeSales[5] = "Jun, 689";
coffeeSales[6] = "Jul, 344";
coffeeSales[7] = "Aug, 109";
coffeeSales[8] = "Sep, 655";
coffeeSales[9] = "Oct, 327";
coffeeSales[10] = "Nov, 109";
coffeeSales[11] = "Dec, 235";

function drawChart() {
    var canvas = document.getElementById('barChart');

    if (canvas && canvas.getContext) {
        var context = canvas.getContext('2d');
        createBarChart(context, coffeeSales, 30, 20, (canvas.height - 20), 50);
    }
}

function createBarChart(context, data, startX, barWidth, chartHeight, markDataIncrementsIn) {

    context.lineWidth = "1.2";
    var startY = 780;

    createAxis(context, startX, startY, startX, 30);//vertical axis
    createAxis(context, startX, startY, 650, startY);//horizontal axis

    context.lineWidth = "0.0";
    var maxValue = 0;
    for (var i = 0; i < data.length; i++) {

        var item = data[i].split(",");
        var itemName = item[0];
        var itemValue = parseInt(item[1]);
        if (parseInt(itemValue) > parseInt(maxValue)) maxValue = itemValue;

        context.fillStyle = "blue";
        createBar(context, 20 + startX + (i * barWidth) + i + (i * 30), (chartHeight - itemValue), barWidth, itemValue, true);

        context.textAlign = "left";
        context.fillStyle = "black";
        context.fillText(itemName, 20 + startX + (i * barWidth) + i + (i * 30), chartHeight + 15, 200);
    }
}

function createAxis(context, startx, starty, endx, endy) {
    context.beginPath();
    context.moveTo(startx, starty);
    context.lineTo(endx, endy);
    context.closePath();
    context.stroke();
}

function createBar(context, x, y, width, height, fill) {
    context.beginPath();
    context.rect(x, y, width, height);
    context.closePath();
    context.stroke();
    context.fill();
}