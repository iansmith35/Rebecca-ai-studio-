#!/bin/bash

echo "🧹 Rebecca AI Studio - Cleanup Deployment Verification"
echo "======================================================"
echo ""
echo "This script will remove the deployment verification indicators"
echo "from the UI once you've confirmed deployments are working correctly."
echo ""

read -p "Are you sure you want to remove deployment verification indicators? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

# Backup the current file
cp app/page.tsx app/page.tsx.backup
echo "✅ Created backup: app/page.tsx.backup"

# Restore clean header without verification indicators
cat > /tmp/page_header_clean.txt << 'EOF'
        <header className="row" style={{justifyContent:"space-between"}}>
          <h1 className="h" style={{fontSize:22}}>{label(active)}</h1>
          <div className="row small">
            <a href="/api/rebecca" className="link">Health</a>
            <a href="/api/rebecca" className="link">•</a>
            <a href="#" onClick={(e)=>{e.preventDefault(); window.open("/api/rebecca","_blank");}} className="link">Authorize Backend</a>
          </div>
        </header>
EOF

# Use sed to replace the header section
sed -i '/^        <header className="row"/,/^        <\/header>/{
    r /tmp/page_header_clean.txt
    d
}' app/page.tsx

# Clean up temp file
rm /tmp/page_header_clean.txt

echo "✅ Removed deployment verification indicators from app/page.tsx"
echo ""
echo "🔄 Testing build to ensure changes are valid..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful - changes applied correctly"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Commit these changes: git add . && git commit -m 'Remove deployment verification indicators'"
    echo "2. Push to deploy: git push"
    echo "3. Verify the clean UI appears on your live site"
    echo ""
    echo "💡 If you need to restore verification indicators, use: cp app/page.tsx.backup app/page.tsx"
else
    echo "❌ Build failed - restoring backup"
    cp app/page.tsx.backup app/page.tsx
    echo "🔄 Backup restored. Please check the script or file manually."
fi