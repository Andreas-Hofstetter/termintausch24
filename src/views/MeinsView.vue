<template>
<!-- eslint-disable -->
  <div class="cnt">
    <div class="modeSwitch" role="tablist" aria-label="Gekauft oder Verkauft">
      <button role="tab" @click="toggleMode(true)" :class="{modeChosen: showGekauft}">Gekauft</button>
      <button role="tab" @click="toggleMode(false)" :class="{modeChosen: !showGekauft}">Verkauft</button>
    </div>
  </div>

  <!-- GEKAUFT VIEW -->
  <div v-if="showGekauft">
    <!-- INITIAL LOADING: Firebase prüft noch Auth Status -->
    <div v-if="authChecking" class="loading">
      <div>Prüfe Login-Status...</div>
    </div>

    <!-- USER NICHT EINGELOGGT -->
    <div v-else-if="!loggedIn">
      <div>Nicht eingeloggt!</div>
      <div class="modeChosen filtern" @click="handleLogin" :disabled="loggingIn">
        {{ loggingIn ? 'Wird eingeloggt...' : 'Login' }}
      </div>
    </div>

    <!-- USER EINGELOGGT -->
    <div v-else>
      <h3>Sie haben gekauft:</h3>
      
      <!-- Loading Gekaufte Items -->
      <div v-if="loadingGekauft" class="loading">
        Lade Ihre gekauften Termine...
      </div>
      
      <!-- Error State -->
      <div v-if="errorGekauft" class="error">
        {{ errorGekauft }}
        <div class="modeChosen filtern" @click="retryGekauft">Erneut versuchen</div>
      </div>
      
      <!-- Empty State -->
      <div v-if="!loadingGekauft && !errorGekauft && gekaufteAngebote.length === 0">
        Bisher nichts gekauft.
      </div>
      
      <!-- Content -->
      <div v-if="!loadingGekauft && !errorGekauft && gekaufteAngebote.length > 0" class="angeboteContainer">
        <Contract 
          v-for="angebot in gekaufteAngebote" 
          :key="angebot.id" 
          :a="angebot" 
          :inView="1" 
          :uid="userId"
        />
      </div>
    </div>
  </div>

  <!-- VERKAUFT VIEW -->
  <div v-if="!showGekauft">
    <!-- INITIAL LOADING: Firebase prüft noch Auth Status -->
    <div v-if="authChecking" class="loading">
      <div>Prüfe Login-Status...</div>
    </div>

    <!-- USER NICHT EINGELOGGT -->
    <div v-else-if="!loggedIn">
      <div>Nicht eingeloggt!</div>
      <div class="modeChosen filtern" @click="handleLogin" :disabled="loggingIn">
        {{ loggingIn ? 'Wird eingeloggt...' : 'Login' }}
      </div>
    </div>

    <!-- USER EINGELOGGT -->
    <div v-else>
      <!-- Loading Verkaufte Items -->
      <div v-if="loadingVerkauft" class="loading">
        Lade Ihre verkauften Termine...
      </div>
      
      <!-- Error State -->
      <div v-if="errorVerkauft" class="error">
        {{ errorVerkauft }}
        <button @click="retryVerkauft" class="btn-retry">Erneut versuchen</button>
      </div>
      
      <!-- Content -->
      <div v-if="!loadingVerkauft && !errorVerkauft">
        <h3>Erstellte Angebote (mit aktuellen Preisen):</h3>
        <div v-if="createdAngebote.length === 0" class="empty-subsection">Keine Angebote erstellt</div>
        <div v-else class="angeboteContainer">
          <Contract v-for="(a,key) in createdAngebote" :key="key" :a="a" :inView="2" />
        </div>
        
        <h3>Wieder angebotene Termine:</h3>
        <div v-if="resoldAngebote.length === 0" class="empty-subsection">Keine Angebote weiterverkauft</div>
        <div v-else class="angeboteContainer">
          <Contract v-for="(a,key) in resoldAngebote" :key="key" :a="a" :inView="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { subscribeToWarenkorb, login, getVerkauft1, getVerkauft2 } from "@/main";
import Contract from "@/components/Contract.vue";

export default {
  name: 'MeinsView',
  components: {
    Contract
  },
  data() {
    return {
      // Mode Toggle
      showGekauft: true,
      
      // Auth States
      authChecking: true,
      loggedIn: false,
      loggingIn: false,
      userId: null,
      
      // Gekauft States
      gekaufteAngebote: [],
      loadingGekauft: false,
      errorGekauft: null,
      unsubscribeWarenkorb: null,
      
      // Verkauft States
      createdAngebote: [],
      resoldAngebote: [],
      loadingVerkauft: false,
      errorVerkauft: null
    }
  },
  mounted() {
    this.initAuthListener();
  },
  beforeUnmount() {
    this.cleanupSubscriptions();
  },
  methods: {
    toggleMode(showGekauft) {
      this.showGekauft = showGekauft;
      
      // Daten laden wenn zu jeweiligem Tab gewechselt wird
      if (this.loggedIn) {
        if (showGekauft && this.gekaufteAngebote.length === 0) {
          this.setupWarenkorbSubscription();
        } else if (!showGekauft && this.createdAngebote.length === 0 && this.resoldAngebote.length === 0) {
          this.loadVerkauftData();
        }
      }
    },

    initAuthListener() {
      const auth = getAuth();
      
      onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed:", user ? "logged in" : "logged out");
        
        this.authChecking = false;
        
        if (user) {
          this.loggedIn = true;
          this.userId = user.uid;
          this.loggingIn = false;
          
          // Initial data loading basierend auf aktuellem Tab
          if (this.showGekauft) {
            this.setupWarenkorbSubscription();
          } else {
            this.loadVerkauftData();
          }
        } else {
          this.loggedIn = false;
          this.userId = null;
          this.loggingIn = false;
          this.resetData();
        }
      });
    },

    resetData() {
      this.gekaufteAngebote = [];
      this.createdAngebote = [];
      this.resoldAngebote = [];
      this.cleanupSubscriptions();
    },

    // GEKAUFT METHODS
    setupWarenkorbSubscription() {
      this.cleanupSubscriptions();
      
      this.loadingGekauft = true;
      this.errorGekauft = null;

      console.log("Setting up subscription for user:", this.userId);

      this.unsubscribeWarenkorb = subscribeToWarenkorb(
        this.userId,
        (angebote) => {
          console.log("Warenkorb callback received:", angebote.length, "items");
          this.gekaufteAngebote = angebote;
          this.loadingGekauft = false;
          this.errorGekauft = null;
        }
      );
    },

    cleanupSubscriptions() {
      if (this.unsubscribeWarenkorb) {
        console.log("Cleaning up subscription");
        this.unsubscribeWarenkorb();
        this.unsubscribeWarenkorb = null;
      }
    },

    retryGekauft() {
      if (this.userId) {
        this.setupWarenkorbSubscription();
      }
    },

    // VERKAUFT METHODS
    async loadVerkauftData() {
      if (!this.userId) return;
      
      this.loadingVerkauft = true;
      this.errorVerkauft = null;
      
      try {
        const [created, resold] = await Promise.all([
          getVerkauft1(),
          getVerkauft2()
        ]);
        
        this.createdAngebote = created || [];
        this.resoldAngebote = resold || [];
      } catch (error) {
        console.error("Error loading verkauft data:", error);
        this.errorVerkauft = "Fehler beim Laden der Verkaufsdaten";
      } finally {
        this.loadingVerkauft = false;
      }
    },

    retryVerkauft() {
      this.loadVerkauftData();
    },

    // SHARED METHODS
    async handleLogin() {
      try {
        this.loggingIn = true;
        this.errorGekauft = null;
        this.errorVerkauft = null;       
        console.log("Starting login process...");
        await login();
      } catch (error) {
        console.error("Login error:", error);
        const errorMsg = "Login fehlgeschlagen: " + error.message;
        this.errorGekauft = errorMsg;
        this.errorVerkauft = errorMsg;
        this.loggingIn = false;
      }
    }
  }
}
</script>

