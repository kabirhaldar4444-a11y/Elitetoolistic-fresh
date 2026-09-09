<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Forwarded-For");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$PAYALMA_API_URL = 'https://gate.payalma.com/api/v1/purchases/';
$PAYALMA_BRAND_ID = '9a0999f4-1298-4336-8b85-7c5d86238553';
$PAYALMA_API_KEY = 'q_H9dTYyAEtoFVVhGPkREQLc27gGVIq3g8EONZemZN4wEvcqcZBou-7LckEecYcxVyjW46kSrvV6sSSNNnOWXA==';

// Read incoming JSON body
$rawData = file_get_contents('php://input');
$payload = json_decode($rawData, true);

if (!is_array($payload)) {
    $payload = [];
}

// Inject Brand ID
$payload['brand_id'] = $PAYALMA_BRAND_ID;

// Ensure Country is India for domestic UPI/P2P agents
if (!isset($payload['client']) || !is_array($payload['client'])) {
    $payload['client'] = [];
}
if (empty($payload['client']['country'])) {
    $payload['client']['country'] = 'IN';
}

$securePostData = json_encode($payload);

// Client visitor IP
$clientIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
if ($clientIp && strpos($clientIp, ',') !== false) {
    $parts = explode(',', $clientIp);
    $clientIp = trim($parts[0]);
}

// Initialize cURL request to PayAlma
$ch = curl_init($PAYALMA_API_URL);
$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $PAYALMA_API_KEY
];
if (!empty($clientIp)) {
    $headers[] = 'X-Forwarded-For: ' . $clientIp;
    $headers[] = 'X-Real-IP: ' . $clientIp;
}

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $securePostData);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

header('Content-Type: application/json');

if ($response === false) {
    http_response_code(500);
    echo json_encode(["error" => "Payment gateway error: " . $curlError]);
} else {
    http_response_code($httpCode ? $httpCode : 200);
    echo $response;
}
