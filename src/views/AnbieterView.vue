<!-- Geschrieben von claude -->
<template>
    <!-- Loading Anbieter Data -->
    <div v-if="loading" class="loading">
        Lade Anbieter-Daten...
    </div>
    <!-- Error State -->
    <div v-if="error" class="error">
        {{ error }}
        <button @click="retry" class="btn-retry">Erneut versuchen</button>
    </div>
    <!-- Anbieter Content -->
    <div class="anbieter" v-if="anbieter && !loading">
        <h2>{{ anbieter.name }}</h2>
        <div>Id: {{ anbieterId }}</div>
        <div>Hauptsitz: {{ anbieter.hauptsitz }}</div>
        <div>Email: {{ anbieter.email }}</div>
        <div>Telefonnummer: {{ anbieter.telefon }}</div>  
        <br>  
        <!-- Comment Section -->
        <div class="comment-section">
            <!-- Auth Checking -->
            <div v-if="authChecking" class="loading">
                Prüfe Login-Status...
            </div>            
            <!-- Not Logged In -->
            <div v-else-if="!loggedIn" class="login-prompt">
                <button class="btn-login" @click="handleLogin" :disabled="loggingIn">
                    {{ loggingIn ? 'Wird eingeloggt...' : 'Zum Kommentieren einloggen' }}
                </button>
            </div>            
            <!-- Logged In - Comment Form -->
            <div v-else class="comment-form">
                <input 
                    v-model="comment" 
                    placeholder="Hier Kommentieren"
                    @keyup.enter="submitComment"
                >
                <button 
                    class="btn" 
                    @click="submitComment"
                    :disabled="!comment || commenting"
                >
                    {{ commenting ? 'Sendet...' : 'Senden' }}
                </button>
            </div>
        </div>        
        <!-- Comments Display -->
        <div class="commentContainer">
            <Comment v-for="(c,ckey) in anbieter.comments" :key="ckey" :comment="c"/>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { commentAnbieter, getAnbieter, login } from '@/main';
import Comment from '@/components/Comment.vue';

export default {
    name: 'AnbieterView',
    components: { Comment },
    data() {
        return {
            // Data States
            anbieter: null,
            anbieterId: null,
            loading: true,
            error: null,
            
            // Auth States
            authChecking: true,
            loggedIn: false,
            loggingIn: false,
            
            // Comment States
            comment: '',
            commenting: false
        }
    },
    mounted() {
        this.initAuthListener();
        this.loadAnbieter();
    },
    methods: {
        initAuthListener() {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                this.authChecking = false;
                this.loggedIn = !!user;
                this.loggingIn = false;
            });
        },

        async loadAnbieter() {
            try {
                this.loading = true;
                this.error = null;
                this.anbieterId = this.$route.params.anbieterId;
                
                const anbieterData = await getAnbieter(this.anbieterId);
                if (!anbieterData) {
                    throw new Error('Anbieter nicht gefunden');
                }
                this.anbieter = anbieterData;
            } catch (error) {
                console.error('Error loading anbieter:', error);
                this.error = 'Fehler beim Laden der Anbieter-Daten';
            } finally {
                this.loading = false;
            }
        },

        async handleLogin() {
            try {
                this.loggingIn = true;
                await login();
            } catch (error) {
                console.error('Login error:', error);
                alert('Login fehlgeschlagen');
                this.loggingIn = false;
            }
        },

        async submitComment() {
            if (!this.comment.trim()) return;
            try {
                this.commenting = true;
                if(this.comment.length > 500) {
                    alert('Kommentar zu lang (max. 500 Zeichen)');
                    return;
                }
                await commentAnbieter(this.anbieterId, this.comment);
                this.comment = '';
                // Reload anbieter to show new comment
                await this.loadAnbieter();
            } catch (error) {
                console.error('Comment error:', error);
                alert('Kommentar konnte nicht gespeichert werden');
            } finally {
                this.commenting = false;
            }
        },

        retry() {
            this.loadAnbieter();
        }
    },
    
    watch: {
        '$route'() {
            this.loadAnbieter();
        }
    }
}
</script>

<style scoped>
.comment-section {
    margin: 1rem 0;
    padding: 1rem;
    background: var(--surface);
    border-radius: var(--card-radius);
    border: 1px solid var(--soft-border);
}

.comment-form {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.comment-form input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--soft-border);
    border-radius: 6px;
}

.login-prompt {
    text-align: center;
}
</style>