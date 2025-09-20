<template>
  <nav class="navbar glass-navbar" :class="{ 'navbar-scrolled': isScrolled }" ref="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="navbar-logo" ref="logo">
        <router-link to="/" class="logo-link">
          <span class="logo-text">Vietnam</span>
          <span class="logo-accent">Guide</span>
        </router-link>
      </div>

      <!-- Desktop Menu -->
      <div class="navbar-menu desktop-menu" ref="desktopMenu">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name"
          :to="item.path" 
          class="navbar-link glass-link"
          :class="{ 'active': $route.path === item.path }"
        >
          {{ t(item.label) }}
        </router-link>
      </div>

      <!-- Language Switcher & Mobile Toggle -->
      <div class="navbar-actions" ref="navbarActions">
        <!-- Language Switcher with Flags -->
        <div class="language-switcher glass-switcher" ref="languageSwitcher">
          <div class="current-language" @click="toggleLanguageDropdown">
            <img 
              :src="currentLanguage.flag" 
              :alt="currentLanguage.name"
              class="flag-icon"
            />
            <span class="language-name">{{ currentLanguage.code.toUpperCase() }}</span>
            <svg 
              class="dropdown-arrow" 
              :class="{ 'rotated': isLanguageDropdownOpen }"
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
            >
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>
          
          <div class="language-dropdown glass-dropdown" :class="{ 'active': isLanguageDropdownOpen }">
            <button 
              v-for="lang in languages" 
              :key="lang.code"
              @click="switchLanguage(lang.code)"
              class="language-option glass-option"
              :class="{ 'active': locale === lang.code }"
            >
              <img :src="lang.flag" :alt="lang.name" class="flag-icon" />
              <span class="language-name">{{ lang.name }}</span>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button 
          class="mobile-toggle glass-button"
          @click="toggleMobileMenu"
          :class="{ 'active': isMobileMenuOpen }"
          ref="mobileToggle"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu glass-mobile-menu" :class="{ 'active': isMobileMenuOpen }" ref="mobileMenu">
      <div class="mobile-menu-content">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name"
          :to="item.path" 
          class="mobile-link glass-mobile-link"
          @click="closeMobileMenu"
        >
          {{ t(item.label) }}
        </router-link>
      </div>
    </div>

    <!-- Click outside overlay -->
    <div 
      v-if="isLanguageDropdownOpen || isMobileMenuOpen" 
      class="navbar-overlay"
      @click="closeAllDropdowns"
    ></div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'

export default {
  name: 'NavBar',
  setup() {
    const { locale, t } = useI18n()
    
    // Refs
    const navbar = ref(null)
    const logo = ref(null)
    const desktopMenu = ref(null)
    const navbarActions = ref(null)
    const languageSwitcher = ref(null)
    const mobileToggle = ref(null)
    const mobileMenu = ref(null)
    
    // State
    const isScrolled = ref(false)
    const isMobileMenuOpen = ref(false)
    const isLanguageDropdownOpen = ref(false)

    const menuItems = [
      { name: 'home', path: '/', label: 'nav.home' },
      { name: 'attractions', path: '/attractions', label: 'nav.attractions' },
      { name: 'places-to-eat', path: '/places-to-eat', label: 'nav.placesToEat' }
    ]

    const languages = [
      { 
        code: 'en', 
        name: 'English', 
        flag: '/uk_flag.svg'
      },
      { 
        code: 'lt', 
        name: 'Lietuvių', 
        flag: '/lithuania_flag.svg'
      }
    ]

    const currentLanguage = computed(() => {
      return languages.find(lang => lang.code === locale.value) || languages[0]
    })

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }

    const switchLanguage = (langCode) => {
      locale.value = langCode
      localStorage.setItem('language', langCode)
      closeAllDropdowns()
      
      // Animate language switch
      gsap.fromTo(navbar.value, 
        { scale: 0.98, filter: 'blur(2px)' }, 
        { scale: 1, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out' }
      )
    }

    const toggleLanguageDropdown = () => {
      isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
      isMobileMenuOpen.value = false
    }

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
      isLanguageDropdownOpen.value = false
      
      if (isMobileMenuOpen.value) {
        gsap.fromTo(mobileMenu.value, 
          { opacity: 0, y: -20, filter: 'blur(10px)' }, 
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out' }
        )
      }
    }

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }

    const closeAllDropdowns = () => {
      isLanguageDropdownOpen.value = false
      isMobileMenuOpen.value = false
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      
      // Enhanced navbar entrance animation
      const tl = gsap.timeline()
      
      tl.fromTo(navbar.value, 
        { y: -100, opacity: 0, filter: 'blur(10px)' }, 
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
      )
      .fromTo(logo.value, 
        { x: -50, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5'
      )
      .fromTo(desktopMenu.value.children, 
        { y: -30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.6'
      )
      .fromTo(navbarActions.value, 
        { x: 50, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.8'
      )
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      navbar,
      logo,
      desktopMenu,
      navbarActions,
      languageSwitcher,
      mobileToggle,
      mobileMenu,
      isScrolled,
      isMobileMenuOpen,
      isLanguageDropdownOpen,
      menuItems,
      languages,
      currentLanguage,
      locale,
      switchLanguage,
      toggleLanguageDropdown,
      toggleMobileMenu,
      closeMobileMenu,
      closeAllDropdowns,
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
  z-index: 2000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-navbar {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
}

.navbar-scrolled {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.navbar-logo {
  font-size: 1.75rem;
  font-weight: 800;
  z-index: 10;
}

.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-text {
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
}

.logo-accent {
  background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.glass-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.glass-link.active {
  color: #ffffff;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.glass-switcher {
  position: relative;
}

.current-language {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.current-language:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

.flag-icon {
  width: 24px;
  height: 16px;
  border-radius: 4px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.language-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.glass-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 180px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.glass-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.glass-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.glass-option:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.glass-option.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
  color: #ffffff;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  cursor: pointer;
  padding: 6px;
  transition: all 0.3s ease;
}

.mobile-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.mobile-toggle span {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.glass-mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-mobile-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.mobile-menu-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.glass-mobile-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 1rem 1.5rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  text-align: center;
}

.glass-mobile-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateX(10px);
}

.navbar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1500;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
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

  .glass-mobile-menu {
    display: block;
  }

  .language-switcher {
    order: -1;
  }

  .current-language {
    padding: 0.5rem 1rem;
  }

  .flag-icon {
    width: 20px;
    height: 14px;
  }

  .language-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    height: 70px;
  }

  .navbar-logo {
    font-size: 1.5rem;
  }

  .mobile-menu-content {
    padding: 1.5rem;
  }

  .glass-mobile-link {
    font-size: 1rem;
    padding: 0.875rem 1.25rem;
  }
}
</style>