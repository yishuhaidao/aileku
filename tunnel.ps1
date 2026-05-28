while($true) {
  Write-Host "Connecting SSH tunnel..."
  ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=10 -o ServerAliveCountMax=3 -o ConnectTimeout=10 -R 80:localhost:8000 nokey@localhost.run
  Write-Host "Tunnel died, reconnecting in 5s..."
  Start-Sleep 5
}
