#!/bin/bash
# Run this once after creating your GitHub account
# Usage: bash setup.sh YOUR_GITHUB_USERNAME

USERNAME=$1

if [ -z "$USERNAME" ]; then
  echo "Usage: bash setup.sh YOUR_GITHUB_USERNAME"
  exit 1
fi

REPO="intelligent-economics"

echo "→ Creating repo $USERNAME/$REPO on GitHub..."
gh repo create "$REPO" --public --source=. --remote=origin --push

echo "→ Enabling GitHub Pages (Actions source)..."
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/$USERNAME/$REPO/pages \
  -f source='{"branch":"main","path":"/"}' \
  --input - <<< '{"build_type":"workflow"}' 2>/dev/null || true

echo ""
echo "✓ Done! Your site will be live at:"
echo "  https://$USERNAME.github.io/$REPO"
echo ""
echo "  (GitHub Actions is deploying now — takes ~60 seconds)"
echo "  Check progress: https://github.com/$USERNAME/$REPO/actions"
