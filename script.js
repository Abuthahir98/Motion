document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('artwork-canvas');
  const ctx = canvas.getContext('2d');
  const uploadBtn = document.getElementById('upload-btn');
  const windBtn = document.getElementById('wind-btn');
  let uploadedImage = null;

  uploadBtn.addEventListener('click', function () {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          uploadedImage = img;
          drawArtwork();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  windBtn.addEventListener('click', function () {
    simulateWinding();
  });

  function drawArtwork() {
    const diameter = parseInt(document.getElementById('diameter').value);
    const teeth = parseInt(document.getElementById('teeth').value);
    const width = parseInt(document.getElementById('width').value);
    const canvasSize = Math.max(canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Draw disk
    ctx.beginPath();
    ctx.arc(0, 0, diameter / 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#ddd';
    ctx.fill();
    ctx.lineWidth = width;
    ctx.stroke();

    // Draw teeth
    const angleStep = (2 * Math.PI) / teeth;
    for (let i = 0; i < teeth; i++) {
      const angle = i * angleStep;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo((diameter / 2) * Math.cos(angle), (diameter / 2) * Math.sin(angle));
      ctx.stroke();
    }

    // Draw uploaded image (if any)
    if (uploadedImage) {
      const imgSize = diameter * 0.8; // Scale image to fit inside disk
      ctx.drawImage(uploadedImage, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
    }

    ctx.restore();
  }

  function simulateWinding() {
    const speed = parseInt(document.getElementById('speed').value);
    const direction = document.getElementById('direction').value;
    const rotationStep = (direction === 'clockwise' ? 1 : -1) * (speed / 10);

    let currentRotation = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(currentRotation);
      drawArtwork();
      ctx.restore();

      currentRotation += rotationStep * Math.PI / 180;
      requestAnimationFrame(animate);
    }

    animate();
  }
});
