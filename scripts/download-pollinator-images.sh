#!/bin/bash
# Script to download all pollinator images into public/pollinators/
# Usage: bash scripts/download-pollinator-images.sh
#
# This script downloads images for the /pollinators/gallery page.
# Some images may fail due to SSL/network issues — re-run the script if that happens.
# The flower beetle image is base64-encoded and hardcoded in the source (not downloaded).

set -euo pipefail

DIR="public/pollinators"
mkdir -p "$DIR"

download() {
  local name="$1"
  local url="$2"
  if [ -f "$DIR/${name}" ] && [ -s "$DIR/${name}" ]; then
    echo "  ⏭️  ${name} already exists, skipping"
    return 0
  fi
  echo -n "  ⬇️  ${name}... "
  if curl -kL --connect-timeout 15 --max-time 60 -o "$DIR/${name}" "$url" 2>/dev/null; then
    if [ -s "$DIR/${name}" ]; then
      echo "✅"
    else
      echo "❌ (empty file)"
      rm -f "$DIR/${name}"
      return 1
    fi
  else
    echo "❌ (download failed)"
    rm -f "$DIR/${name}"
    return 1
  fi
}

echo "📥 Downloading natural pollinator images..."

download "ant.jpg" "https://www.shutterstock.com/image-photo/close-flower-petals-ant-doing-260nw-417376993.jpg" || true
download "honeybee.jpg" "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-L0Ot1SZLhFhJ1QnYeEJ5HdVG5lIHA5ZsyQ&s" || true
download "bumblebee.jpg" "https://images.newscientist.com/wp-content/uploads/2012/08/07110016/akxy4h.jpg" || true
download "hummingbird.jpg" "https://www.perkypet.com/media/Articles/Perky-Pet/Ruby-throated-Hummingbird-Migration.jpg" || true
download "sunbird.jpg" "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpFy_aROGam4sOFp_agXDJyXb8Fp7LFvfbqcer03THNoJ0RmwABX6VOY4h3LJB1ogShshNhzj_-tsPmybaMAPiim-yDlpw08_5EAwEDzmRvg&s=10" || true
download "monarch-butterfly.jpg" "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwvyV1FnqOmMnxDbRl2qVTq1h8zjOQZt38v_MtiHiXO8WnFbU3vH4l6QEM69Y8U91Qjg-EXGZD4rqNRJSlPFbg9n03mIoKq832GwIcnWTtXQ&s=10" || true
download "hummingbird-moth.jpg" "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ZJqfsTlFdvqrYEXtvpJdgRQDA1vI117-Moqq6LsEibEHzO_eIqArmaWHCw0l2Da2FRzHjBadHT68iwUGNqOTxZqg1vkVtYlokoBNi02y&s=10" || true
download "swallowtail-butterfly.jpg" "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTebdAtM0-9vq1GyL7aQIj0DfmlL50P2PNJIsncFdkBlCvBbPNq_7wY8NDw7cfYdt4D1akFw1EtjKih55BI5Pm77nAOwK5JIrNIRneGtpCI&s=10" || true
download "lesser-long-nosed-bat.jpg" "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRvDuRMzdpIBfnZ6neoKcgwYXsiajhW-lApxKGgg8YTMLIVgl2YCwHkgF58bd0Cxn5eOdzTwAAyhmq_JJoum-NO23YTzq2xCYESPFF5cfV&s=10" || true
echo "  ⚠️  flower-beetle: base64 image hardcoded in source (skipped)"

echo ""
echo "📥 Downloading robotic pollinator images..."

download "robotic-hummingbird.jpg" "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80" || true
download "robotic-bee.jpg" "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80" || true
download "robotic-butterfly.jpg" "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" || true
download "robotic-moth.jpg" "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" || true
download "robotic-bat.jpg" "https://images.unsplash.com/photo-1506947411487-a5673826e6e0?auto=format&fit=crop&w=800&q=80" || true
download "robotic-hummingbird-moth.jpg" "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80" || true

echo ""
echo "✅ Download complete! Files in $DIR/:"
ls -la "$DIR/"
