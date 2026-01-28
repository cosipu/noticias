// Contador inteligente con dos fases
// Fase 1: Cuenta regresiva HASTA el 11 de marzo de 2026
// Fase 2: Cuenta progresiva DESDE el 11 de marzo (4 años)

class TwoPhaseCountdown {
  constructor() {
    // Fecha pivote: 11 de marzo de 2026 a las 00:00:00
    this.pivotDate = new Date('2026-03-11T00:00:00');
    
    // Elementos del DOM
    this.elements = {
      item1: document.getElementById('item-1'),
      item2: document.getElementById('item-2'),
      item3: document.getElementById('item-3'),
      item4: document.getElementById('item-4'),
      unit1: document.getElementById('unit-1'),
      unit2: document.getElementById('unit-2'),
      unit3: document.getElementById('unit-3'),
      unit4: document.getElementById('unit-4'),
      phaseLabel: document.getElementById('countdown-phase-label'),
      info: document.getElementById('countdown-info')
    };
    
    this.init();
  }
  
  init() {
    this.update();
    // Actualizar cada segundo
    setInterval(() => this.update(), 1000);
  }
  
  getCurrentPhase() {
    const now = new Date();
    return now < this.pivotDate ? 'PHASE_1' : 'PHASE_2';
  }
  
  // FASE 1: Contar hacia atrás hasta el 11 de marzo
  calculatePhase1() {
    const now = new Date();
    const diff = this.pivotDate - now; // Tiempo restante (positivo)
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const totalSeconds = Math.floor(diff / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);
    
    return { days, hours, minutes, seconds };
  }
  
  // FASE 2: Contar hacia adelante desde el 11 de marzo (4 años)
  calculatePhase2() {
    const now = new Date();
    const diff = now - this.pivotDate; // Tiempo transcurrido
    
    const totalSeconds = Math.floor(diff / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);
    
    // Calcular años y meses más precisamente
    let years = Math.floor(days / 365.25);
    let remainingDays = days - Math.floor(years * 365.25);
    
    return { days: remainingDays, hours, minutes, seconds, years };
  }
  
  update() {
    const phase = this.getCurrentPhase();
    
    if (phase === 'PHASE_1') {
      this.updatePhase1();
    } else {
      this.updatePhase2();
    }
  }
  
  updatePhase1() {
    const time = this.calculatePhase1();
    
    // Actualizar valores
    if (this.elements.item1) this.elements.item1.textContent = time.days;
    if (this.elements.item2) this.elements.item2.textContent = String(time.hours).padStart(2, '0');
    if (this.elements.item3) this.elements.item3.textContent = String(time.minutes).padStart(2, '0');
    if (this.elements.item4) this.elements.item4.textContent = String(time.seconds).padStart(2, '0');
    
    // Actualizar etiquetas
    if (this.elements.unit1) this.elements.unit1.textContent = 'Días';
    if (this.elements.unit2) this.elements.unit2.textContent = 'Horas';
    if (this.elements.unit3) this.elements.unit3.textContent = 'Minutos';
    if (this.elements.unit4) this.elements.unit4.textContent = 'Segundos';
    
    // Actualizar label
    if (this.elements.phaseLabel) {
      this.elements.phaseLabel.textContent = 'FASE 1: CUENTA REGRESIVA HASTA EL 11 DE MARZO';
      this.elements.phaseLabel.className = 'countdown-label phase-1';
    }
    
    // Información
    if (this.elements.info) {
      this.elements.info.textContent = '⏳ Tiempo restante para el 11 de marzo de 2026';
    }
  }
  
  updatePhase2() {
    const time = this.calculatePhase2();
    
    // Actualizar valores
    if (this.elements.item1) this.elements.item1.textContent = time.years;
    if (this.elements.item2) this.elements.item2.textContent = time.days;
    if (this.elements.item3) this.elements.item3.textContent = String(time.hours).padStart(2, '0');
    if (this.elements.item4) this.elements.item4.textContent = String(time.minutes).padStart(2, '0');
    
    // Actualizar etiquetas
    if (this.elements.unit1) this.elements.unit1.textContent = 'Años';
    if (this.elements.unit2) this.elements.unit2.textContent = 'Días';
    if (this.elements.unit3) this.elements.unit3.textContent = 'Horas';
    if (this.elements.unit4) this.elements.unit4.textContent = 'Minutos';
    
    // Actualizar label
    if (this.elements.phaseLabel) {
      this.elements.phaseLabel.textContent = 'FASE 2: CONTEO DESDE EL 11 DE MARZO DE 2026';
      this.elements.phaseLabel.className = 'countdown-label phase-2';
    }
    
    // Información
    if (this.elements.info) {
      const endDate = new Date('2030-03-11T00:00:00');
      this.elements.info.textContent = '⏰ Tiempo desde el inicio del gobierno (término: 11 de marzo de 2030)';
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new TwoPhaseCountdown();
});
