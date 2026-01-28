// Contador regresivo desde el 11 de marzo
// Actualiza en tiempo real cada segundo

class CountdownTimer {
  constructor(startDate) {
    this.startDate = new Date(startDate);
    this.elements = {
      years: document.getElementById('years'),
      months: document.getElementById('months'),
      days: document.getElementById('days'),
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
      info: document.getElementById('countdown-info')
    };
    
    this.init();
  }
  
  init() {
    this.update();
    setInterval(() => this.update(), 1000);
  }
  
  calculateDifference() {
    const now = new Date();
    const diff = now - this.startDate;
    
    // Convertir a unidades de tiempo
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    // Calcular años y meses considerando fecha exacta
    let years = now.getFullYear() - this.startDate.getFullYear();
    let months = now.getMonth() - this.startDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Ajustar días del mes
    let dayOfMonth = now.getDate() - this.startDate.getDate();
    if (dayOfMonth < 0) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
      
      // Días del mes anterior
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      dayOfMonth += prevMonth.getDate();
    }
    
    return {
      years,
      months,
      days: dayOfMonth,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
      totalDays: days
    };
  }
  
  update() {
    const time = this.calculateDifference();
    
    // Actualizar elementos HTML
    if (this.elements.years) this.elements.years.textContent = time.years;
    if (this.elements.months) this.elements.months.textContent = time.months;
    if (this.elements.days) this.elements.days.textContent = time.days;
    if (this.elements.hours) this.elements.hours.textContent = String(time.hours).padStart(2, '0');
    if (this.elements.minutes) this.elements.minutes.textContent = String(time.minutes).padStart(2, '0');
    if (this.elements.seconds) this.elements.seconds.textContent = String(time.seconds).padStart(2, '0');
    
    // Información adicional
    if (this.elements.info) {
      this.elements.info.textContent = `Total: ${time.totalDays.toLocaleString()} días transcurridos`;
    }
  }
}

// Inicializar contador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Fecha de inicio: 11 de marzo a las 00:00:00
  // Ajustar el año según corresponda (2025, 2026, etc.)
  const startDate = '2026-03-11T00:00:00';
  new CountdownTimer(startDate);
});
