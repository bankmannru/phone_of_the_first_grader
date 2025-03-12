class GeometryDash {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.player = {
            x: 50,
            y: this.height - 50,
            width: 30,
            height: 30,
            jumping: false,
            velocity: 0,
            gravity: 0.8,
            jumpStrength: -15
        };
        this.obstacles = [];
        this.score = 0;
        this.gameSpeed = 5;
        this.gameOver = false;
        this.running = false;
        this.obstacleTimer = 0;
        this.lastTime = 0;
        this.ground = this.height - 20;
        
        // Привязка методов
        this.start = this.start.bind(this);
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.handleJump = this.handleJump.bind(this);
        
        // Обработчик нажатия
        this.canvas.addEventListener('click', this.handleJump);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                this.handleJump();
            }
        });
    }
    
    start() {
        this.gameOver = false;
        this.running = true;
        this.obstacles = [];
        this.score = 0;
        this.gameSpeed = 5;
        this.player.y = this.height - 50;
        this.player.velocity = 0;
        this.lastTime = performance.now();
        requestAnimationFrame(this.update);
    }
    
    update(timestamp) {
        if (!this.running) return;
        
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Обновление игрока
        if (this.player.jumping) {
            this.player.velocity += this.player.gravity;
            this.player.y += this.player.velocity;
            
            if (this.player.y >= this.ground - this.player.height) {
                this.player.y = this.ground - this.player.height;
                this.player.jumping = false;
                this.player.velocity = 0;
            }
        }
        
        // Создание препятствий
        this.obstacleTimer += deltaTime;
        if (this.obstacleTimer > 1500) { // Новое препятствие каждые 1.5 секунды
            this.obstacleTimer = 0;
            const height = Math.random() * 50 + 20;
            this.obstacles.push({
                x: this.width,
                y: this.ground - height,
                width: 30,
                height: height
            });
        }
        
        // Обновление препятствий
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].x -= this.gameSpeed;
            
            // Проверка столкновений
            if (
                this.player.x < this.obstacles[i].x + this.obstacles[i].width &&
                this.player.x + this.player.width > this.obstacles[i].x &&
                this.player.y < this.obstacles[i].y + this.obstacles[i].height &&
                this.player.y + this.player.height > this.obstacles[i].y
            ) {
                this.gameOver = true;
                this.running = false;
            }
            
            // Удаление препятствий, вышедших за пределы экрана
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
                i--;
                this.score++;
                
                // Увеличение скорости игры
                if (this.score % 5 === 0) {
                    this.gameSpeed += 0.5;
                }
            }
        }
        
        this.draw();
        
        if (!this.gameOver) {
            requestAnimationFrame(this.update);
        } else {
            this.drawGameOver();
        }
    }
    
    draw() {
        // Очистка холста
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Фон
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Земля
        this.ctx.fillStyle = '#444';
        this.ctx.fillRect(0, this.ground, this.width, this.height - this.ground);
        
        // Игрок
        this.ctx.fillStyle = '#00c6ff';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Препятствия
        this.ctx.fillStyle = '#ff4757';
        for (const obstacle of this.obstacles) {
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
        
        // Счет
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Счет: ${this.score}`, 10, 30);
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Игра окончена!', this.width / 2, this.height / 2 - 30);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Счет: ${this.score}`, this.width / 2, this.height / 2 + 10);
        
        this.ctx.fillStyle = '#00c6ff';
        this.ctx.fillRect(this.width / 2 - 75, this.height / 2 + 40, 150, 40);
        
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Играть снова', this.width / 2, this.height / 2 + 65);
        
        // Обработчик нажатия для перезапуска
        const handleRestart = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (
                x >= this.width / 2 - 75 &&
                x <= this.width / 2 + 75 &&
                y >= this.height / 2 + 40 &&
                y <= this.height / 2 + 80
            ) {
                this.canvas.removeEventListener('click', handleRestart);
                this.start();
            }
        };
        
        this.canvas.addEventListener('click', handleRestart);
    }
    
    handleJump() {
        if (!this.running) return;
        
        if (!this.player.jumping) {
            this.player.jumping = true;
            this.player.velocity = this.player.jumpStrength;
        }
    }
}