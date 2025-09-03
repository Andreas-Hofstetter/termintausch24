<template>
  <div class="profile-component">
    <!-- Pure Profile Form -->
    <div class="profile-form">
      <div v-if="showUserId && userId" class="form-row">
        <label>Id:</label>
        <input :value="userId" readonly />
      </div>

      <div class="form-row">
        <label>Name: <span class="required">*</span></label>
        <input v-model="profileData.name" :readonly="readonly" placeholder="Ihr Name" />
      </div>

      <div class="form-row">
        <label>Email: <span class="required">*</span></label>
        <input v-model="profileData.email" type="email" :readonly="readonly" placeholder="Ihre@email.com" />
      </div>

      <div class="form-row">
        <label>Hauptsitz: <span class="required">*</span></label>
        <input v-model="profileData.hauptsitz" :readonly="readonly" placeholder="Stadt/Region" />
      </div>

      <div class="form-row">
        <label>Telefon: <span class="required">*</span></label>
        <input v-model="profileData.telefon" type="tel" :readonly="readonly" placeholder="+49 123 456789" />
      </div>

      <div v-if="!readonly" class="form-actions">
        <button @click="saveProfile" class="btn" :disabled="!isComplete">
          Profil speichern
        </button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="loading" class="loading">Speichere...</div>
    </div>
  </div>
</template>

<script>
import { getProfil, writeProfil } from '@/main';
import { getAuth } from "firebase/auth";

export default {
  name: 'ProfileComponent',
  props: {
    readonly: { type: Boolean, default: false },        // Nur anzeigen
    showUserId: { type: Boolean, default: false },      // User ID anzeigen
    showCancel: { type: Boolean, default: true }        // Abbrechen Button
  },
  emits: ['saved', 'cancelled'],
  data() {
    return {
      loading: false,
      error: null,
      user: null,
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
      
      this.loading = true;
      this.error = null;
      
      try {
        const savedProfile = await getProfil(this.user.uid);
        if (savedProfile) {
          this.profileData = {
            name: savedProfile.name || '',
            email: savedProfile.email || '',
            hauptsitz: savedProfile.hauptsitz || '',
            telefon: savedProfile.telefon || ''
          };
        }
      } catch (e) {
        console.error('Fehler beim Laden des Profils:', e);
        this.error = 'Fehler beim Laden des Profils';
      } finally {
        this.loading = false;
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

      this.loading = true;
      this.error = null;

      try {
        await writeProfil(this.user.uid, this.profileData);
        this.$emit('saved', { ...this.profileData });
        this.error = null;
        alert('Profil erfolgreich gespeichert!');
      } catch (e) {
        this.error = 'Fehler beim Speichern des Profils';
      } finally {
        this.loading = false;
      }
    },

    cancel() {
      this.loadProfile(); // Reset
      this.$emit('cancelled');
    },

    // Public API für externe Verwendung
    getProfileData() {
      return { ...this.profileData };
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
</style>