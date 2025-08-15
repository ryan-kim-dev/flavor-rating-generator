import { useRef, useEffect, useState, useCallback } from 'react';

export default function KCCertificationGenerator() {
  const [certificationNumber, setCertificationNumber] =
    useState('YU102314-25001');
  const [canvasSize, setCanvasSize] = useState({
    width: 2000,
    height: 400,
  });

  const [inputValues, setInputValues] = useState({
    width: '2000',
    height: '400',
  });

  const [imageName, setImageName] = useState('');
  const [kcLogoImage, setKcLogoImage] = useState<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // KC 로고 이미지 로드
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setKcLogoImage(img);
    };
    img.src = '/kc-logo.jpg'; // public 폴더에 있는 이미지 파일
  }, []);

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !kcLogoImage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경색 (연한 회색)
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // KC 로고 이미지 그리기 (왼쪽)
    const logoWidth = Math.min(canvas.width * 0.1, 120); // 로고 너비를 캔버스 너비의 10%로 줄이고 최대 120px로 제한
    const logoHeight = logoWidth * (kcLogoImage.height / kcLogoImage.width); // 원본 비율 유지

    // 텍스트 스타일 설정 및 너비 측정 (가장 긴 줄 기준)
    const titleFontSize = Math.max(20, Math.floor(canvas.width * 0.025));
    const descFontSize = Math.max(18, Math.floor(canvas.width * 0.02));

    ctx.font = `bold ${titleFontSize}px Arial, sans-serif`;
    const titleText = `KC인증번호 ${certificationNumber}`;
    const titleTextWidth = ctx.measureText(titleText).width;

    ctx.font = `${descFontSize}px Arial, sans-serif`;
    const descText1 = '해당 제품은 국가통합인증마크(KC)를';
    const descText2 = '획득한 제품입니다.';
    const descText1Width = ctx.measureText(descText1).width;
    const descText2Width = ctx.measureText(descText2).width;

    const maxTextWidth = Math.max(
      titleTextWidth,
      descText1Width,
      descText2Width
    );

    const gapBetweenLogoAndText = 50; // 로고와 텍스트 사이 간격 (px)

    // 전체 콘텐츠 블록의 너비 계산 (로고 + 간격 + 텍스트)
    const totalContentWidth = logoWidth + gapBetweenLogoAndText + maxTextWidth;

    // 전체 콘텐츠 블록을 캔버스 중앙에 배치하기 위한 시작 X 좌표 계산
    const contentBlockStartX = (canvas.width - totalContentWidth) / 2;

    // 로고 그리기 위치
    const logoDrawX = contentBlockStartX;
    const logoDrawY = (canvas.height - logoHeight) / 2; // 로고 세로 중앙 정렬

    ctx.drawImage(kcLogoImage, logoDrawX, logoDrawY, logoWidth, logoHeight);

    // 텍스트 그리기 위치 (로고와 더 가깝게)
    const textX = logoDrawX + logoWidth + gapBetweenLogoAndText;
    const textStartY = canvas.height * 0.4;
    const lineHeight = canvas.height * 0.12;

    ctx.fillStyle = '#000';
    ctx.font = `bold ${titleFontSize}px Arial, sans-serif`;
    ctx.textAlign = 'left';

    // KC인증번호
    ctx.fillText(titleText, textX, textStartY);

    // 구분선 - 인증번호와 멘트 사이에 적절한 간격
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(textX, textStartY + lineHeight * 0.4); // 간격을 늘림
    ctx.lineTo(textX + descText1Width, textStartY + lineHeight * 0.4);
    ctx.stroke();

    // 설명 텍스트 - 가로선과 적절한 간격
    ctx.font = `600 ${descFontSize}px Arial, sans-serif`;
    ctx.fillText(
      descText1,
      textX,
      textStartY + lineHeight * 1.4 // 가로선과의 간격을 더 늘림
    );
    ctx.fillText(descText2, textX, textStartY + lineHeight * 2.5); // 두 번째 설명텍스트와의 간격을 더 늘림
  }, [certificationNumber, canvasSize, kcLogoImage]);

  // certificationNumber나 canvasSize가 변경될 때마다 이미지 다시 그리기
  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const handleImageName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageName = e.target.value;
    setImageName(`${imageName}_KC인증마크`);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const filename = imageName || 'KC인증마크';

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="app-container">
      <h1 className="app-title">KC 인증마크 생성기</h1>

      <div className="app-layout">
        {/* 설정 패널 */}
        <div className="settings-panel">
          <h2 className="settings-title">설정</h2>
          <hr className="divider" />

          {/* 캔버스 크기 설정 */}
          <div className="image-size-section">
            <h3 className="section-title">이미지 크기</h3>
            <div className="size-inputs">
              <div className="input-group">
                <label className="input-label">가로 (px):</label>
                <input
                  type="text"
                  placeholder="2000"
                  value="2000"
                  disabled
                  className="size-input disabled"
                />
                <small className="input-hint">고정 크기</small>
              </div>
              <div className="input-group">
                <label className="input-label">세로 (px):</label>
                <input
                  type="text"
                  placeholder="400"
                  value={inputValues.height}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInputValues((prev) => ({ ...prev, height: value }));

                    if (value === '') {
                      setCanvasSize((prev) => ({ ...prev, height: 400 }));
                    } else {
                      const numValue = parseInt(value);
                      if (
                        !isNaN(numValue) &&
                        numValue >= 300 &&
                        numValue <= 800
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
                      parseInt(value) < 300 ||
                      parseInt(value) > 800
                    ) {
                      setInputValues((prev) => ({ ...prev, height: '400' }));
                      setCanvasSize((prev) => ({ ...prev, height: 400 }));
                    }
                  }}
                  className="size-input"
                />
              </div>
            </div>
          </div>

          {/* 인증번호 설정 */}
          <div className="certification-section">
            <h3 className="section-title">인증 정보</h3>
            <div className="input-group">
              <label className="input-label">KC 인증번호:</label>
              <input
                type="text"
                placeholder="YU102314-25001"
                value={certificationNumber}
                onChange={(e) => setCertificationNumber(e.target.value)}
                className="certification-input"
              />
            </div>
          </div>

          {/* 이미지 저장 */}
          <div className="image-name-section">
            <h3 className="section-title">이미지 저장</h3>
            <form className="image-name-form" onSubmit={downloadImage}>
              <input
                type="text"
                placeholder="제품명을 입력하세요"
                onChange={handleImageName}
                className="image-name-input"
              />
              <p className="image-name-hint">
                제품명 뒤에 "_KC인증마크.png"로 저장됩니다.
              </p>
              <button type="submit" className="download-button">
                이미지 다운로드
              </button>
            </form>
          </div>
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
