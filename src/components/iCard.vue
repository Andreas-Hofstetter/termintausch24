
<template>
  <div class="infocard">
    <button class="close-btn" @click="$emit('close')" aria-label="close">×</button>

    <header v-if="title" class="card-title">{{ title }}</header>

    <section class="content">
      <p>
        {{ text }}
      </p>
    </section>

    <footer class="card-actions">
      <slot name="actions"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'InfoCard',
  emits: ['close'],
  props: {
    title: { type: String, default: '' },
    text: { type: String, default: '' }
  }
}
</script>

<style scoped>
.infocard {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 6px 18px rgba(2,6,23,0.06);
  color: #0f172a;
}

.card-title{
  font-weight: 700;
  margin: 0 0 6px 0;
  font-size: 1rem;
}

.content{ font-size: 0.95rem; line-height: 1.35; color: #374151; }

.card-actions{
  display:flex;
  gap:8px;
  margin-top:12px;
  justify-content:flex-end;
}

.close-btn{
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: rgba(15,23,42,0.6);
  padding: 4px;
}
.close-btn:hover{ color: rgba(15,23,42,0.95); }

/* make action buttons visually separated when present */
.card-actions ::slotted(button){
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(2,6,23,0.06);
  background: #f8fafc;
  cursor: pointer;
}

</style>