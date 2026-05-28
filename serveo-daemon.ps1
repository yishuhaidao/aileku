while($true) {
  Write-Host "$(Get-Date -Format 'HH:mm:ss') Serveo connecting..."
  ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -i "$env:USERPROFILE\.ssh\id_rsa" -R aileku:80:localhost:8000 serveo.net
  Write-Host "$(Get-Date -Format 'HH:mm:ss') Serveo disconnected, retry in 5s..."
  Start-Sleep 5
}
