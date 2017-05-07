<?php
$servername = "localhost";
$username = "glowych_windreit";
$password = "NuA%8kU%2Wi&2a";
$dbname = "glowych_windreiten";

$output = array();

//params ok?
$valid = true;
$errorfields = array();
if(($_POST["vorname"])) {
    $vorname = $_POST["vorname"];
} else {
    $errorfields[] = "Vorname fehlt";
    $valid = false;
}

if(($_POST["name"])) {
    $name = $_POST["name"];
} else {
    $errorfields[] = "Name fehlt";
    $valid = false;
}

if(($_POST["adresse"])) {
    $adresse = $_POST["adresse"];
} else {
    $errorfields[] = "Adresse fehlt";
    $valid = false;
}

if(($_POST["plz"])) {
    if(is_numeric($_POST["plz"])) {
        $plz = $_POST["plz"];
    } else {
        $errorfields[] = "PLZ muss aus Zahlen bestehen";
        $valid = false;
    }
} else {
    $errorfields[] = "PLZ fehlt";
    $valid = false;
}

if(($_POST["ort"])) {
    $ort = $_POST["ort"];
} else {
    $errorfields[] = "Ort fehlt";
    $valid = false;
}

if(($_POST["land"])) {
    $land = $_POST["land"];
} else {
    $errorfields[] = "Land fehlt";
    $valid = false;
}

if(($_POST["email"])) {
    if (filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
      $email = $_POST["email"];
    } else {       
        $errorfields[] = "E-Mail ungültig";
        $valid = false;
    }
} else {
    $errorfields[] = "E-Mail fehlt";
    $valid = false;
}

if($_POST["recaptcha"]) {
    $recaptcha = $_POST["recaptcha"];
} else {
    $errorfields[] = "'Ich bin kein Roboter' anwählen";
    $valid = false;
}

if(!$valid) {
    $output["success"] = 0;
    $output["message"] = "Fehlerhafte Eingabe: ".implode(", ", $errorfields);
    die(json_encode($output));
}
// Grab google recaptcha library
require_once "php/recaptchalib.php";
$secret = "6LfMZx4UAAAAALXj48xdU4eZ_u_uAWF3OW86BaHM";
$response = null;
$reCaptcha = new ReCaptcha($secret); // Checks if my secret key is present

if ($recaptcha) {
    $response = $reCaptcha->verifyResponse(
        $_SERVER["REMOTE_ADDR"],
        $recaptcha
    );
}
if ($response != null && $response->success) { // When Recaptcha erfolgreich verlaufen ist
    // Create connection
    $conn = mysqli_connect($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        $output["success"] = 0;
        $output["message"] = "Verbindung zur Datenbank fehlgeschlagen: " . $conn->connect_error;
        echo json_encode($output);
        die();
    }


    //mail already in db?
    $stmt = $conn->prepare("SELECT id FROM wettbewerb WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Close connection
        $stmt->close();
        mysqli_close($conn);

        $output["success"] = 0;
        $output["message"] = "Jemand hat schon mit dieser E-Mailadresse am Wettbewerb teilgenommen.";
        echo json_encode($output);
        die();
    }

    if (!mysqli_set_charset($conn, "utf8")) {
        $output["success"] = 0;
        $output["message"] = "Error loading character set utf8: %s\n";
        echo json_encode($output);
        die();
    } 
    
    //insert
    // prepare and bind
    $stmt2 = $conn->prepare("INSERT INTO wettbewerb (vorname, name, adresse, plz, ort, land, email) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt2->bind_param("sssisss", $vorname, $name, $adresse, $plz, $ort, $land, $email);

    // set parameters and execute
    if($stmt2->execute() === false) {
        $output["success"] = 0;
        $output["message"] = "Teilnahme konnte nicht erfasst werden. Bitte versuchen Sie es später nochmals.";
        echo json_encode($output);
        $stmt->close();
        $stmt2->close();
        mysqli_close($conn); 
        die();
    }




    $output["success"] = 1;
    $output["message"] = "Toll, ich wünsche dir viel Glück beim Gewinnspiel.";
    echo json_encode($output);

    // Close connection
    /*$stmt->close();
    $stmt2->close();
    mysqli_close($conn); */
} else {
    echo json_encode("ReCaptcha war nicht erfolgreich.");
}
?> 