# ====== Config ======
$loginUrl = "http://localhost:5000/api/auth/login"
$approveAllUrl = "http://localhost:5000/api/properties/admin/approve-all"
$adminEmail = "admin@example.com"
$adminPassword = "123456"

# ====== Step 1: Login to get token ======
$loginBody = @{
    email = $adminEmail
    password = $adminPassword
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri $loginUrl -Method POST -ContentType "application/json" -Body $loginBody

if (-not $loginResponse.token) {
    Write-Host "❌ Login failed. Please check email/password."
    exit
}

$token = $loginResponse.token
Write-Host "✅ Login successful. Token received."

# ====== Step 2: Approve all pending properties ======
$headers = @{
    Authorization = "Bearer $token"
}

$approveResponse = Invoke-RestMethod -Uri $approveAllUrl -Method PATCH -Headers $headers

Write-Host "✅ Approve-All Response:"
$approveResponse | ConvertTo-Json -Depth 5
