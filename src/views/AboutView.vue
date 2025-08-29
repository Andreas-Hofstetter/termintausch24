<template>
<!-- eslint-disable -->
    <h2>TerminTausch24 - Weil Zeit Geld ist</h2>
    <p>
      TerminTausch24 ist ein digitaler Marktplatz für verfügbare Zeitfenster. 
      Ob Werkstatttermin, Handwerkerleistung, Restaurantbesuch oder Mietgerät – 
      manchmal braucht man einen Termin dringend, während dieser für andere leicht entbehrlich ist oder sogar gar nicht wahrgenommen werden kann.
    </p>
    <p>
      Unsere Plattform bietet eine einfache Möglichkeit, solche Termine weiterzugeben oder zu übernehmen. 
    </p>
<div class="cnt">
      <div class="modeSwitch" role="tablist" aria-label="Mehrwert für verschiedene Gruppen">
        <button role="tab" @click="setActiveTab('kaeufer')" :class="{modeChosen: activeTab === 'kaeufer'}">Käufer</button>
        <button role="tab" @click="setActiveTab('verkaeufer')" :class="{modeChosen: activeTab === 'verkaeufer'}">Verkäufer</button>
        <button role="tab" @click="setActiveTab('dienstleister')" :class="{modeChosen: activeTab === 'dienstleister'}">Dienstleister</button>
      </div>
    </div>

    <!-- Käufer -->
    <div v-if="activeTab === 'kaeufer'" class="about-content">
      <h3>Vorteile für Käufer</h3>
      <div class="benefit-grid">
        <div class="benefit-card">
          <h4>⚡ Sofortige Verfügbarkeit</h4>
          <p>Erhalten Sie kurzfristig Termine, die normalerweise wochenlang ausgebucht sind.</p>
        </div>
        <div class="benefit-card">
          <h4>💰 Einfacher Preisvergleich</h4>
          <p>Zahlen Sie marktgerechte Preise für dringend benötigte Termine.</p>
        </div>
        <div class="benefit-card">
          <h4>🎯 Zielgerichtete Suche</h4>
          <p>Filtern Sie nach Region, Kategorie, Preis und Zeitraum - finden Sie genau was Sie brauchen.</p>
        </div>
        <div class="benefit-card">
          <h4>🔄 Weiterverkaufsmöglichkeit</h4>
          <p>Auch gekaufte Termine können Sie bei Bedarf wieder weiterverkaufen.</p>
        </div>
      </div>
    </div>

    <!-- Verkäufer -->
    <div v-if="activeTab === 'verkaeufer'" class="about-content">
      <h3>Vorteile für Verkäufer</h3>
      <div class="benefit-grid">
        <div class="benefit-card">
          <h4>💸 Geld statt Verlust</h4>
          <p>Verwandeln Sie schwer wahrnehmbare oder nicht dringend benötigte Termine in Geld statt sie verfallen zu lassen.</p>
        </div>
        <div class="benefit-card">
          <h4>📱 Flexibilität</h4>
          <p>Reagieren Sie spontan auf Planänderungen - jederzeit und überall.</p>
        </div>
        <div class="benefit-card">
          <h4>✅ Rechtssicherer Verkauf</h4>
          <p>bestätigte Termine von unseren Partnerdienstleisters sind garantiert weiterveräußerbar</p>
        </div>
      </div>
    </div>

    <!-- Dienstleister -->
    <div v-if="activeTab === 'dienstleister'" class="about-content">
      <h3>Vorteile für Dienstleister</h3>
      <div class="benefit-grid">
        <div class="benefit-card">
          <h4>📈 Weniger Ausfälle</h4>
          <p>Reduzieren Sie No-Shows und kurzfristige Absagen durch motivierte Ersatzkunden.</p>
        </div>
        <div class="benefit-card">
          <h4>💼 Optimale Auslastung</h4>
          <p>Füllen Sie freie Termine - maximieren Sie Ihre Kapazitäten.</p>
        </div>
        <div class="benefit-card">
          <h4>🎯 Neue Kunden</h4>
          <p>Erreichen Sie Kunden, die Ihre Dienstleistung sonst nie probiert hätten.</p>
        </div>
        <div class="benefit-card">
          <h4>👍 Höhere Kundenzufriedenheit</h4>
          <p>Bieten Sie Ihren Kunden mehr Flexibilität und steigern Sie damit den Mehrwert Ihrer Dienstleistung.</p>
        </div>
        <div class="benefit-card">
          <h4>💡 Zusatzeinnahmen</h4>
          <p>Stellen Sie selbst Premium-Termine mit hoher Nachfrage zu höheren Preisen ein.</p>
        </div>
      </div>
    </div>

    <div class="about-footer">
      <p><strong>Das Ergebnis:</strong> Eine effiziente Kreislaufwirtschaft für Termine, die allen Beteiligten einen Mehrwert bietet und Verschwendung vermeidet.</p>
    </div>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      activeTab: 'kaeufer'
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    }
  }
}
</script>
<style scoped>
.about-content {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.about-content h3 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.benefit-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.benefit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.benefit-card h4 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.benefit-card p {
  color: #4a5568;
  line-height: 1.5;
  margin: 0;
}

.about-footer {
  text-align: center;
  margin: 3rem auto;
  padding: 2rem;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  max-width: 800px;
}

.about-footer p {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .benefit-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .benefit-card {
    padding: 1rem;
  }
  
  .about-content {
    padding: 0 1rem;
  }
}
</style>
