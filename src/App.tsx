import { useRef, useEffect, useState, useCallback } from 'react';
import './App.css';

const categories = [
  { label: '당도', color: 'orange', key: 'sweetness' },
  { label: '멘솔', color: 'skyblue', key: 'menthol' },
  { label: '타격감', color: 'black', key: 'throatHit' },
];

export default function FlavorRatingApp() {
  const [ratings, setRatings] = useState({
    sweetness: 0,
    menthol: 0,
    throatHit: 0,
  });

  const [canvasSize, setCanvasSize] = useState({
    width: 800,
    height: 250,
  });

  const [inputValues, setInputValues] = useState({
    width: '800',
    height: '250',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 크기에 비례한 폰트 크기 계산
    const baseFontSize = Math.max(12, Math.floor(canvas.width / 20)); // 기본 폰트 크기
    const labelFontSize = Math.floor(baseFontSize * 0.9); // 라벨 폰트 크기
    const starFontSize = Math.floor(baseFontSize * 1.1); // 별표 폰트 크기
    const scoreFontSize = Math.floor(baseFontSize * 0.7); // 점수 폰트 크기

    // 폰트 로드 확인
    const customFont = 'RiaSans-Bold, sans-serif';

    // 카테고리별 평가 표시 (중앙 정렬)
    const lineHeight = Math.floor(canvas.height / 5); // 줄 간격을 캔버스 높이에 비례
    const totalContentHeight = lineHeight * categories.length; // 전체 콘텐츠 높이
    const startY = canvas.height / 2 - totalContentHeight / 2 + lineHeight / 2; // 정확한 중앙 정렬

    categories.forEach(({ label, color, key }, i) => {
      const y = startY + i * lineHeight;

      // 라벨
      ctx.fillStyle = color;
      ctx.font = `bold ${labelFontSize}px ${customFont}`;
      ctx.textAlign = 'left';
      ctx.fillText(label, canvas.width * 0.15, y);

      // 별표
      const rating = ratings[key as keyof typeof ratings];
      ctx.font = `${starFontSize}px ${customFont}`;
      ctx.textAlign = 'center';

      // 별표 간격을 일정하게 만들기 위해 고정 간격 사용
      const starSpacing = starFontSize * 0.3; // 폰트 크기에 비례한 간격
      const totalStars = Math.ceil(rating); // 총 표시할 별 개수
      const totalWidth =
        totalStars * starFontSize + (totalStars - 1) * starSpacing;
      const startX = canvas.width / 2 - totalWidth / 2;

      const filledStars = Math.floor(rating); // 완전히 채워진 별 개수

      for (let i = 1; i <= totalStars; i++) {
        const x =
          startX + (i - 1) * (starFontSize + starSpacing) + starFontSize / 2;

        if (i <= filledStars) {
          // 완전히 채워진 별
          ctx.fillStyle = color;
          ctx.fillText('★', x, y);
        } else {
          // 빈 별 (0.5단위일 때도 빈 별로 표시)
          ctx.fillStyle = color;
          ctx.fillText('☆', x, y);
        }
      }

      // 점수
      ctx.fillStyle = '#666';
      ctx.font = `${scoreFontSize}px ${customFont}`;
      ctx.textAlign = 'right';
      ctx.fillText(
        `(${ratings[key as keyof typeof ratings]})`,
        canvas.width * 0.8,
        y
      );
    });
  }, [ratings, canvasSize]);

  // ratings나 canvasSize가 변경될 때마다 이미지 다시 그리기
  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 현재 날짜와 시간으로 파일명 생성
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const filename = `flavor-rating-${year}${month}${day}-${hours}${minutes}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="app-container">
      <h1 className="app-title">맛 표현 이미지 생성기</h1>

      <div className="app-layout">
        {/* 설정 패널 */}
        <div className="settings-panel">
          <h2 className="settings-title">설정</h2>

          {/* 캔버스 크기 설정 */}
          <div className="image-size-section">
            <h3 className="section-title">이미지 크기</h3>
            <div className="size-inputs">
              <div className="input-group">
                <label className="input-label">가로 (px):</label>
                <input
                  type="text"
                  placeholder="800"
                  value={inputValues.width}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInputValues((prev) => ({ ...prev, width: value }));

                    if (value === '') {
                      setCanvasSize((prev) => ({ ...prev, width: 800 }));
                    } else {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue >= 200) {
                        setCanvasSize((prev) => ({ ...prev, width: numValue }));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (
                      value === '' ||
                      isNaN(parseInt(value)) ||
                      parseInt(value) < 200
                    ) {
                      setInputValues((prev) => ({ ...prev, width: '400' }));
                      setCanvasSize((prev) => ({ ...prev, width: 400 }));
                    }
                  }}
                  className="size-input"
                />
              </div>
              <div className="input-group">
                <label className="input-label">세로 (px):</label>
                <input
                  type="text"
                  placeholder="250"
                  value={inputValues.height}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInputValues((prev) => ({ ...prev, height: value }));

                    if (value === '') {
                      setCanvasSize((prev) => ({ ...prev, height: 250 }));
                    } else {
                      const numValue = parseInt(value);
                      if (
                        !isNaN(numValue) &&
                        numValue >= 150 &&
                        numValue <= 600
                      ) {
                        setCanvasSize((prev) => ({
                          ...prev,
                          height: numValue,
                        }));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (
                      value === '' ||
                      isNaN(parseInt(value)) ||
                      parseInt(value) < 150 ||
                      parseInt(value) > 600
                    ) {
                      setInputValues((prev) => ({ ...prev, height: '250' }));
                      setCanvasSize((prev) => ({ ...prev, height: 250 }));
                    }
                  }}
                  className="size-input"
                />
              </div>
            </div>
          </div>

          {/* 평가 설정 */}
          <div className="rating-section">
            <h3 className="section-title">맛 평가</h3>
            <div className="rating-section">
              {categories.map(({ label, key, color }) => (
                <div key={key} className="rating-item">
                  <label className="rating-label" style={{ color }}>
                    {label}:
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={ratings[key as keyof typeof ratings]}
                    onChange={(e) =>
                      setRatings((prev) => ({
                        ...prev,
                        [key]: parseFloat(e.target.value),
                      }))
                    }
                    className="rating-slider"
                  />
                  <span className="rating-value" style={{ color }}>
                    {ratings[key as keyof typeof ratings]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={downloadImage} className="download-button">
            이미지 다운로드
          </button>
        </div>

        {/* 미리보기 */}
        <div className="preview-panel">
          <h2 className="preview-title">미리보기</h2>
          <div className="preview-container">
            <canvas ref={canvasRef} className="canvas-element" />
          </div>
          <div className="canvas-info">
            크기: {canvasSize.width} × {canvasSize.height} px
          </div>
        </div>
      </div>
    </div>
  );
}
