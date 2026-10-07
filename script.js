/* =========================================================
   VIADUTO INTELIGENTE - SISTEMA AVANÇADO v2.5
   Módulos: Partículas | Cursor | Scroll | Simulador | 
            Calculadora | Animações | Sensores | Catraca
   ========================================================= */

'use strict';

/* =========================================================
   MÓDULO 1: SISTEMA DE PARTÍCULAS QUÂNTICAS
   Simula comportamento ondulatório e conexões neurais
   ========================================================= */
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = 80;
        this.maxDistance = 130;
        this.animationId = null;
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const colors = ['#00f0ff', '#ff00e5', '#7b2ff7', '#00ff88'];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2.5 + 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.pulse += p.pulseSpeed;

            // Rebote nas bordas
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Interação com mouse
            if (this.mouse.x !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x -= (dx / dist) * force * 2;
                    p.y -= (dy / dist) * force * 2;
                }
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenhar conexões
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.maxDistance) {
                    const opacity = (1 - dist / this.maxDistance) * 0.35;
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.6;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }

        // Desenhar partículas
        this.particles.forEach(p => {
            const glowSize = p.radius + Math.sin(p.pulse) * 1.5;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, Math.abs(glowSize), 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = p.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

/* =========================================================
   MÓDULO 2: CURSOR PERSONALIZADO COM EFEITOS
   ========================================================= */
class CustomCursor {
    constructor() {
        this.dot = document.querySelector('.cursor-dot');
        this.outline = document.querySelector('.cursor-outline');
        if (!this.dot || !this.outline) return;
        this.mousePos = { x: 0, y: 0 };
        this.outlinePos = { x: 0, y: 0 };
        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
            this.dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        });

        // Hover em elementos interativos
        document.querySelectorAll('a, button, .btn, .nav-link, input').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.outline.style.transform += ' scale(1.5)';
                this.outline.style.borderColor = '#ff00e5';
            });
            el.addEventListener('mouseleave', () => {
                this.outline.style.borderColor = '#00f0ff';
            });
        });

        this.animateOutline();
    }

    animateOutline() {
        this.outlinePos.x += (this.mousePos.x - this.outlinePos.x) * 0.15;
        this.outlinePos.y += (this.mousePos.y - this.outlinePos.y) * 0.15;
        this.outline.style.transform = 
            `translate(${this.outlinePos.x}px, ${this.outlinePos.y}px) translate(-50%, -50%)`;
        requestAnimationFrame(() => this.animateOutline());
    }
}

/* =========================================================
   MÓDULO 3: NAVBAR & SCROLL PROGRESS
   ========================================================= */
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.progressBar = document.getElementById('scrollProgress');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    handleScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        if (this.progressBar) this.progressBar.style.width = `${progress}%`;
        if (this.navbar) {
            this.navbar.classList.toggle('scrolled', scrollTop > 50);
        }

        // Active section highlight
        let current = '';
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (scrollTop >= sectionTop) current = section.getAttribute('id');
        });

        this.navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger?.classList.remove('active');
        this.navMenu?.classList.remove('active');
    }
}

/* =========================================================
   MÓDULO 4: ANIMAÇÕES DE REVELAÇÃO (INTERSECTION OBSERVER)
   ========================================================= */
class RevealAnimator {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px) scale(0.95)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }
}

/* =========================================================
   MÓDULO 5: CONTADOR DE ESTATÍSTICAS ANIMADO
   ========================================================= */
class StatCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            element.textContent = Math.floor(target * eased);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };
        requestAnimationFrame(update);
    }
}

/* =========================================================
   MÓDULO 6: SIMULADOR DA VIADUTO INTELIGENTE
   Sistema que mede altura e controla a catraca
   Baseado em: h = (v × t) / 2 (velocidade do som)
   ========================================================= */
class BridgeSimulator {
    constructor() {
        // Elementos
        this.car = document.getElementById('car');
        this.catracaArm = document.getElementById('catracaArm');
        this.alturaRange = document.getElementById('alturaRange');
        this.limiteRange = document.getElementById('limiteRange');
        this.alturaDisplay = document.getElementById('alturaDisplay');
        this.limiteDisplay = document.getElementById('limiteDisplay');
        this.measureValue = document.getElementById('measureValue');
        this.measureLine = document.getElementById('measureLine');
        this.distanciaValor = document.getElementById('distanciaValor');
        this.tempoValor = document.getElementById('tempoValor');
        this.alturaCalculada = document.getElementById('alturaCalculada');
        this.statusValor = document.getElementById('statusValor');
        this.btnMedir = document.getElementById('btnMedir');
        this.btnReset = document.getElementById('btnReset');

        // Constantes físicas
        this.SPEED_OF_SOUND = 343; // m/s (a 20°C)
        this.SENSOR_OFFSET = 5; // cm - distância do sensor ao chão
        this.isMeasuring = false;

        this.init();
    }

    init() {
        if (!this.alturaRange) return;

        this.alturaRange.addEventListener('input', () => this.updateCarHeight());
        this.limiteRange.addEventListener('input', () => this.updateLimit());
        this.btnMedir.addEventListener('click', () => this.measure());
        this.btnReset.addEventListener('click', () => this.reset());
        
        this.updateCarHeight();
        this.updateLimit();
    }

    updateCarHeight() {
        const altura = parseFloat(this.alturaRange.value);
        this.alturaDisplay.textContent = `${altura} cm`;
        this.car.style.setProperty('--car-height', `${altura * 3}px`);
        this.measureValue.textContent = `${altura} cm`;
        this.measureLine.style.height = `${altura * 3}px`;
    }

    updateLimit() {
        const limite = parseFloat(this.limiteRange.value);
        this.limiteDisplay.textContent = `${limite} cm`;
    }

    /* Simulação do sensor ultrassônico HC-SR04
       Cálculo: t = (2 × d) / v
       h = (v × t) / 2 */
    calculateSensorData(altura) {
        // Distância do sensor até o topo do carro (em cm)
        const distancia = this.SENSOR_OFFSET + (30 - altura);
        
        // Tempo de eco em microssegundos
        // t = (2 × d) / v  onde v em cm/µs = 34300 cm/s = 0.0343 cm/µs
        const velocidadeCmMicrosseg = this.SPEED_OF_SOUND * 100 / 1000000;
        const tempo = Math.round((2 * distancia) / velocidadeCmMicrosseg);
        
        // Altura medida de volta
        const alturaCalculada = this.SENSOR_OFFSET + (30 - (tempo * velocidadeCmMicrosseg / 2));
        
        // Adicionar ruído realista (± 0.3 cm de precisão)
        const ruido = (Math.random() - 0.5) * 0.6;
        
        return {
            distancia: distancia.toFixed(2),
            tempo: tempo,
            altura: (alturaCalculada + ruido).toFixed(2)
        };
    }

    async measure() {
        if (this.isMeasuring) return;
        this.isMeasuring = true;
        this.btnMedir.disabled = true;
        this.btnMedir.textContent = '📡 Medindo...';

        const altura = parseFloat(this.alturaRange.value);
        const limite = parseFloat(this.limiteRange.value);

        // Efeito de scan
        this.car.classList.add('scanning');
        this.statusValor.textContent = 'Medindo...';
        this.statusValor.style.color = '#ffd700';

        // Simular múltiplas leituras (realismo de sensor)
        const leituras = [];
        for (let i = 0; i < 5; i++) {
            await this.sleep(150);
            const dados = this.calculateSensorData(altura);
            leituras.push(parseFloat(dados.altura));
            this.tempoValor.textContent = `${dados.tempo} µs`;
            this.distanciaValor.textContent = `${dados.distancia} cm`;
        }

        // Média das leituras (reduz ruído)
        const mediaAltura = leituras.reduce((a, b) => a + b, 0) / leituras.length;
        this.alturaCalculada.textContent = `${mediaAltura.toFixed(2)} cm`;

        await this.sleep(500);
        this.car.classList.remove('scanning');

        // Decisão: liberar ou bloquear
        const aprovado = mediaAltura <= limite;
        await this.processDecision(aprovado, mediaAltura, limite);

        this.isMeasuring = false;
        this.btnMedir.disabled = false;
        this.btnMedir.textContent = '🔍 Medir e Testar';
    }

    async processDecision(aprovado, alturaMedia, limite) {
        if (aprovado) {
            this.statusValor.textContent = '✅ LIBERADO';
            this.statusValor.style.color = '#00ff88';
            
            // Abrir catraca (90 graus)
            this.catracaArm.style.transform = 'rotate(-90deg)';
            this.catracaArm.style.background = 'linear-gradient(180deg, #00ff88, #00f0ff)';
            this.catracaArm.style.boxShadow = '0 0 30px #00ff88';
            
            await this.sleep(800);
            
            // Mover carro para frente
            this.car.classList.add('passing');
            await this.sleep(2500);
            this.car.classList.remove('passing');
            
            // Fechar catraca
            this.catracaArm.style.transform = 'rotate(0deg)';
            this.catracaArm.style.background = '';
            this.catracaArm.style.boxShadow = '';
        } else {
            this.statusValor.textContent = '❌ BLOQUEADO';
            this.statusValor.style.color = '#ff0044';
            
            // Catraca permanece fechada, com efeito de alerta
            this.catracaArm.style.background = 'linear-gradient(180deg, #ff0044, #ff00e5)';
            this.catracaArm.style.boxShadow = '0 0 30px #ff0044';
            this.catracaArm.classList.add('shake');
            
            // Tremor no carro
            this.car.classList.add('blocked');
            
            await this.sleep(1500);
            this.catracaArm.classList.remove('shake');
            this.car.classList.remove('blocked');
        }
    }

    reset() {
        this.car.classList.remove('passing', 'blocked', 'scanning');
        this.catracaArm.style.transform = 'rotate(0deg)';
        this.catracaArm.style.background = '';
        this.catracaArm.style.boxShadow = '';
        this.statusValor.textContent = 'Aguardando';
        this.statusValor.style.color = '';
        this.distanciaValor.textContent = '-- cm';
        this.tempoValor.textContent = '-- µs';
        this.alturaCalculada.textContent = '-- cm';
        this.alturaRange.value = 10;
        this.limiteRange.value = 15;
        this.updateCarHeight();
        this.updateLimit();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/* =========================================================
   MÓDULO 7: CALCULADORA CIENTÍFICA AVANÇADA
   ========================================================= */
class ScientificCalculator {
    constructor() {
        this.tempoInput = document.getElementById('tempoInput');
        this.velocidadeInput = document.getElementById('velocidadeInput');
        this.btnCalcular = document.getElementById('btnCalcular');
        this.resultAltura = document.getElementById('resultAltura');
        this.resultBox = document.getElementById('resultBox');
        this.VELOCITY_CM_US = 0.0343;
        this.history = [];
        this.init();
    }

    init() {
        if (!this.btnCalcular) return;
        this.btnCalcular.addEventListener('click', () => this.calculate());
        this.tempoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculate();
        });
    }

    calculate() {
        const tempo = parseFloat(this.tempoInput.value);
        const velocidade = parseFloat(this.velocidadeInput.value);

        if (isNaN(tempo) || tempo <= 0) {
            this.showError('Tempo inválido');
            return;
        }

        // Fórmula: h = (v × t) / 2
        // v em m/s → cm/µs: v × 100 / 1e6
        const velCmUs = (velocidade * 100) / 1000000;
        const distancia = (velCmUs * tempo) / 2;

        this.animateResult(distancia);
        
        // Registro de histórico
        this.history.push({ tempo, velocidade, distancia });
        console.log('📊 Histórico de cálculos:', this.history);
    }

    animateResult(value) {
        this.resultBox.classList.add('highlight');
        let current = 0;
        const target = value;
        const steps = 30;
        const increment = target / steps;
        let step = 0;

        const timer = setInterval(() => {
            current += increment;
            step++;
            this.resultAltura.textContent = `${current.toFixed(2)} cm`;
            if (step >= steps) {
                clearInterval(timer);
                this.resultAltura.textContent = `${target.toFixed(2)} cm`;
                setTimeout(() => this.resultBox.classList.remove('highlight'), 1000);
            }
        }, 20);
    }

    showError(msg) {
        this.resultAltura.textContent = msg;
        this.resultAltura.style.color = '#ff0044';
        setTimeout(() => {
            this.resultAltura.textContent = '-- cm';
            this.resultAltura.style.color = '';
        }, 2000);
    }
}

/* =========================================================
   MÓDULO 8: SMOOTH SCROLL APRIMORADO
   ========================================================= */
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }
}

/* =========================================================
   MÓDULO 9: EASTER EGGS & ATALHOS DE TECLADO
   ========================================================= */
class EasterEggs {
    constructor() {
        this.konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
        this.userInput = [];
        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => {
            this.userInput.push(e.key);
            this.userInput = this.userInput.slice(-this.konamiCode.length);
            
            if (this.userInput.join('').toLowerCase() === this.konamiCode.join('').toLowerCase()) {
                this.activateMatrixMode();
            }

            // Atalho: 'S' ativa simulador
            if (e.key === 's' && e.ctrlKey) {
                e.preventDefault();
                document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    activateMatrixMode() {
        console.log('🎮 KONAMI CODE ATIVADO! Modo Matrix iniciado...');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 5000);
        
        // Exibir notificação
        const notification = document.createElement('div');
        notification.textContent = '🎮 KONAMI CODE ATIVADO!';
        notification.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(135deg, #00f0ff, #ff00e5);
            color: white; padding: 15px 30px; border-radius: 50px;
            font-family: Orbitron, sans-serif; font-weight: 700;
            z-index: 10000; box-shadow: 0 0 30px rgba(0,240,255,0.7);
            animation: slideIn 0.5s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

/* =========================================================
   MÓDULO 10: GERENCIADOR PRINCIPAL DA APLICAÇÃO
   ========================================================= */
class App {
    constructor() {
        this.modules = {};
        this.startTime = performance.now();
    }

    async init() {
        console.log('%c🚀 VIADUTO INTELIGENTE v2.5', 'color: #00f0ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00f0ff;');
        console.log('%c Sistema inicializando...', 'color: #8892b0; font-size: 12px;');

        // Aguardar DOM
        if (document.readyState === 'loading') {
            await new Promise(r => document.addEventListener('DOMContentLoaded', r));
        }

        // Inicializar módulos com try/catch individual
        const moduleMap = {
            particles: () => new ParticleSystem('particles-canvas'),
            cursor: () => new CustomCursor(),
            navigation: () => new NavigationManager(),
            reveal: () => new RevealAnimator(),
            counters: () => new StatCounter(),
            simulator: () => new BridgeSimulator(),
            calculator: () => new ScientificCalculator(),
            scroll: () => new SmoothScroll(),
            eggs: () => new EasterEggs()
        };

        for (const [name, factory] of Object.entries(moduleMap)) {
            try {
                this.modules[name] = factory();
                console.log(`%c ✅ Módulo "${name}" carregado`, 'color: #00ff88;');
            } catch (err) {
                console.error(`❌ Erro no módulo "${name}":`, err);
            }
        }

        const loadTime = (performance.now() - this.startTime).toFixed(2);
        console.log(`%c⚡ Sistema pronto em ${loadTime}ms`, 'color: #ff00e5; font-weight: bold;');
        console.log('%c💡 Dica: Ctrl+S vai para o simulador | Konami Code libera easter egg', 'color: #ffd700;');
    }
}

// ===== INICIALIZAÇÃO =====
const app = new App();
app.init();

// Expor globalmente para debug
window.PonteInteligente = app;