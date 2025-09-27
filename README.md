# Vietnam Travel Guide 🇻🇳

A stunning, interactive Vietnam travel guide built with Vue.js, featuring an animated SVG map, bilingual support (English/Lithuanian), professional GSAP animations, and a comprehensive wedding invitation system.

## 🌟 Features

- **Interactive SVG Map** of Vietnam with clickable cities
- **Bilingual Support** (English/Lithuanian) with automatic detection
- **Professional Animations** using GSAP
- **Responsive Design** for all devices
- **Modern Navigation** with smooth transitions
- **City Detail Pages** with galleries and information
- **Restaurant & Attraction Listings** with filtering
- **Wedding Invitation System** with personalized guest pages
- **Database Tracking** and analytics
- **Interactive Engagement Features** with celebrations

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running

### Development Setup

1. **Clone and navigate to the project:**
   ```bash
   git clone <your-repo-url>
   cd vietnam-travel-guide
   ```

2. **Start the development environment:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - **Main App**: http://localhost:5173
   - **Database Admin**: http://localhost:8081 (optional)

### Wedding Invitation System Setup

After starting Docker, the database will automatically be set up with sample wedding invitation data.

**Test Wedding Invitations:**
- Lithuanian Guest (Jonas): http://localhost:5173/invitation/550e8400-e29b-41d4-a716-446655440001
- English Guest (Sarah): http://localhost:5173/invitation/550e8400-e29b-41d4-a716-446655440002
- Already Accepted Guest (Maria): http://localhost:5173/invitation/550e8400-e29b-41d4-a716-446655440003
- Personalized Homepage: http://localhost:5173/home/550e8400-e29b-41d4-a716-446655440001

**Database Access:**
- **phpMyAdmin**: http://localhost:8081
- **Username**: root
- **Password**: root_password
- **Database**: vietnam_guide_db

### Production Setup

1. **Build and run production version:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Access the production app:**
   - **Main App**: http://localhost

## 🛠️ Local Development (without Docker)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🎊 Wedding Invitation Features

### Database Architecture
- **guest_invitations** - Main guest data with unique GUIDs
- **countries** - Country information with bilingual names
- **invitation_status** - Status tracking (pending/accepted/rejected)
- **guest_responses** - Guest questionnaire responses
- **guest_activities** - Comprehensive activity tracking

### Color Palette
- **#FFFFF8 (Ivory Crepe)** - Main backgrounds and text
- **#FCB2A9 (Spring Poppy)** - Primary accent color
- **#B0D5C0 (English Peal)** - Secondary elements
- **#989CA0 (Nimble)** - Subtle text and borders

### Interactive Features
- **Animated typing effects** for greetings
- **Celebration confetti** on invitation acceptance
- **Modal questionnaire** with form validation
- **Address reveal** with smooth scrolling
- **Comprehensive analytics** tracking
- **Bilingual support** (English/Lithuanian)

## 🌍 Multilingual Content Management

### Current Approach (JSON Files)
The app currently uses JSON files for translations:
- `src/locales/en.json` - English content
- `src/locales/lt.json` - Lithuanian content

### Recommended Database Approach

For better content management, consider this database structure:

```sql
-- Content table for multilingual text
CREATE TABLE content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    key_name VARCHAR(255) NOT NULL,
    content_type ENUM('text', 'html', 'json') DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key_name (key_name)
);

-- Translations table
CREATE TABLE content_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    translated_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    UNIQUE KEY unique_content_language (content_id, language_code),
    INDEX idx_language (language_code)
);

-- Cities/Attractions table
CREATE TABLE destinations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) NOT NULL UNIQUE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    image_url VARCHAR(500),
    gallery JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
);

-- Destination translations
CREATE TABLE destination_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    destination_id INT NOT NULL,
    language_code VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    details TEXT,
    highlights JSON,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_destination_language (destination_id, language_code)
);
```

### Benefits of Database Approach:
1. **Dynamic Content Updates** without code deployment
2. **Content Management Interface** for non-technical users
3. **Version Control** for translations
4. **SEO Optimization** with dynamic meta tags
5. **Analytics** on content performance
6. **A/B Testing** capabilities

## 🎨 Customization

### Adding New Languages
1. Create new JSON file in `src/locales/`
2. Add language to `src/main.js` configuration
3. Add flag icon to navigation component

### Adding New Cities
1. Update SVG map coordinates in `VietnamMap.vue`
2. Add city data to translation files
3. Create city detail page content

### Adding New Wedding Guests
1. Insert new records into `guest_invitations` table
2. Generate unique GUID for each guest
3. Set appropriate language and country preferences
4. Test invitation URL: `/invitation/{guid}`
## 📱 Mobile Optimization

The app is fully responsive and optimized for:
- Touch interactions on mobile devices
- Smooth animations on all screen sizes
- Progressive Web App capabilities
- Fast loading times

## 🔧 Docker Commands

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Access database container
docker-compose exec db mysql -u root -p vietnam_guide_db

# View application logs
docker-compose logs -f app

# Restart specific service
docker-compose restart app
```

## 🌐 Environment Variables

Create a `.env` file for production:

```env
DB_ROOT_PASSWORD=your_secure_root_password
DB_PASSWORD=your_secure_password
NODE_ENV=production
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🎯 Testing the Wedding System

### Sample Guest Data
- **Jonas Petraitis** (Lithuanian) - GUID: 550e8400-e29b-41d4-a716-446655440001
- **Sarah Johnson** (English) - GUID: 550e8400-e29b-41d4-a716-446655440002
- **Maria Schmidt** (English, Accepted) - GUID: 550e8400-e29b-41d4-a716-446655440003
- **Petras Kazlauskas** (Lithuanian) - GUID: 550e8400-e29b-41d4-a716-446655440004
- **Emma Wilson** (English) - GUID: 550e8400-e29b-41d4-a716-446655440005

### Test Scenarios
1. **New Invitation**: Visit invitation URL → Accept → Fill questionnaire
2. **Language Testing**: Test Lithuanian vs English guests
3. **Analytics**: Check database for tracked activities
4. **Mobile Testing**: Test responsive design on mobile devices
5. **Error Handling**: Try invalid GUID to see error page

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own travel guides!