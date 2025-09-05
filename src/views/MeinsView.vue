<template>
<!-- eslint-disable -->
  <div class="cnt">
    <div class="modeSwitch" role="tablist" aria-label="Navigation">
      <button role="tab" @click="setActiveTab('gekauft')" :class="{modeChosen: activeTab === 'gekauft'}">Gekauft</button>
      <button role="tab" @click="setActiveTab('verkauft')" :class="{modeChosen: activeTab === 'verkauft'}">Verkauft</button>
      <button role="tab" @click="setActiveTab('profil')" :class="{modeChosen: activeTab === 'profil'}">Dienstleisterprofil</button>
    </div>
  </div>

  <!-- SHARED AUTH CHECKING -->
  <div v-if="authChecking" class="loading">
    <div>Prüfe Login-Status...</div>
  </div>

  <!-- SHARED LOGIN PROMPT -->
  <div v-else-if="!loggedIn">
  <br/>
    <div>Nicht eingeloggt!</div>
    <div class="filtern" @click="handleLogin" :disabled="loggingIn">
      {{ loggingIn ? 'Wird eingeloggt...' : 'Login' }}
    </div>
  </div>

  <!-- CONTENT WHEN LOGGED IN -->
  <div v-else>
    <!-- GEKAUFT CONTENT -->
    <div v-if="activeTab === 'gekauft'">
      <h3>Sie haben gekauft:</h3>
      
      <div v-if="loadingGekauft" class="loading">
        Lade Ihre gekauften Termine...
      </div>
      
      <div v-if="errorGekauft" class="error">
        {{ errorGekauft }}
        <div class="modeChosen filtern" @click="retryGekauft">Erneut versuchen</div>
      </div>
      
      <div v-if="!loadingGekauft && !errorGekauft && gekaufteAngebote.length === 0" class="empty-subsection">
        Bisher nichts gekauft.
      </div>
      
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

    <!-- VERKAUFT CONTENT -->
    <div v-if="activeTab === 'verkauft'">
      <div v-if="loadingVerkauft" class="loading">
        Lade Ihre verkauften Termine...
      </div>
      
      <div v-if="errorVerkauft" class="error">
        {{ errorVerkauft }}
        <button @click="retryVerkauft" class="btn-retry">Erneut versuchen</button>
      </div>
      
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

    <!-- PROFIL CONTENT -->
    <div v-if="activeTab === 'profil'" class="wrapper">
      <h3>Mein Dienstleisterprofil</h3>
      <ProfileComponent @saved="handleProfileSaved" />
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { subscribeToWarenkorb, login, getVerkauft1, getVerkauft2 } from "@/main";
import Contract from "@/components/Contract.vue";
import ProfileComponent from "@/components/Profilform.vue";

export default {
  name: 'MeinsView',
  components: {
    Contract,
    ProfileComponent
  },
  data() {
    return {
      // Tab Control
      activeTab: 'gekauft',
      
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
    setActiveTab(tab) {
      this.activeTab = tab;
      
      // Daten laden wenn zu jeweiligem Tab gewechselt wird
      if (this.loggedIn) {
        if (tab === 'gekauft' && this.gekaufteAngebote.length === 0) {
          this.setupWarenkorbSubscription();
        } else if (tab === 'verkauft' && this.createdAngebote.length === 0 && this.resoldAngebote.length === 0) {
          this.loadVerkauftData();
        }
        // Profil-Tab lädt sich selbst
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
          if (this.activeTab === 'gekauft') {
            this.setupWarenkorbSubscription();
          } else if (this.activeTab === 'verkauft') {
            this.loadVerkauftData();
          }
          // Profil-Tab lädt sich selbst
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

    // PROFIL METHODS
    handleProfileSaved(profileData) {
      console.log('Profil gespeichert:', profileData);
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
<style scoped>
.wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background-color: var(--bg);
}
</style>
