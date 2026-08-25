$src = 'C:\Users\bombe\.gemini\antigravity\brain\13a1c6fb-ef9a-4bc3-9fe9-85bc53c2f4ca\SystemArchitecture.md'
$dst = 'c:\Users\bombe\OneDrive\Desktop\Interview Copilot\docs\SystemArchitecture.md'
Copy-Item -Path $src -Destination $dst -Force
Write-Output "Copied. Size: $((Get-Item $dst).Length) bytes"

