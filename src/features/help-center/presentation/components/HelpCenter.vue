<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="help-overlay" @click.self="close">
        <div class="help-modal">
          <header class="help-modal__header">
            <div class="help-modal__header-left">
              <font-awesome-icon icon="circle-question" class="help-modal__header-icon" />
              <h2>{{ t('helpCenter.title') }}</h2>
            </div>
            <button
              class="help-modal__close"
              :aria-label="t('helpCenter.close')"
              @click="close"
            >
              <font-awesome-icon icon="xmark" />
            </button>
          </header>

          <div class="help-modal__body">
            <section class="help-section">
              <h3 class="help-section__title">
                <font-awesome-icon icon="headset" class="help-section__icon" />
                {{ t('helpCenter.contact.title') }}
              </h3>
              <div class="contact-grid">
                <a
                  :href="contactChannels.whatsapp.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="contact-card"
                >
                  <div class="contact-card__icon contact-card__icon--whatsapp">
                    <font-awesome-icon :icon="['fab', 'whatsapp']" />
                  </div>
                  <div class="contact-card__info">
                    <span class="contact-card__title">{{ t('helpCenter.contact.whatsapp') }}</span>
                    <span class="contact-card__desc">{{ t('helpCenter.contact.whatsappDesc') }}</span>
                  </div>
                  <font-awesome-icon icon="arrow-up-right-from-square" class="contact-card__arrow" />
                </a>

                <a
                  :href="contactChannels.email.link"
                  class="contact-card"
                >
                  <div class="contact-card__icon contact-card__icon--email">
                    <font-awesome-icon icon="envelope" />
                  </div>
                  <div class="contact-card__info">
                    <span class="contact-card__title">{{ t('helpCenter.contact.email') }}</span>
                    <span class="contact-card__desc">{{ t('helpCenter.contact.emailDesc') }}</span>
                  </div>
                  <font-awesome-icon icon="arrow-up-right-from-square" class="contact-card__arrow" />
                </a>

                <a
                  :href="contactChannels.phone.link"
                  class="contact-card"
                >
                  <div class="contact-card__icon contact-card__icon--phone">
                    <font-awesome-icon icon="phone" />
                  </div>
                  <div class="contact-card__info">
                    <span class="contact-card__title">{{ t('helpCenter.contact.phone') }}</span>
                    <span class="contact-card__desc">{{ t('helpCenter.contact.phoneDesc') }}</span>
                  </div>
                  <font-awesome-icon icon="arrow-up-right-from-square" class="contact-card__arrow" />
                </a>
              </div>
            </section>

            <section class="help-section">
              <h3 class="help-section__title">
                <font-awesome-icon icon="circle-info" class="help-section__icon" />
                {{ t('helpCenter.faq.title') }}
              </h3>
              <div class="faq-card">
                <div class="faq-card__content">
                  <span class="faq-card__title">{{ t('helpCenter.faq.cardTitle') }}</span>
                  <p class="faq-card__desc">{{ t('helpCenter.faq.cardDesc') }}</p>
                </div>
                <a
                  :href="FAQ_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="faq-card__btn"
                >
                  <font-awesome-icon icon="arrow-up-right-from-square" />
                  <span>{{ t('helpCenter.faq.action') }}</span>
                </a>
              </div>
            </section>

            <section class="help-section">
              <h3 class="help-section__title">
                <font-awesome-icon icon="flag" class="help-section__icon" />
                {{ t('helpCenter.report.title') }}
              </h3>

              <form v-if="!reportSent" class="report-form" @submit.prevent="submitReport">
                <div class="report-form__field">
                  <label for="report-subject">{{ t('helpCenter.report.subject') }}</label>
                  <input
                    id="report-subject"
                    v-model="report.subject"
                    type="text"
                    :placeholder="t('helpCenter.report.subjectPlaceholder')"
                    required
                  />
                </div>
                <div class="report-form__field">
                  <label for="report-description">{{ t('helpCenter.report.description') }}</label>
                  <textarea
                    id="report-description"
                    v-model="report.description"
                    :placeholder="t('helpCenter.report.descriptionPlaceholder')"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button type="submit" class="report-form__submit" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="btn-spinner" />
                  {{ isSubmitting ? t('helpCenter.report.sending') : t('helpCenter.report.submit') }}
                </button>
              </form>

              <div v-else class="report-success">
                <font-awesome-icon icon="circle-check" class="report-success__icon" />
                <span class="report-success__title">{{ t('helpCenter.report.successTitle') }}</span>
                <p class="report-success__desc">{{ t('helpCenter.report.successDesc') }}</p>
                <button class="report-success__btn" @click="resetReport">
                  {{ t('helpCenter.report.newReport') }}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useI18n } from '@/shared/presentation/i18n';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);
const { t } = useI18n();

const FAQ_URL = 'https://upc-202610-1asi0572-6779-nexiot.github.io/nexora.website/faq.html';

const contactChannels = {
  whatsapp: {
    link: 'https://wa.me/51999999999?text=Hola%2C%20necesito%20ayuda%20con%20Nexora'
  },
  email: {
    link: 'mailto:soporte@nexora.com'
  },
  phone: {
    link: 'tel:+51999999999'
  }
};

const report = reactive({
  subject: '',
  description: ''
});

const isSubmitting = ref(false);
const reportSent = ref(false);

function close() {
  emit('close');
}

function submitReport() {
  if (!report.subject.trim() || !report.description.trim()) return;

  isSubmitting.value = true;

  setTimeout(() => {
    isSubmitting.value = false;
    reportSent.value = true;
  }, 1200);
}

function resetReport() {
  report.subject = '';
  report.description = '';
  reportSent.value = false;
}
</script>

<style scoped>
.help-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.help-modal {
  background: #ffffff;
  border-radius: 16px;
  width: 600px;
  max-width: 100%;
  max-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.help-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid #eef2f6;
  flex-shrink: 0;
}

.help-modal__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.help-modal__header-icon {
  font-size: 1.4rem;
  color: var(--primary-color);
}

.help-modal__header h2 {
  font-size: 1.3rem;
  margin: 0;
  color: #0a1e4b;
}

.help-modal__close {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #7f8fa6;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.help-modal__close:hover {
  background: #f1f3f5;
  color: #1a1a2e;
}

.help-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.help-section__title {
  font-size: 1rem;
  color: #0a1e4b;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.help-section__icon {
  color: var(--primary-color);
  font-size: 1rem;
}

.contact-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1.5px solid #eef2f6;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.contact-card:hover {
  border-color: #d0d7e2;
  background: #fafbfc;
}

.contact-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.contact-card__icon--whatsapp {
  background: #e8f5e9;
  color: #25d366;
}

.contact-card__icon--email {
  background: #fef3e2;
  color: var(--primary-color);
}

.contact-card__icon--phone {
  background: #e8f0fe;
  color: var(--secondary-color);
}

.contact-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-card__title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1a2a3c;
}

.contact-card__desc {
  font-size: 0.78rem;
  color: #7f8fa6;
}

.contact-card__arrow {
  font-size: 0.75rem;
  color: #c0c8d4;
  flex-shrink: 0;
  transition: color 0.2s;
}

.contact-card:hover .contact-card__arrow {
  color: #7f8fa6;
}

.faq-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: #f8fafc;
  border: 1.5px solid #eef2f6;
  border-radius: 12px;
}

.faq-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.faq-card__title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1a2a3c;
}

.faq-card__desc {
  font-size: 0.8rem;
  color: #7f8fa6;
  margin: 0;
  line-height: 1.4;
}

.faq-card__btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--primary-color);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.82rem;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: filter 0.2s;
  font-family: inherit;
}

.faq-card__btn:hover {
  filter: brightness(1.1);
}

.report-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.report-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.report-form__field label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #5a6a7c;
}

.report-form__field input,
.report-form__field textarea {
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s;
  resize: vertical;
}

.report-form__field input:focus,
.report-form__field textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.report-form__field input::placeholder,
.report-form__field textarea::placeholder {
  color: #aab4c2;
}

.report-form__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 24px;
  background: var(--primary-color);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: filter 0.2s;
  font-family: inherit;
  align-self: flex-start;
}

.report-form__submit:hover {
  filter: brightness(1.1);
}

.report-form__submit:disabled {
  filter: brightness(0.9);
  cursor: not-allowed;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.report-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 20px;
  gap: 8px;
}

.report-success__icon {
  font-size: 2.5rem;
  color: #16a34a;
}

.report-success__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0a1e4b;
}

.report-success__desc {
  font-size: 0.85rem;
  color: #7f8fa6;
  margin: 0;
  line-height: 1.5;
}

.report-success__btn {
  margin-top: 12px;
  padding: 10px 20px;
  background: transparent;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.report-success__btn:hover {
  border-color: var(--primary-color);
  background: #fff8f0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .help-modal,
.modal-leave-active .help-modal {
  transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .help-modal {
  transform: scale(0.95) translateY(10px);
}

.modal-leave-to .help-modal {
  transform: scale(0.95) translateY(10px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .help-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .help-modal {
    width: 100%;
    max-width: 100%;
    height: 92vh;
    border-radius: 16px 16px 0 0;
  }

  .help-modal__body {
    padding: 20px;
    gap: 24px;
  }

  .faq-card {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .faq-card__btn {
    justify-content: center;
  }

  .report-form__submit {
    width: 100%;
    justify-content: center;
  }
}
</style>
