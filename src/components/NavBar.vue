<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="navbar-logo">
        <router-link to="/" class="logo-link">
          <span class="logo-text">Vietnam</span>
          <span class="logo-accent">Guide</span>
        </router-link>
      </div>

      <!-- Desktop Menu -->
      <div class="navbar-menu desktop-menu">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name"
          :to="item.path" 
          class="navbar-link"
          :class="{ 'active': $route.path === item.path }"
        >
          {{ t(item.label) }}
        </router-link>
      </div>

      <!-- Language Switcher & Mobile Toggle -->
      <div class="navbar-actions">
        <!-- Language Switcher -->
        <div class="language-switcher">
          <button 
            v-for="lang in languages" 
            :key="lang.code"
            @click="switchLanguage(lang.code)"
            class="lang-btn"
            :class="{ 'active': locale === lang.code }"
            :title="lang.name"
          >
            <span class="flag">{{ lang.flag }}</span>
          </button>
        </div>

        <!-- Mobile Menu Toggle -->
        <button 
          class="mobile-toggle"
          @click="toggleMobileMenu"
          :class="{ 'active': isMobileMenuOpen }"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
      <div class="mobile-menu-content">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name"
          :to="item.path" 
          class="mobile-link"
          @click="closeMobileMenu"
        >
          {{ t(item.label) }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'

export default {
  name: 'NavBar',
  setup() {
    const { locale, t } = useI18n()
    const isScrolled = ref(false)
    const isMobileMenuOpen = ref(false)

    const menuItems = [
      { name: 'home', path: '/', label: 'nav.home' },
      { name: 'attractions', path: '/attractions', label: 'nav.attractions' },
      { name: 'places-to-eat', path: '/places-to-eat', label: 'nav.placesToEat' }
    ]

    const languages = [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' }
    ]

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }

    const switchLanguage = (langCode) => {
      locale.value = langCode
      localStorage.setItem('language', langCode)
      
      // Animate language switch
      gsap.fromTo('.navbar', 
        { scale: 0.98 }, 
        { scale: 1, duration: 0.3, ease: 'power2.out' }
      )
    }

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
      
      if (isMobileMenuOpen.value) {
        gsap.fromTo('.mobile-menu', 
          { opacity: 0, y: -20 }, 
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        )
      }
    }

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      
      // Initial navbar animation
      gsap.fromTo('.navbar', 
        { y: -100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      isScrolled,
      isMobileMenuOpen,
      menuItems,
      languages,
      locale,
      switchLanguage,
      toggleMobileMenu,
      closeMobileMenu,
      t
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.navbar-scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.logo-text {
  color: var(--primary-color);
}

.logo-accent {
  color: var(--secondary-color);
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar-link {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  transition: all 0.3s ease;
}

.navbar-link:hover {
  color: var(--primary-color);
}

.navbar-link.active {
  color: var(--primary-color);
}

.navbar-link::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  transition: width 0.3s ease;
}

.navbar-link:hover::after,
.navbar-link.active::after {
  width: 100%;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  background: none;
  border: 2px solid transparent;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.lang-btn:hover {
  border-color: var(--primary-color);
  transform: scale(1.1);
}

.lang-btn.active {
  border-color: var(--primary-color);
  background: rgba(37, 99, 235, 0.1);
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.mobile-toggle span {
  width: 100%;
  height: 3px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.mobile-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.mobile-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
}

.mobile-menu.active {
  opacity: 1;
  transform: translateY(0);
}

.mobile-menu-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-link {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.mobile-link:hover {
  color: var(--primary-color);
  padding-left: 1rem;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 1rem;
  }

  .desktop-menu {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }
}
</style>