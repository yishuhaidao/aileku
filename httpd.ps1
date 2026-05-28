$dir="C:\Users\Administrator\Desktop\miuse"
$port=8000
$l=New-Object System.Net.HttpListener
$l.Prefixes.Add("http://+:$port/")
$l.Start()
Write-Output "HTTP on *:$port"

$m=@{".html"="text/html; charset=utf-8";".css"="text/css; charset=utf-8";".js"="application/javascript; charset=utf-8";".json"="application/json";".png"="image/png";".jpg"="image/jpeg";".svg"="image/svg+xml"}

while($true){try{$c=$l.GetContext();$p=$c.Request.Url.LocalPath;if($p-eq'/'){$p='/index.html'};$f=Join-Path $dir $p.TrimStart('/');if(Test-Path $f -PathType Leaf){$e=[IO.Path]::GetExtension($f);$t=$m[$e];if(!$t){$t='application/octet-stream'};$b=[IO.File]::ReadAllBytes($f);$c.Response.ContentType=$t;$c.Response.ContentLength64=$b.Length;$c.Response.OutputStream.Write($b,0,$b.Length);$c.Response.Close()}else{$c.Response.StatusCode=404;$c.Response.Close()}}catch{Start-Sleep 0.1}}
