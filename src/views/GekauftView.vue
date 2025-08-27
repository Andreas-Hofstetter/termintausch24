
<!-- GekauftView.vue - geschrieben von claude -->
<template>
    <!-- INITIAL LOADING: Firebase prüft noch Auth Status -->
    <div v-if="authChecking" class="loading">
        <div>Prüfe Login-Status...</div>
    </div>

    <!-- USER NICHT EINGELOGGT -->
    <div v-else-if="!loggedIn" class="login-prompt">
        <div>Nicht eingeloggt!</div>
        <button class="btn-login" @click="handleLogin" :disabled="loggingIn">
            {{ loggingIn ? 'Wird eingeloggt...' : 'Login' }}
        </button>
    </div>

    <!-- USER EINGELOGGT -->
    <div v-else>
        <h3>Sie haben gekauft:</h3>
        
        <!-- Loading Gekaufte Items -->
        <div v-if="loading" class="loading">
            Lade Ihre gekauften Termine...
        </div>
        
        <!-- Error State -->
        <div v-if="error" class="error">
            {{ error }}
            <button @click="retry" class="btn-retry">Erneut versuchen</button>
        </div>
        
        <!-- Empty State -->
        <div v-if="!loading && !error && angebote.length === 0" class="empty-state">
            Bisher nichts gekauft.
        </div>
        
        <!-- Content -->
        <div v-if="!loading && !error && angebote.length > 0" class="angeboteContainer">
            <Contract 
                v-for="angebot in angebote" 
                :key="angebot.id" 
                :a="angebot" 
                :inView="1" 
                :uid="userId"
            />
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { subscribeToWarenkorb, login } from "../main.js";
import Contract from "@/components/Contract.vue";

export default {
    name: 'GekauftView',
    components: {
        Contract
    },
    data() {
        return {
            // Auth States
            authChecking: true,    // Firebase prüft noch Auth Status
            loggedIn: false,       // User Status bekannt
            loggingIn: false,      // Login Process läuft
            userId: null,
            
            // Data States  
            angebote: [],
            loading: false,        // Daten werden geladen
            error: null,
            
            // Subscription
            unsubscribeWarenkorb: null
        }
    },
    mounted() {
        this.initAuthListener();
    },
    beforeUnmount() {
        this.cleanupSubscriptions();
    },
    methods: {
        initAuthListener() {
            const auth = getAuth();
            
            // Auth State Change Listener - läuft IMMER wenn sich Auth Status ändert
            onAuthStateChanged(auth, (user) => {
                console.log("Auth state changed:", user ? "logged in" : "logged out");
                
                // Auth Status ist jetzt bekannt
                this.authChecking = false;
                
                if (user) {
                    this.loggedIn = true;
                    this.userId = user.uid;
                    this.loggingIn = false;
                    this.setupWarenkorbSubscription();
                } else {
                    this.loggedIn = false;
                    this.userId = null;
                    this.loggingIn = false;
                    this.angebote = [];
                    this.cleanupSubscriptions();
                }
            });
        },

        setupWarenkorbSubscription() {
            // Cleanup alte Subscription
            this.cleanupSubscriptions();
            
            this.loading = true;
            this.error = null;

            console.log("Setting up subscription for user:", this.userId);

            // Realtime Subscription
            this.unsubscribeWarenkorb = subscribeToWarenkorb(
                this.userId,
                (angebote) => {
                    console.log("Warenkorb callback received:", angebote.length, "items");
                    this.angebote = angebote;
                    this.loading = false;
                    this.error = null;
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

        async handleLogin() {
            try {
                this.loggingIn = true;
                this.error = null;
                
                console.log("Starting login process...");
                await login();
                
                // onAuthStateChanged wird automatisch getriggered
                // Kein manuelles Setup nötig
                
            } catch (error) {
                console.error("Login error:", error);
                this.error = "Login fehlgeschlagen: " + error.message;
                this.loggingIn = false;
            }
        },

        retry() {
            if (this.userId) {
                this.setupWarenkorbSubscription();
            } else {
                // Wenn kein User, versuche erneut zu checken
                this.authChecking = true;
                this.initAuthListener();
            }
        }
    }
}
</script>

