# Read config file
$config = Get-Content .\config.json | ConvertFrom-Json

# Clean the deployment folder
Remove-Item $config.nginx_deployment_root

Set-Location $config.angular_src_root
ng build --output-path $config.nginx_deployment_root