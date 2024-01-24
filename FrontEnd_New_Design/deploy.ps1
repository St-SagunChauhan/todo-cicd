$SourcePath = "build/*"  # Path to your React build folder
$DestinationPath = "C:/inetpub/crm-test"  # Path to your IIS site directory

Copy-Item -Path $SourcePath -Destination $DestinationPath -Recurse -Force