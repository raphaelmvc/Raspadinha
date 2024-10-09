const createScratchCard = (canvasId, color) => {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const revealText = document.getElementById('reveal-text');
  const scratchCard = document.querySelector('.scratch-card');
  const hiddenImage = document.querySelector('.hidden-image'); // Imagem a ser revelada
  const hiddenImage2 = document.querySelector('.hidden-image2'); // Imagem de fundo
  const hiddenText = document.querySelector('.hidden-text');
  const scratchSize = 24; // Tamanho do círculo de raspagem
  const scratchThreshold = 0.4; // 40% dos pixels devem ser raspados

  // Função para desenhar a imagem inicial no canvas
  const drawContent = () => {
    const img = new Image();
    img.src = "/img/Sorteio2.svg";
     // Caminho para a imagem inicial
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  const init = () => {
    drawContent(); // Desenhar a imagem inicial no canvas
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height); // Adicionar a camada de raspagem
  };

  let isDragging = false;

  const scratch = (x, y) => {
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, scratchSize, 0, 2 * Math.PI);
    context.fill();
  };

  const onMouseMove = (event) => {
    if (isDragging) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;
      scratch(x, y);
      checkReveal();
    }
  };

  const onMouseDown = (event) => {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    scratch(x, y);
    checkReveal();
    document.addEventListener("mousemove", onMouseMove);
    document.body.style.userSelect = "none";
  };

  const onMouseUp = () => {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.body.style.userSelect = "";
  };

  const onTouchMove = (event) => {
    if (isDragging) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (event.touches[0].clientX - rect.left) * scaleX;
      const y = (event.touches[0].clientY - rect.top) * scaleY;
      scratch(x, y);
      checkReveal();
    }
    event.preventDefault(); // Previne rolagem durante o toque
  };

  const onTouchStart = (event) => {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.touches[0].clientX - rect.left) * scaleX;
    const y = (event.touches[0].clientY - rect.top) * scaleY;
    scratch(x, y);
    checkReveal();
    document.addEventListener("touchmove", onTouchMove);
    document.body.style.userSelect = "none";
  };

  const onTouchEnd = () => {
    isDragging = false;
    document.removeEventListener("touchmove", onTouchMove);
    document.body.style.userSelect = "";
  };

  const checkReveal = () => {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let coveredPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) coveredPixels++;
    }

    if (coveredPixels / (pixels.length / 4) > scratchThreshold) {
      hiddenImage2.style.display = 'block'; // Torna a imagem de fundo visível após a raspagem
      hiddenImage.classList.remove('hidden');
      hiddenText.classList.remove('hidden');
      revealText.classList.remove('hidden');
      canvas.classList.add('canvas-hidden'); // Torna o canvas invisível
      scratchCard.classList.add('hidden-card'); // Remove o cartão de raspar
      document.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    }
  };

  canvas.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("mouseleave", onMouseUp);
  canvas.addEventListener("touchstart", onTouchStart);
  document.addEventListener("touchend", onTouchEnd);
  document.addEventListener("touchcancel", onTouchEnd);

  init();
};

// Inicializa o cartão de raspar
createScratchCard("scratch-card1", "white");
