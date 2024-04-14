<?php
include('connection.php');

// Get the JSON data sent from JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// Assuming you have a function to insert data into the order table
function insertOrder($totalCost) {
    $conn = $GLOBALS['conn'];
    $stmt = $conn->prepare("INSERT INTO `order` (total_cost) VALUES (:total_cost)");
    $stmt->bindParam(':total_cost', $totalCost);
    $stmt->execute();
    return $conn->lastInsertId(); // Return the inserted order ID
}

// Insert order and return the inserted order ID
$orderId = insertOrder($data['total_cost']);

// Return the inserted order ID as JSON response
echo json_encode(array('order_id' => $orderId));
?>
