<template>
  <div class="profile-component">
    <!-- Pure Profile Form -->
    <div v-if="loading" class="loading">Lade Profil...</div>
    <div v-else class="profile-form">
      

      <div>
        <label>Name: <span class="required">*</span></label>
        <input v-model="profileData.name" :readonly="readonly" placeholder="Ihr Name" />
      </div>

      <div>
        <label>Email: <span class="required">*</span></label>
        <input v-model="profileData.email" type="email" :readonly="readonly" placeholder="ihre@email.com" />
      </div>

      <div>
        <label>Hauptsitz: <span class="required">*</span></label>
        <input v-model="profileData.hauptsitz" :readonly="readonly" placeholder="Stadt/Region" />
      </div>

      <div>
        <label>Telefon: <span class="required">*</span></label>
        <input v-model="profileData.telefon" type="tel" :readonly="readonly" placeholder="+49 123 456789" />
      </div>
      <div>
        <label>Verifiziert:</label>
        <div class="verified-status">
          <span v-if="this.verified">Verifiziert <CheckCircle class="verified-icon" />
          </span>
          <span v-else>Nicht verifiziert <XCircle class="verified-icon" /></span>
        </div>
      </div>

      <div v-if="!readonly" class="form-actions">
        <button @click="saveProfile" class="btn" :disabled="!isComplete">
          Profil speichern
        </button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
      
    </div>
  </div>
</template>

<script>
import { getProfil, writeProfil } from '@/main';
import { getAuth } from "firebase/auth";
import { CheckCircle, XCircle } from 'lucide-vue-next';

export default {
  name: 'ProfileComponent',
  props: {
    readonly: { type: Boolean, default: false },        // Nur anzeigen
    showCancel: { type: Boolean, default: true }        // Abbrechen Button
  },
  components: {
    CheckCircle,
    XCircle
  },
  
  emits: ['saved', 'cancelled'],
  data() {
    return {
      loading:true,
      error: null,
      user: null,
      verified:false,
      profileData: {
        name: '',
        email: '',
        hauptsitz: '',
        telefon: ''
      }
    }
  },
  computed: {
    userId() {
      return this.user?.uid || null;
    },
    isComplete() {
      return Object.values(this.profileData).every(value => 
        value && value.toString().trim() !== ''
      );
    }
  },
  async mounted() {
    await this.initUser();
    await this.loadProfile();
  },
  methods: {
    async initUser() {
      const auth = getAuth();
      this.user = auth.currentUser;
      if (!this.user) {
        this.error = "Kein User gefunden! Bitte neu einloggen!";
      }
    },

    async loadProfile() {
      if (!this.user?.uid) return;
      
      this.error = null;
      // await new Promise(resolve => setTimeout(resolve, 400));
      

      try {
        const savedProfile = await getProfil(this.user.uid);
        this.loading = false;
        if (savedProfile) {
          this.profileData = {
            name: savedProfile.name,
            email: savedProfile.email,
            hauptsitz: savedProfile.hauptsitz,
            telefon: savedProfile.telefon,
            
          };
          console.log(savedProfile.verified)
          this.verified= savedProfile.verified 
        }
      } catch (e) {
        console.error('Fehler beim Laden des Profils:', e);
        this.error = 'Fehler beim Laden des Profils';
      } finally {
      }
    },

    async saveProfile() {
      if (!this.user?.uid) {
        this.error = "Kein User gefunden!";
        return;
      }

      if (!this.isComplete) {
        this.error = "Bitte füllen Sie alle Felder aus!";
        return;
      }

      this.error = null;

      try {
        await writeProfil(this.user.uid, this.profileData);
        this.$emit('saved', { ...this.profileData });
        this.error = null;
        alert('Profil erfolgreich gespeichert!');
      } catch (e) {
        console.error('Fehler beim Speichern:', e);
        this.error = 'Fehler beim Speichern des Profils';
      } finally {
      }
    },

    cancel() {
      this.loadProfile(); // Reset
      this.$emit('cancelled');
    },

    isProfileComplete() {
      return this.isComplete;
    },

    getValidationError() {
      return this.isComplete ? null : "Profil unvollständig!";
    }
  }
}
</script>

<style scoped>
.profile-form {
  background: var(--bg);
  border: 1px solid var(--soft-border);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-form > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.profile-form label {
  font-weight: 600;
  font-size: 0.9rem;
}

.profile-form input {
  padding: 6px 8px;
  border: 1px solid var(--soft-border);
  border-radius: 6px;
  background: #fafafa;
}

.profile-form input:focus {
  border-color: var(--primary);
  background: white;
}

.required {
  color: var(--accent-danger);
}
.verified-status {
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>