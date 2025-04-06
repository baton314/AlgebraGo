// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем случайные коэффициенты для тренажера Виета
    const vietaExamples = [
      { p: 5, q: 6, roots: [2, 3] },
      { p: 7, q: 12, roots: [3, 4] },
      { p: 1, q: -6, roots: [2, -3] },
      { p: -4, q: -5, roots: [5, -1] }
    ];
    
    const randomExample = vietaExamples[Math.floor(Math.random() * vietaExamples.length)];
    document.getElementById('vieta-p').textContent = randomExample.p;
    document.getElementById('vieta-q').textContent = randomExample.q;
    
    // Инициализация викторины
    initQuiz();
  });
  
  // Калькулятор дискриминанта
  function calculate() {
    const a = parseFloat(document.getElementById('a').value) || 1;
    const b = parseFloat(document.getElementById('b').value) || 0;
    const c = parseFloat(document.getElementById('c').value) || 0;
    
    const D = b * b - 4 * a * c;
    let resultText = '';
    
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      resultText = 'Пожалуйста, введите корректные числа';
      document.getElementById('result').className = 'result-box error';
    } else {
      if (D > 0) {
        const x1 = (-b + Math.sqrt(D)) / (2 * a);
        const x2 = (-b - Math.sqrt(D)) / (2 * a);
        resultText = `D = ${D.toFixed(2)} > 0<br>Два действительных корня:<br>x₁ = ${x1.toFixed(2)}<br>x₂ = ${x2.toFixed(2)}`;
        document.getElementById('result').className = 'result-box success';
      } else if (D === 0) {
        const x = -b / (2 * a);
        resultText = `D = 0<br>Один действительный корень:<br>x = ${x.toFixed(2)}`;
        document.getElementById('result').className = 'result-box warning';
      } else {
        const realPart = (-b / (2 * a)).toFixed(2);
        const imagPart = (Math.sqrt(-D) / (2 * a)).toFixed(2);
        resultText = `D = ${D.toFixed(2)} < 0<br>Два комплексных корня:<br>x₁ = ${realPart} + ${imagPart}i<br>x₂ = ${realPart} - ${imagPart}i`;
        document.getElementById('result').className = 'result-box error';
      }
    }
    
    document.getElementById('result').innerHTML = resultText;
    drawGraph(a, b, c);
  }
  
  // Рисование графика
  function drawGraph(a, b, c) {
    const canvas = document.getElementById('graph');
    const ctx = canvas.getContext('2d');
    
    // Очистка холста
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Настройки
    const width = canvas.width;
    const height = canvas.height;
    const scale = 20; // Масштаб
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Рисуем оси координат
    ctx.beginPath();
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    
    // Ось X
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    
    // Ось Y
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    
    // Стрелки
    ctx.moveTo(width, centerY);
    ctx.lineTo(width - 10, centerY - 5);
    ctx.lineTo(width - 10, centerY + 5);
    ctx.lineTo(width, centerY);
    
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX - 5, 10);
    ctx.lineTo(centerX + 5, 10);
    ctx.lineTo(centerX, 0);
    
    // Подписи осей
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('x', width - 15, centerY - 10);
    ctx.fillText('y', centerX + 10, 15);
    
    // Деления на осях
    for (let i = -10; i <= 10; i++) {
      if (i !== 0) {
        // Деления на оси X
        const x = centerX + i * scale;
        ctx.moveTo(x, centerY - 3);
        ctx.lineTo(x, centerY + 3);
        ctx.fillText(i.toString(), x - 3, centerY + 15);
        
        // Деления на оси Y
        const y = centerY - i * scale;
        ctx.moveTo(centerX - 3, y);
        ctx.lineTo(centerX + 3, y);
        ctx.fillText(i.toString(), centerX - 20, y + 3);
      }
    }
    
    ctx.stroke();
    
    // Рисуем параболу
    ctx.beginPath();
    ctx.strokeStyle = '#6e48aa';
    ctx.lineWidth = 2;
    
    let firstPoint = true;
    for (let x = -10; x <= 10; x += 0.1) {
      const y = a * x * x + b * x + c;
      const plotX = centerX + x * scale;
      const plotY = centerY - y * scale;
      
      if (firstPoint) {
        ctx.moveTo(plotX, plotY);
        firstPoint = false;
      } else {
        ctx.lineTo(plotX, plotY);
      }
    }
    
    ctx.stroke();
    
    // Рисуем корни, если они есть
    const D = b * b - 4 * a * c;
    if (D >= 0) {
      const x1 = (-b + Math.sqrt(D)) / (2 * a);
      const x2 = (-b - Math.sqrt(D)) / (2 * a);
      
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(centerX + x1 * scale, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
      
      if (D > 0) {
        ctx.beginPath();
        ctx.arc(centerX + x2 * scale, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  // Проверка теоремы Виета
  function checkVieta() {
    const p = parseInt(document.getElementById('vieta-p').textContent);
    const q = parseInt(document.getElementById('vieta-q').textContent);
    
    const root1 = parseInt(document.getElementById('root1').value);
    const root2 = parseInt(document.getElementById('root2').value);
    
    const resultBox = document.getElementById('vieta-result');
    
    if (isNaN(root1) || isNaN(root2)) {
      resultBox.textContent = 'Пожалуйста, введите оба корня';
      resultBox.className = 'result-box error';
      return;
    }
    
    const sumCorrect = root1 + root2 === p;
    const productCorrect = root1 * root2 === q;
    
    if (sumCorrect && productCorrect) {
      resultBox.innerHTML = '✅ Верно!<br>Сумма корней: ' + (root1 + root2) + '<br>Произведение: ' + (root1 * root2);
      resultBox.className = 'result-box success';
    } else {
      let message = '❌ Неверно. ';
      
      if (!sumCorrect && !productCorrect) {
        message += 'Сумма и произведение корней не совпадают.';
      } else if (!sumCorrect) {
        message += 'Сумма корней должна быть равна ' + p + '.';
      } else {
        message += 'Произведение корней должно быть равно ' + q + '.';
      }
      
      resultBox.textContent = message;
      resultBox.className = 'result-box error';
    }
  }
  
  // Проверка схемы Горнера
  function checkHorner() {
    const cells = document.querySelectorAll('#horner-scheme .cell');
    const correctValues = [1, 2, 4, 3, 0];
    let allCorrect = true;
    
    cells.forEach((cell, index) => {
      const value = parseInt(cell.value);
      
      if (isNaN(value) || value !== correctValues[index]) {
        cell.style.backgroundColor = '#ffdddd';
        allCorrect = false;
      } else {
        cell.style.backgroundColor = '#ddffdd';
      }
    });
    
    const resultBox = document.getElementById('horner-result');
    
    if (allCorrect) {
      resultBox.innerHTML = '✅ Отлично! Разложение верное:<br>(x - 1)(x³ + 2x² + 4x + 3)';
      resultBox.className = 'result-box success';
    } else {
      resultBox.textContent = '❌ Есть ошибки. Проверьте расчеты.';
      resultBox.className = 'result-box error';
    }
  }
  
  // Викторина
  function initQuiz() {
    const quizQuestions = [
      {
        question: "Кто впервые систематизировал методы решения квадратных уравнений?",
        options: ["Евклид", "Аль-Хорезми", "Виет", "Бхаскара"],
        correct: 1
      },
      {
        question: "Какое уравнение называется биквадратным?",
        options: [
          "ax + b = 0",
          "ax² + bx + c = 0",
          "ax⁴ + bx² + c = 0",
          "ax³ + bx² + cx + d = 0"
        ],
        correct: 2
      },
      {
        question: "Что выражает теорема Виета?",
        options: [
          "Связь между корнями и коэффициентами уравнения",
          "Формулу дискриминанта",
          "Метод решения биквадратных уравнений",
          "Способ деления многочленов"
        ],
        correct: 0
      }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    
    function displayQuestion() {
      const question = quizQuestions[currentQuestion];
      document.getElementById('quiz-question').textContent = question.question;
      
      const options = document.querySelectorAll('.quiz-option');
      options.forEach((option, index) => {
        option.textContent = question.options[index];
      });
    }
    
    window.checkQuizAnswer = function(selectedIndex) {
      const question = quizQuestions[currentQuestion];
      const resultBox = document.getElementById('quiz-result');
      
      if (selectedIndex === question.correct) {
        resultBox.textContent = '✅ Правильно!';
        resultBox.className = 'result-box success';
        score++;
      } else {
        resultBox.textContent = `❌ Неверно. Правильный ответ: ${question.options[question.correct]}`;
        resultBox.className = 'result-box error';
      }
      
      // Переход к следующему вопросу
      currentQuestion++;
      
      if (currentQuestion < quizQuestions.length) {
        setTimeout(displayQuestion, 1500);
        setTimeout(() => {
          resultBox.textContent = '';
          resultBox.className = 'result-box';
        }, 1500);
      } else {
        // Конец викторины
        setTimeout(() => {
          resultBox.innerHTML = `🏆 Викторина завершена!<br>Ваш результат: ${score} из ${quizQuestions.length}`;
          resultBox.className = 'result-box info';
          
          // Кнопка "Начать заново"
          const restartBtn = document.createElement('button');
          restartBtn.textContent = 'Попробовать еще раз';
          restartBtn.className = 'calc-btn';
          restartBtn.onclick = function() {
            currentQuestion = 0;
            score = 0;
            displayQuestion();
            resultBox.textContent = '';
            resultBox.className = 'result-box';
            this.remove();
          };
          
          resultBox.appendChild(document.createElement('br'));
          resultBox.appendChild(restartBtn);
        }, 1500);
      }
    };
    
    // Начинаем викторину
    displayQuestion();
  }
  
  // Плавная прокрутка для навигации
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });