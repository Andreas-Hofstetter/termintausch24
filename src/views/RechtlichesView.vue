<template>
<!-- eslint-disable -->
  <div class="cnt">
    <div class="modeSwitch" role="tablist" aria-label="Rechtliche Informationen">
      <button role="tab" @click="setActiveTab('agb')" :class="{modeChosen: activeTab === 'agb'}">AGB</button>
      <button role="tab" @click="setActiveTab('datenschutz')" :class="{modeChosen: activeTab === 'datenschutz'}">Datenschutz</button>
      <button role="tab" @click="setActiveTab('impressum')" :class="{modeChosen: activeTab === 'impressum'}">Impressum</button>
    </div>
  </div>

  <!-- AGB -->
  <div v-if="activeTab === 'agb'" class="legal-content">
    <h2>Allgemeine Geschäftsbedingungen (AGB)</h2>
    
    <h3>§1 Geltungsbereich</h3>
    <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen Andreas Hofstetter Einzelkaufmann (nachfolgend "Plattformbetreiber") und den Nutzern der Plattform TerminTausch24.</p>
    
    <h3>§2 Plattformzweck und Erlaubte Termine</h3>
    <p><strong>2.1</strong> TerminTausch24 ist ein digitaler Marktplatz für den Handel mit verfügbaren Terminen.</p>
    <p><strong>2.2</strong> Es dürfen nur Termine gehandelt werden, für die eine ausdrückliche Erlaubnis des ursprünglichen Dienstleisters zur Übertragung besteht oder die der Dienstleister selbst als Nutzer auf die Plattform gestellt hat.</p>
    <p><strong>2.3</strong> Nutzer versichern bei jedem Angebot, dass sie zur Übertragung des Termins berechtigt sind.</p>
    
    <h3>§3 Ausgeschlossene Branchen und Termine</h3>
    <p>Der Handel ist ausgeschlossen für Termine aus folgenden Bereichen:</p>
    <ul>
      <li>Medizinische und therapeutische Behandlungen (Ärzte, Physiotherapie, etc.)</li>
      <li>Rechts- und Steuerberatung</li>
      <li>Behördentermine und amtliche Verfahren</li>
      <li>Termine mit personenbezogenen Sicherheitsüberprüfungen</li>
      <li>Prüfungstermine und Bildungsveranstaltungen</li>
      <li>Versicherungsberatung und Finanzdienstleistungen</li>
    </ul>
    
    <h3>§4 Vertragsschluss und Vermittlung</h3>
    <p><strong>4.1</strong> Der Plattformbetreiber vermittelt ausschließlich zwischen den Nutzern. Der eigentliche Kaufvertrag kommt zwischen Käufer und Verkäufer zustande.</p>
    <p><strong>4.2</strong> Der Vertrag kommt durch die Bestätigung des Kaufs durch den Käufer und die Übertragung der Terminberechtigung zustande.</p>
    
    <h3>§5 Preise und Zahlungsbedingungen</h3>
    <p><strong>5.1</strong> Die Zahlung erfolgt direkt zwischen den Vertragsparteien.</p>
    <p><strong>5.2</strong> Der Plattformbetreiber erhebt keine Vermittlungsgebühren.</p>
    
    <h3>§6 Pflichten der Nutzer</h3>
    <p><strong>6.1</strong> Nutzer sind verpflichtet, nur berechtigte Termine anzubieten.</p>
    <p><strong>6.2</strong> Falsche oder irreführende Angaben sind untersagt.</p>
    
    <h3>§7 Haftung und Haftungsausschluss</h3>
    <p><strong>7.1</strong> Der Plattformbetreiber haftet nicht für die Erfüllung der vermittelten Termine oder deren Übertragbarkeit.</p>
    <p><strong>7.2</strong> Die Haftung beschränkt sich auf die ordnungsgemäße Bereitstellung der Vermittlungsplattform.</p>
    <p><strong>7.3</strong> Nutzer haften selbst für die Rechtmäßigkeit ihrer Angebote.</p>
    
    <h3>§8 Kein Widerrufsrecht</h3>
    <p>Da es sich bei den vermittelten Leistungen um Dienstleistungen mit einem spezifischen Termin handelt, besteht kein Widerrufsrecht gem. §312g Abs. 2 Nr. 9 BGB.</p>
    
    <h3>§9 Datenschutz</h3>
    <p>Der Umgang mit personenbezogenen Daten regelt sich nach unserer Datenschutzerklärung.</p>
    
    <h3>§10 Schlussbestimmungen</h3>
    <p><strong>10.1</strong> Es gilt deutsches Recht.</p>
    <p><strong>10.2</strong> Bei Verbrauchern ist der Gerichtsstand der Wohnsitz des Verbrauchers, bei Unternehmern Bayreuth.</p>
  </div>

  <!-- Datenschutz -->
  <div v-if="activeTab === 'datenschutz'" class="legal-content">
    <h2>Datenschutzerklärung</h2>
    
    <h3>1. Datenschutz auf einen Blick</h3>
    <h4>Allgemeine Hinweise</h4>
    <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
    
    <h4>Datenerfassung auf dieser Website</h4>
    <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum entnehmen.</p>
    
    <h3>2. Hosting</h3>
    <p>Diese Website wird bei Firebase (Google LLC) gehostet. Dabei werden Server-Log-Files automatisch gespeichert.</p>
    
    <h3>3. Allgemeine Hinweise und Pflichtinformationen</h3>
    <h4>Datenschutz</h4>
    <p>Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
    
    <h4>Hinweis zur verantwortlichen Stelle</h4>
    <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br>
    Andreas Hofstetter Einzelkaufmann<br>
    Email: andreashofstetter12@gmail.com<br>
    Telefon: 01743902112</p>
    
    <h3>4. Datenerfassung auf dieser Website</h3>
    <h4>Google Authentication</h4>
    <p>Diese Website nutzt Google Authentication für die Authentifizierung. Dabei werden folgende Daten verarbeitet:</p>
    <ul>
      <li>Name (wie bei Google hinterlegt)</li>
      <li>E-Mail-Adresse</li>
      <li>Eindeutige Nutzer-ID (GoogleId)</li>
    </ul>
    
    <h4>Firestore Datenbank</h4>
    <p>Zur Bereitstellung unserer Dienste speichern wir folgende Daten:</p>
    <ul>
      <li>Termindaten (Ersteller (mit Google Id und Namen), frühere Eigentümer (ebenfalls mit Google Id und Namen), Titel, Preis, Beginn, Dauer, Region, Kategorie etc.)</li>
      <li>Profildaten der Dienstleister (GoogleId, Name, E-Mail, Telefon, Hauptsitz)</li>
      <li>Kommentare und Bewertungen mit den jeweiligen Namen und GoogleIds der Nutzer</li>
    </ul>
    <p>Die Daten werden ausschließlich zur Erbringung unserer Dienste verwendet und nicht an Dritte weitergegeben, außer wenn dies zur Vertragserfüllung notwendig ist.</p>
    <h3>5. Ihre Rechte</h3>
    <p>Sie haben jederzeit diese Rechte:</p>
    <ul>
      <li>Auskunft über Ihre gespeicherten Daten</li>
      <li>Berichtigung unrichtiger Daten</li>
      <li>Löschung Ihrer Daten</li>
      <li>Datenübertragbarkeit</li>
      <li>Widerspruch gegen die Datenverarbeitung</li>
    </ul>
  </div>

  <!-- Impressum -->
  <div v-if="activeTab === 'impressum'" class="legal-content">
    <h2>Impressum</h2>
    
    <h3>Angaben gemäß § 5 TMG</h3>
    <p>
      Andreas Hofstetter Einzelkaufmann<br>
      Alfred Delp Straße <br>
      [PLZ und Ort]<br>
      Deutschland
    </p>
    
    <h3>Kontakt</h3>
    <p>
      Telefon: 01743902112<br>
      E-Mail: andreashofstetter12@gmail.com
    </p>
    
    <h3>Kleinunternehmerregelung</h3>
    <p>Kleinunternehmer im Sinne von § 19 Abs. 1 UStG.<br>
    Es wird keine Umsatzsteuer ausgewiesen.</p>
    
    <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
    <p>
      Andreas Hofstetter<br>
      [Adresse wie oben]
    </p>
    
    <h3>Streitschlichtung</h3>
    <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
    <a href="https://ec.europa.eu/consumers/odr/" target="_blank">https://ec.europa.eu/consumers/odr/</a></p>
    <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
    <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
  </div>


</template>

<script>
export default {
  name: 'RechtlichesView',
  data() {
    return {
      activeTab: 'agb'
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    }
  }
}
</script>