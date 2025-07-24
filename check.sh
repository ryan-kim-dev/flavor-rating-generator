#!/bin/bash

echo "📂 현재 디렉토리: $PWD"
echo "👤 현재 사용자: $(whoami)"

echo ""
echo "🟡 1. 현재 node 경로 및 버전:"
which node
node -v

echo ""
echo "🔵 2. nvm 현재 활성 버전:"
nvm current

echo ""
echo "🟠 3. 숨겨진 버전 설정 파일 확인 (.nvmrc, .node-version 등):"
find . -maxdepth 1 -name '.*version*' -or -name '.nvmrc'

echo ""
echo "🟣 4. 셸 설정 파일에 자동 버전 전환 코드가 있는지 확인 (~/.zshrc, ~/.bashrc):"
echo "→ ~/.zshrc:"
grep -i 'nvm use' ~/.zshrc 2>/dev/null || echo "  없음"
echo "→ ~/.bashrc:"
grep -i 'nvm use' ~/.bashrc 2>/dev/null || echo "  없음"

echo ""
echo "🟢 5. system Node.js 버전 확인:"
nvm run system --version 2>/dev/null || echo "  system 버전 사용 불가"

echo ""
echo "🔘 6. node가 nvm 외 경로에서 오는지 확인:"
ls -l $(which node)

echo ""
echo "✅ 점검 완료"
